const express = require("express");
const cors = require("cors");
const fsSync = require("fs");
const path = require("path");
const llm = require("./lib/llm");
const leads = require("./lib/leads");
const rateLimit = require("./lib/rateLimit");

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "change-me";
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function requireAdmin(req, res, next) {
  const secret = req.header("x-admin-secret");
  if (!secret || secret !== ADMIN_SECRET) {
    res.status(401).json({ error: "Admin access required." });
    return;
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "saket-portfolio",
    assistant: { configured: llm.isConfigured(), model: llm.OPENAI_MODEL }
  });
});

// Public Ask-Saket chat. Rate-limited because anyone can hit it.
app.post("/api/chat", rateLimit, async (req, res) => {
  if (!llm.isConfigured()) {
    res.status(503).json({ error: "The assistant is not configured. Set OPENAI_API_KEY on the server." });
    return;
  }
  const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const cleaned = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }))
    .slice(-16);

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    res.status(400).json({ error: "Send a non-empty user message." });
    return;
  }

  try {
    const result = await llm.runAssistant(cleaned);
    res.json({ reply: result.content, actions: result.actions, toolsUsed: result.toolsUsed });
  } catch (error) {
    console.error("Assistant error:", error.message);
    res.status(502).json({ error: `Assistant failed: ${error.message}` });
  }
});

// Direct lead capture (a contact form can POST here; complements the capture_lead tool).
app.post("/api/lead", async (req, res) => {
  const body = req.body || {};
  if (!body.email || !String(body.email).includes("@")) {
    res.status(400).json({ error: "A valid email is required." });
    return;
  }
  try {
    const lead = await leads.save(body);
    res.status(201).json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("Lead save failed:", error.message);
    res.status(500).json({ error: "Could not save your message. Try emailing directly." });
  }
});

// Admin: view captured leads.  GET with header  x-admin-secret: <ADMIN_SECRET>
app.get("/api/admin/leads", requireAdmin, async (req, res) => {
  try {
    res.json(await leads.list());
  } catch (error) {
    res.status(500).json({ error: "Could not read leads." });
  }
});

// Serve the built frontend (after `npm run build --prefix frontend`).
if (fsSync.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get("*", (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Saket portfolio API running on http://localhost:${PORT}`);
  console.log(
    llm.isConfigured()
      ? `Ask-Saket enabled with OpenAI model ${llm.OPENAI_MODEL}.`
      : "Ask-Saket is disabled; set OPENAI_API_KEY to enable the chatbot."
  );
  console.log(`Admin secret is ${ADMIN_SECRET === "change-me" ? "the dev default — change it before deploy." : "set."}`);
});

const fs = require("fs/promises");
const path = require("path");

// Recruiter/visitor lead capture. Mirrors pocbiotech's quote pipeline: append to
// a JSON file and notify by email via Resend (raw fetch). If Resend isn't
// configured, the lead is still saved and printed to the server log.

const DATA_DIR = path.join(__dirname, "..", "data");
const LEADS_FILE = process.env.LEADS_PATH?.trim() || path.join(DATA_DIR, "leads.json");
const LEAD_TO_EMAIL = process.env.LEAD_TO_EMAIL?.trim() || "saketmundhada7@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const RESEND_FROM = process.env.RESEND_FROM?.trim() || "Saket Portfolio <onboarding@resend.dev>";

async function ensureFile() {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]\n");
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(LEADS_FILE, "utf8");
  try { return JSON.parse(raw || "[]"); } catch { return []; }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, `${JSON.stringify(list, null, 2)}\n`);
}

function clean(lead) {
  return {
    id: `LEAD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: String(lead.name || "").trim(),
    email: String(lead.email || "").trim().toLowerCase(),
    company: String(lead.company || "").trim(),
    role: String(lead.role || "").trim(),
    notes: String(lead.notes || "").trim()
  };
}

async function notifyResend(lead) {
  if (!RESEND_API_KEY) {
    console.log("[lead] Resend not configured. New lead:\n", JSON.stringify(lead, null, 2));
    return { delivery: "logged" };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [LEAD_TO_EMAIL],
        reply_to: lead.email || undefined,
        subject: `Portfolio lead — ${lead.name || "someone"}${lead.company ? ` @ ${lead.company}` : ""}`,
        text: `New lead from your portfolio chatbot\n\n` +
          `Name: ${lead.name || "-"}\nEmail: ${lead.email || "-"}\nCompany: ${lead.company || "-"}\n` +
          `Role: ${lead.role || "-"}\nNotes: ${lead.notes || "-"}\nWhen: ${lead.createdAt}`
      })
    });
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || "Resend email failed.");
  return { delivery: "emailed", providerId: data.id };
}

async function save(rawLead) {
  const lead = clean(rawLead);
  const list = await readAll();
  list.unshift(lead);
  await writeAll(list);
  try {
    await notifyResend(lead);
  } catch (err) {
    console.error("[lead] email failed:", err.message);
  }
  return lead;
}

function list() {
  return readAll();
}

module.exports = { save, list };

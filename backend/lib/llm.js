const fs = require("fs");
const path = require("path");
const leads = require("./leads");

// "Ask-Saket" — an OpenAI tool-calling agent over Saket's resume. Mirrors the
// pocbiotech llm.js pattern: raw fetch to keep deps tiny, a multi-step tool
// loop, and tools that either return data (analyze_job_fit) or emit client-side
// UI actions (show_project, scroll_to, download_resume, open_booking) and a
// server-side lead capture. Returns { content, actions, toolsUsed }.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_STEPS = 6;
const MAX_TOOL_CHARS = 8000;
const REQUEST_TIMEOUT_MS = 45000;

const RESUME_PATH = path.join(__dirname, "..", "..", "resume.md");
const CONTENT_PATH = path.join(__dirname, "..", "..", "frontend", "src", "content.json");

const VALID_SECTIONS = ["hero", "projects", "experience", "skills", "education", "contact"];

function isConfigured() {
  return Boolean(OPENAI_API_KEY);
}

function loadText(p, fallback = "") {
  try { return fs.readFileSync(p, "utf8"); } catch { return fallback; }
}

function loadContent() {
  try { return JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8")); } catch { return {}; }
}

function projectBrief(p) {
  return { slug: p.slug, title: p.title, tags: p.tags, summary: p.summary };
}

const TOOLS = [
  {
    type: "function",
    function: {
      name: "analyze_job_fit",
      description: "Call this whenever the user pastes or describes a job posting or role. Returns Saket's projects and skills so you can explain, specifically, why he fits.",
      parameters: {
        type: "object",
        properties: { jd_text: { type: "string", description: "The pasted job description or a short role summary." } },
        required: ["jd_text"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_project",
      description: "Surface a project card on the page while you talk about it.",
      parameters: {
        type: "object",
        properties: { slug: { type: "string", enum: ["webgpt", "student-landing", "cropgpt", "designgpt"] } },
        required: ["slug"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "scroll_to",
      description: "Scroll the page to a section so the user can see it.",
      parameters: {
        type: "object",
        properties: { section: { type: "string", enum: VALID_SECTIONS } },
        required: ["section"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "download_resume",
      description: "Trigger a download of Saket's resume PDF for the user.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "open_booking",
      description: "Open Saket's contact/booking option so the user can reach out directly.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "capture_lead",
      description: "Save a recruiter or visitor's details after they share them. Ask for at least an email first; name, company, and the role they're hiring for are a bonus.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          company: { type: "string" },
          role: { type: "string", description: "Role they're hiring for, or their own title." },
          notes: { type: "string" }
        },
        required: ["email"]
      }
    }
  }
];

// name -> implementation. ctx = { content, actions }. Client-action tools push
// onto ctx.actions and return a small ack; the frontend performs the action.
const TOOL_IMPL = {
  analyze_job_fit: (_args, ctx) => ({
    looking_for: ctx.content.lookingFor,
    summary: ctx.content.summary,
    projects: (ctx.content.projects || []).map(projectBrief),
    skills: ctx.content.skills,
    instruction: "Map the pasted role to Saket. Name the 2-3 most relevant projects and the matching skills, and be specific and confident but only use facts present here."
  }),
  show_project: (args, ctx) => {
    const slug = String(args.slug || "").trim();
    const ok = (ctx.content.projects || []).some((p) => p.slug === slug);
    if (ok) ctx.actions.push({ type: "show_project", slug });
    return ok
      ? { ok: true, shown: slug }
      : { ok: false, error: `Unknown slug. Valid: ${(ctx.content.projects || []).map((p) => p.slug).join(", ")}` };
  },
  scroll_to: (args, ctx) => {
    const section = String(args.section || "").trim();
    if (!VALID_SECTIONS.includes(section)) return { ok: false, error: `Valid sections: ${VALID_SECTIONS.join(", ")}` };
    ctx.actions.push({ type: "scroll_to", section });
    return { ok: true, scrolledTo: section };
  },
  download_resume: (_args, ctx) => {
    ctx.actions.push({ type: "download_resume" });
    return { ok: true };
  },
  open_booking: (_args, ctx) => {
    ctx.actions.push({ type: "open_booking" });
    return { ok: true };
  },
  capture_lead: async (args, ctx) => {
    const email = String(args.email || "").trim();
    if (!email.includes("@")) return { ok: false, error: "Ask the user for a valid email before saving." };
    const lead = await leads.save({ name: args.name, email, company: args.company, role: args.role, notes: args.notes });
    ctx.actions.push({ type: "lead_captured" });
    return { ok: true, saved: true, id: lead.id };
  }
};

function buildSystemPrompt(content) {
  const resume = loadText(RESUME_PATH);
  const slugs = (content.projects || []).map((p) => p.slug).join(", ");
  const email = content.email || "saketmundhada7@gmail.com";
  return [
    `You are "Ask-Saket", the AI assistant embedded in Saket Mundhada's portfolio website.`,
    `You speak about Saket in the third person to recruiters and hiring managers. Saket is targeting Forward Deployed Engineer / Applied AI roles.`,
    ``,
    `=== Saket's resume (your ONLY source of truth) ===`,
    resume,
    `=== end resume ===`,
    ``,
    `Project slugs available to show_project: ${slugs}.`,
    ``,
    `How to behave:`,
    `- Answer ONLY from the resume above. Never invent employers, dates, numbers, or facts. If it isn't there, say so.`,
    `- Be assertive and specific about Saket's strengths, but stay interview-defensible — no claims beyond what's written.`,
    `- Keep replies concise and concrete: short paragraphs or tight bullet lists.`,
    `- When your answer centers on a project, call show_project (and/or scroll_to) so the page follows along.`,
    `- If the user pastes or describes a job/role, call analyze_job_fit first, then write a tailored "why Saket fits" naming the most relevant projects.`,
    `- If the user shows hiring intent or wants to connect, ask for their name, email, company, and the role, then call capture_lead. Offer open_booking to reach out and download_resume for the PDF.`,
    `- For anything off-topic or not in the resume, say so briefly and point them to ${email}.`
  ].join("\n");
}

async function callOpenAI(messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        tools: TOOLS,
        tool_choice: "auto",
        temperature: 0.3
      })
    });
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI request failed (${response.status}).`);
  }
  return data;
}

/**
 * history: array of { role:'user'|'assistant', content }.
 * Returns { content, actions, toolsUsed }.
 */
async function runAssistant(history) {
  if (!isConfigured()) throw new Error("OPENAI_API_KEY is not configured.");
  const content = loadContent();
  const ctx = { content, actions: [] };
  const toolsUsed = [];
  const messages = [{ role: "system", content: buildSystemPrompt(content) }, ...history];

  for (let step = 0; step < MAX_STEPS; step++) {
    const data = await callOpenAI(messages);
    const message = data.choices?.[0]?.message;
    if (!message) throw new Error("OpenAI returned no message.");
    messages.push(message);

    const calls = message.tool_calls || [];
    if (calls.length === 0) {
      return { content: message.content || "", actions: ctx.actions, toolsUsed };
    }

    for (const call of calls) {
      const name = call.function?.name;
      let args = {};
      try { args = JSON.parse(call.function?.arguments || "{}"); } catch { args = {}; }
      let result;
      try {
        const impl = TOOL_IMPL[name];
        result = impl ? await impl(args, ctx) : { error: `Unknown tool: ${name}` };
      } catch (err) {
        result = { error: err.message };
      }
      toolsUsed.push(name);
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result).slice(0, MAX_TOOL_CHARS) });
    }
  }

  return {
    content: `Let me hand you straight to Saket — email ${content.email || "saketmundhada7@gmail.com"}.`,
    actions: ctx.actions,
    toolsUsed
  };
}

module.exports = { runAssistant, isConfigured, OPENAI_MODEL };

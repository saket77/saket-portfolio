# Saket Mundhada — Portfolio + "Ask-Saket" AI Chatbot

A deployable portfolio site whose centerpiece is an **AI chatbot that knows Saket's resume** — it answers recruiter questions, tailors a "why I fit" pitch from a pasted job description, drives the page (scroll to / highlight projects, download the resume), and captures recruiter leads. The site itself is the proof: an applied-AI / forward-deployed agent in production.

Same shape as the `pocbiotech-website` repo: a **Vite + React** frontend and an **Express** backend that serves the built frontend and exposes the API, deployed as a single **Railway** service.

```
saket-portfolio/
├─ resume.md                 # the bot's source of truth (prose)
├─ railway.json              # Railway / Nixpacks build + start
├─ package.json              # root: build (frontend) + start (backend)
├─ frontend/                 # Vite + React + lucide-react
│  ├─ public/Saket_Mundhada_FDE_resume.pdf
│  └─ src/{App.jsx, Chat.jsx, styles.css, content.json}   # content.json = structured page + bot data
└─ backend/                  # Express
   ├─ server.js              # /api/chat, /api/lead, /api/admin/leads, serves frontend/dist
   ├─ lib/llm.js             # OpenAI tool-calling agent (Ask-Saket)
   ├─ lib/leads.js           # lead capture -> leads.json + Resend email
   └─ lib/rateLimit.js       # per-IP limit on the public chat
```

## What the bot can do (tools)
- `analyze_job_fit(jd_text)` — paste a JD, get a tailored fit pitch with the most relevant projects.
- `show_project(slug)` / `scroll_to(section)` — the bot drives the page while it talks.
- `download_resume()` / `open_booking()` — on-page actions.
- `capture_lead({name,email,company,role,notes})` — saves the recruiter to `leads.json` and emails you.

Edit **`resume.md`** (what the bot knows) and **`frontend/src/content.json`** (what the page shows + the bot's structured data) to update everything. That's your single source of truth.

## Prerequisites
- Node 18+
- An OpenAI API key
- (optional) a Resend API key for lead emails

## Local development
```bash
# from the repo root, install both apps
npm run install:all          # or: npm i --prefix backend && npm i --prefix frontend

# set env (copy and fill in)
cp .env.example backend/.env # backend reads process.env; load it how you prefer

# Terminal 1 — backend (port 4000)
OPENAI_API_KEY=sk-... npm run dev:backend

# Terminal 2 — frontend (port 5173, proxies /api -> 4000)
npm run dev:frontend
```
Open http://localhost:5173. The Vite dev server proxies `/api` to the backend.

> Tip: load `backend/.env` automatically with `node --env-file=backend/.env backend/server.js` (Node 20+), or use a process manager. Never commit real keys.

## Production build (what Railway runs)
```bash
npm run build      # builds frontend -> frontend/dist
npm start          # Express serves frontend/dist + the API on $PORT
```

## Deploy on Railway
1. Push this folder to a Git repo and create a Railway service from it. `railway.json` handles build + start.
2. Set environment variables (Railway → Variables):
   - `OPENAI_API_KEY` (required), `OPENAI_MODEL` (default `gpt-4o`)
   - `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_TO_EMAIL` (lead emails; optional)
   - `ADMIN_SECRET` (to read captured leads)
   - `CHAT_RATE_WINDOW_MS`, `CHAT_RATE_MAX` (optional rate-limit tuning)
3. **Persist leads across deploys:** add a Railway Volume and set `LEADS_PATH=/data/leads.json` (mount the volume at `/data`). Otherwise `leads.json` resets on redeploy.
4. Add your custom domain in Railway when ready.

## Admin: view captured leads
```bash
curl -H "x-admin-secret: $ADMIN_SECRET" https://your-app.up.railway.app/api/admin/leads
```

## Notes / next steps
- The OpenAI key lives only on the server; the browser never sees it.
- Lead storage uses a JSON file (like pocbiotech's quotes). Swap to `better-sqlite3` if you want querying.
- Set `bookingUrl` in `content.json` (e.g. a Calendly link) to enable the bot's "book a call" action.
- Phase ideas: streaming responses, richer JD-fit formatting, conversation logging, analytics.

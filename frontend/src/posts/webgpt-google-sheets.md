---
title: WebGPT now works in all spreadsheets — Google Sheets + Excel
date: 2026-06-24
slug: webgpt-google-sheets
summary: With Google Sheets added next to Excel, WebGPT proves the connector model — one planner loop, many surfaces — and points to a future where you add a connector for any app yourself.
tags: webgpt, google-sheets, spreadsheets, connectors
---

WebGPT now works in **all spreadsheets** — Microsoft Excel *and* Google Sheets.

> ▶ **Watch the 30-second demo:** _add your Google Sheets short link here_

## Connect once, then just ask

OAuth is already connected, so there's no login dance per run. You give it the task — in the demo, *a sample expense sheet with five rows and a totals cell* — and WebGPT **edits the sheet directly** through the Google Sheets API. Same as the Excel post: the model decides what the sheet should contain; the connector handles how.

## The connector model, paying off

Here's why I built it this way. Excel and Google Sheets look like two different products, but to WebGPT they're the **same kind of thing**: API-backed surfaces. Adding Google Sheets next to Excel wasn't a rewrite — it was adding another **connector** behind the same planner loop.

That's the payoff of keeping a crisp runtime/planner boundary and treating every integration as a connector:

- One agent loop, many surfaces.
- New capability = new connector, not new agent.
- API access where it exists (spreadsheets), DOM where it doesn't (arbitrary websites) — same mental model either way.

## Released to beta — and what's next

WebGPT is **out to beta users now**, and I'm building on it constantly. A few things I'm working toward:

- **A user-facing skill to create a connector for *any* website yourself** — through the DOM or the site's API — without writing adapter code. WebGPT handles the messy auth, including **OAuth and PKCE**, so connecting a new tool is a setup step, not an engineering project.
- **Promoting heavy-use sites to first-class surfaces.** Tools you automate a lot (like Dotloop) graduate from a DOM site adapter to an API-backed surface for real speed.

The goal is the same one I started with: browser agents for real tools, not just clicking around.

---

**Links:** [WebGPT on GitHub](https://github.com/saket77/webgpt-frontend) · [start here: what WebGPT is](/blog/building-webgpt). Want the technical details? Ask the assistant on my site.

---
title: One run, two surfaces — WebGPT goes spreadsheet → browser → spreadsheet
date: 2026-06-27
slug: webgpt-cross-surface
summary: Most automation gets stuck on one surface. WebGPT takes addresses from a spreadsheet, researches each one on a website, and writes the results back — one continuous, cross-surface workflow.
tags: webgpt, cross-surface, spreadsheets, browser-agents, connectors
---

Most automation gets stuck on one surface.

A spreadsheet formula stays in the sheet. A browser script stays in the browser. The moment a real workflow needs *both* — read some rows, go research them somewhere, bring the answers back — you're stuck doing the in-between by hand.

WebGPT works across both.

> ▶ **Watch the 30-second demo:** _add your short 4 link here_

## The task

I gave WebGPT one plain-language instruction:

> "Take the addresses in this spreadsheet, look each one up on Philadelphia's property site, and fill in the missing columns."

Here's what it did, in a single continuous run:

1. **Read the rows** from the spreadsheet — the list of addresses to enrich.
2. **Switched into the browser** and searched each address on Philadelphia's property site.
3. **Extracted exactly what the sheet was asking for** — zoning, owner, frontage, and lot size.
4. **Went back to the spreadsheet** and wrote each result into the right row.

No copy-paste. No glue script shuttling data between two tools. One workflow, two surfaces.

## Why this works: the connector model

To WebGPT, a spreadsheet and a website aren't different *kinds* of problems — they're just two different **connectors** behind the same agent. The spreadsheet is an API-backed surface; the website is a DOM surface. The planner loop is the same either way.

The hard part isn't reading a sheet or scraping a page in isolation — plenty of tools do one or the other. The hard part is **carrying state across the boundary**: knowing which row you're enriching, switching surfaces, doing the lookup, and coming back to write the answer in the right place. That cross-surface continuity is the whole point.

## Why it matters

Once an agent can move between surfaces and keep its place, a lot of tedious work collapses into a sentence:

- **Lead-gen** — a list of businesses → enriched with phone, site, and address.
- **Property research** — a list of addresses → zoning, owner, lot details (exactly the demo).
- **Job tracking, CRM hygiene, ops** — any "go look this up and fill the column" task.

That's the wedge: not *just* browsing, and not *just* editing a sheet. One continuous workflow across both.

---

**Links:** [WebGPT on GitHub](https://github.com/saket77/webgpt-frontend). Curious how the cross-surface handoff works under the hood? Ask the assistant on my site.

---
title: Teaching a browser agent to use Microsoft Excel — as a connector
date: 2026-06-23
slug: webgpt-excel
summary: A spreadsheet isn't a DOM you click. So WebGPT talks to Microsoft Excel through the Graph API as a first-class connector, with OAuth handled in settings.
tags: webgpt, excel, microsoft-graph, connectors
---

WebGPT just crossed into Excel. — **Microsoft Excel**. 

> ▶ **Watch the 30-second demo:** [demo](https://youtube.com/shorts/ar3Ihxkh4dU?feature=share)

That distinction matters, because a spreadsheet isn't really a website. Trying to drive Excel by clicking cells through the DOM is brittle and slow — the layout shifts, virtualized grids don't render every cell, and one wrong click corrupts the sheet. So WebGPT doesn't treat Excel as a page to click. It treats it as a **connector**, backed by the Microsoft Graph API.

## Connect once, in settings

You connect Microsoft from WebGPT's settings — the standard OAuth handshake with a tenant ID, client ID, and redirect URI. Once that's done, WebGPT can read and write workbooks on your behalf through Graph. No per-run login, no screen-scraping.

## Then just give it the task

In the demo, the goal is simple: *an expense sheet with five rows plus a total cell.* WebGPT plans it and **writes the workbook directly** — rows, values, and a real total — through the API. The model decides *what* the sheet should contain; the Excel connector handles *how* to make it exist.

## Why this is a connector, not a special case

This is the part I care about. Adding Excel didn't change WebGPT's planner loop at all. The agent still takes a natural-language goal, plans, and executes — it just routes through a different **surface client** underneath. Excel is one flavor of connector; a site adapter for a messy website is another; Google Sheets is a third.

That's the whole bet behind WebGPT's architecture: keep the planner loop constant, and make new capabilities a matter of *adding a connector* rather than rewriting the agent. API-backed surfaces like Excel get you speed, reliability, and real spreadsheet semantics (formulas, structured ranges) that DOM clicking can never match.

Browser agents for real work — not just clicking around.

---

**Links:** [WebGPT on GitHub](https://github.com/saket77/webgpt-frontend). Next: the same agent in Google Sheets, and why one planner loop across spreadsheet surfaces matters.

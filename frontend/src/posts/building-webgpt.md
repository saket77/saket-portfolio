---
title: Building WebGPT — an open-source runtime for AI browser agents
date: 2026-06-20
slug: building-webgpt
summary: What WebGPT is, how it's built, and the connector model that lets one agent work across real websites, spreadsheets, and PDF-heavy workflows.
tags: webgpt, agents, browser, connectors
---

Most "AI workflow" tools break the moment they touch a messy, real-world web app. WebGPT is my attempt to fix that: an open-source Chrome runtime for AI browser agents that turns a plain-English goal into actually-executed work across websites, spreadsheets, and PDF-heavy workflows.

> ▶ **Watch the demo:** [WebGPT in action](https://youtu.be/J1yGDs0M-gA)

## What it does

You give it a goal in plain English. WebGPT observes the current tab, extracts structured state, plans the steps, and executes them — pausing for your confirmation before anything sensitive. When a run succeeds, you can save it as a routine and replay it across new inputs.

It ships as a **Chrome MV3 extension** with a **hosted planner backend**: a sidepanel UX on the front, an Express command/result API on the back.

## How it's built: a clean runtime/planner boundary

The thing I care most about architecturally is the boundary. Most browser agents fuse planning, browser execution, and app-specific logic into one tangled loop. WebGPT splits them:

- **The extension owns execution.** Browser state extraction, action execution, navigation handling, sidepanel UX, runtime auth, human confirmation.
- **The backend owns planning.** It's swappable — point the extension at the hosted planner, or at *any* backend that speaks the documented HTTP contract (there's an OpenAPI spec for it).

That separation means I can iterate on the planner without touching the runtime, and someone else can bring their own planner without forking the extension.

## The connector model

Here's the idea I'm most excited about. Instead of hard-coding support for each app, WebGPT treats every integration as a **connector** — and connectors come in different flavors:

- **Site adapters** add domain-specific reliability for specific websites where generic DOM extraction isn't enough. They enrich state and provide stable mappings; they don't execute actions or call the planner directly.
- **Runtime surfaces** route non-DOM products like **Google Sheets** and **Microsoft Excel** through dedicated API clients, while keeping the *same* planner loop.
- **Document-aware connectors** let high-friction apps like Dotloop expose real editable document overlays while the backend vision path reads rendered PDF pages when the DOM does not contain enough text.

If you've used Claude's connectors or thought about MCP, the mental model will feel familiar: you teach the agent a new app by adding a connector, not by rewriting the agent. Adding Excel didn't change the planning loop — it added a connector. (More on the Excel and Sheets connectors in the next two posts.)

## Structured state over screenshots

WebGPT extracts structured browser state — URLs, frames, visible text, controls, labels, scroll containers, adapter-provided hints, and runtime-specific state — instead of throwing raw screenshots at the model. When a document view is effectively visual, the connector can hand the backend rendered page images for vision extraction, then return compact text and field data to the planner. That gives the planner a far cleaner interface than pixel-only reasoning while still covering pages where the DOM is not enough.

## Human-in-the-loop and recovery

Real automation is mostly edge cases. WebGPT handles the un-glamorous parts: it pauses for human confirmation before sensitive actions, accepts human hints when it's unsure, detects likely navigation and waits for the new document before resuming, and confirms success at the end.

## Replayable routines

A one-off agent run is a demo. A *saved, replayable* run is infrastructure. WebGPT turns successful runs into reusable routines that re-run across new inputs — so you're not paying for the model to rediscover every click each time. That's the workflow layer, and it's the next post.

## What shipping it taught me

The biggest lessons came from putting WebGPT in front of a real operations team (the Student Landing work). Production hardened everything — the Dotloop connector, field mapping, replay, and the human-review patterns. You don't learn where an agent breaks until a real operator runs it on a Tuesday afternoon with a deadline.

That's the loop I care about: build the prototype, embed with the customer, ship it, and let real usage tell you what reusable infrastructure actually needs to exist.

## Released to beta — and what's next

WebGPT is **released to beta users**, and I'm building on it constantly. The feature I'm most excited about next: a **user-facing skill that lets anyone create a connector for any website** — through the DOM or the site's API — without writing adapter code. WebGPT handles the messy parts of auth for you, including **OAuth and PKCE**, so connecting a new tool is a setup step, not an engineering project. The same path takes heavy-use sites (like Dotloop) from a DOM site adapter to a first-class, API-backed surface for speed.

---

**Code:** [WebGPT frontend — the Chrome runtime](https://github.com/saket77/webgpt-frontend) · [WebGPT backend — the planner](https://github.com/saket77/webgpt-backend) · [Demo](https://youtu.be/J1yGDs0M-gA). Questions? The assistant on my site knows this project well — ask it anything.

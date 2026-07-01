---
title: Browser agents that don't start from zero — reusable templates in WebGPT
date: 2026-06-22
slug: webgpt-reusable-templates
summary: Most browser agents re-plan every run. WebGPT saves a successful run as a routine and replays it across new inputs — faster, cheaper, and far more reliable.
tags: webgpt, agents, templates, automation
---

Most browser agents start from zero. Every single run, the model re-reads the page, re-reasons about what to click, and re-discovers the same path it found yesterday. That's slow, expensive, and flaky — the agent can make a different decision each time.

WebGPT doesn't work that way.

> ▶ **Watch the 30-second demo:** [Reusable templates in WebGPT](https://youtube.com/shorts/Y_MClhc6Khg)

## The idea: save the successful path

WebGPT reads the page and acts directly in Chrome. When a run succeeds, you can **save that successful path as a routine** — a template of the steps that actually worked. Next time, you don't re-plan from scratch. You give the template a new input — say, a different address — and run it. Same workflow, new data.

In the demo, that workflow is a Philadelphia property lookup. WebGPT searches the property site, extracts the needed details, saves the successful path, and then runs the same routine for a new property input — producing a completed summary without rediscovering every click.

## Why this matters

Think of a template as a captured, connector-level workflow. Once a path is known to work, replaying it is:

- **Faster** — no full re-planning loop on every run.
- **Cheaper** — far fewer LLM calls; you're executing a known plan, not re-deriving it.
- **More reliable** — deterministic replay instead of a fresh (and possibly different) plan each time.

This is the difference between a one-off agent demo and actual automation infrastructure. A demo runs once. A routine runs every Tuesday.

## How it works under the hood

The runtime extracts structured state and executes actions through WebGPT's connectors (DOM, or an API-backed surface). On success, the run is captured as a replayable routine with input binding — the parts that change between runs (an address, a name, a row of data) become parameters. On replay, WebGPT substitutes the new inputs, runs a preflight to confirm the route still looks valid, and executes.

Because the connectors and the planner are cleanly separated, a template isn't brittle screen-scraping glue — it's a workflow defined over the same surfaces the agent already understands.

## Where it pays off

This is exactly what made the forward-deployed work viable. When I deployed WebGPT with a real estate operations team, the win wasn't "an AI clicked some buttons once." It was that an operator could run the *same* workflow across new addresses, files, or forms every day without babysitting a fresh plan each time.

Repeatable browser agents, built in public.

---

**Links:** [WebGPT on GitHub](https://github.com/saket77/webgpt-frontend). Next up: teaching the agent to use Microsoft Excel as a connector.

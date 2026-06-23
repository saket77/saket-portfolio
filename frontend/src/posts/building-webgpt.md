---
title: Building WebGPT — turning natural-language goals into executed workflows
date: 2026-06-20
slug: building-webgpt
summary: Why I built an open-source browser/spreadsheet agent platform, and what shipping it to real users taught me about reusable agent infrastructure.
tags: webgpt, agents, browser, forward-deployed
---

I keep coming back to one idea: most "AI workflow" tools break the moment they touch a messy, real-world web app. WebGPT is my attempt to fix that — an open-source platform that turns a natural-language goal into actually-executed work across the browser, spreadsheets, and documents.

## What it does

You give it a goal in plain English. WebGPT plans the steps, then executes them across several surfaces:

- `browser_dom` and `browser_cdp` for clicking, reading, and navigating real pages
- `google_sheets` and `microsoft_excel` for spreadsheet operations through their APIs
- replayable workflows, so a one-off run becomes a reusable routine

It ships as a **Chrome MV3 extension** with a **hosted planner backend** — a sidepanel UX on the front, an Express run/command API on the back.

## The hard part: messy web apps

Real operations don't happen on clean, well-structured pages. They happen in Dotloop, in county government portals, in tools that were never designed for automation. So WebGPT is built around **site/content adapters**: small shims that turn a brittle page into a planner-readable surface. Add an adapter, and a new messy app becomes automatable.

The runtime handles the un-glamorous reality of automation too: structured multi-frame state extraction, navigation recovery, human hints when the agent is unsure, success confirmation, and saved artifacts.

## What deploying it taught me

The biggest lessons came from putting it in front of a real operations team (see the Student Landing work). Production hardened everything — the Dotloop adapter, source-value extraction, document-field mapping, replay, and the human-review patterns. You don't learn where an agent breaks until a real operator runs it on a Tuesday afternoon with a deadline.

That's the loop I care about: build the prototype, embed with the customer, ship it, and let the real usage tell you what reusable infrastructure actually needs to exist.

## What's next

I'm extending the same intent-to-action engine into new product surfaces — that's what DesignGPT is, embedded inside Lutron web apps. More on that soon.

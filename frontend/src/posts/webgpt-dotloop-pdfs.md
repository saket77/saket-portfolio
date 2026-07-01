---
title: WebGPT can read Dotloop PDFs and fill real fields
date: 2026-07-01
slug: webgpt-dotloop-pdfs
summary: WebGPT reads rendered Dotloop PDF pages with vision, maps labels to real editable overlay fields, and fills the correct lease template boxes.
tags: webgpt, dotloop, pdfs, vision, connectors
---

The fifth public WebGPT Short is the one where the connector starts to feel like a real business workflow.

This demo runs inside Dotloop. There are two documents in the loop: a tenant source form with values like the tenant name and property address, and a lease agreement template with editable overlay fields.

## The task

WebGPT has to read the source form, open the lease agreement, understand where the matching fields live, and fill the right boxes.

That sounds simple until you look at how these documents render. A lot of PDF-style apps do not expose clean text and fields in the DOM. The page may be mostly a rendered image, with editable overlays floating on top. A human can see "Tenant legal name" and "Property address"; a generic DOM agent may only see a few positioned textareas.

## What WebGPT does

WebGPT's Dotloop connector gathers the document context from the browser, then the backend reads the rendered PDF pages with a vision model. The vision response gives WebGPT structured text, labels, field-like regions, and coordinates.

Then WebGPT maps those visual labels to the real Dotloop overlay fields. The key detail: it does **not** fill arbitrary visual blanks. It fills editable overlay boxes that Dotloop actually exposes. The matching uses rectangle overlap first, with vertical alignment weighted heavily because lease agreements tend to align labels and fields by row.

In the demo, that lets WebGPT take values from the tenant source form and place them in the correct lease agreement fields, including tenant name and property address.

## Why it matters

This is the bigger WebGPT story in miniature:

- It can click around a real web app.
- It can read a PDF-like document view when the DOM is not enough.
- It can turn vision output into planner-readable structured data.
- It can map that understanding back onto real editable fields.

That's the difference between guessing at a screenshot and operating a document workflow.

WebGPT is becoming a repeatable browser agent that works across websites, spreadsheets, PDFs, and the messy surfaces where real business work actually happens.

---

**Links:** [WebGPT on GitHub](https://github.com/saket77/webgpt-frontend) · [start here: what WebGPT is](/blog/building-webgpt).

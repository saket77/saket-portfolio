# Saket Mundhada

Philadelphia, PA | (917) 690-4451 | saketmundhada7@gmail.com | [LinkedIn](https://www.linkedin.com/in/spm1234) | [GitHub](https://github.com/saket77) | [Portfolio](https://saket-portfolio-production.up.railway.app)

## Summary

Forward-deployed, full-stack engineer who turns natural-language goals into agents that ship to real users. I built WebGPT, an open-source browser/spreadsheet agent platform, and deployed it for clients — GST reconciliation for Sachdev Associates and real-estate operations for Student Landing — on top of 4+ years shipping AI and full-stack systems at Lutron.

## Skills

**Languages:** TypeScript, JavaScript, Go, Python, Java, C#, C, C++, SQL, Bash

**AI / Applied AI:** OpenAI APIs, AWS Bedrock, RAG, MCP-style connectors, tool/function calling, planner-executor agents, browser agents, structured extraction, human-in-the-loop, evals & replay

**Frontend:** React, TypeScript, micro-frontends, Zustand, Redux, GraphQL, Vite, Chrome MV3 extensions

**Backend / Integration:** Node.js, Express, Go (Lambda, SQS, API Gateway), REST, OpenAPI, MuleSoft, Salesforce CPQ/RLM, Microsoft Graph, Google Sheets API

**Cloud / DevOps:** AWS (Lambda, S3, SQS, Bedrock, API Gateway), Azure, Railway, CI/CD (GitHub Actions, Maven), Kubernetes

## Projects

### WebGPT — Open-Source AI Workflow Agent Platform
TypeScript, React, Chrome MV3, Node.js, Express, OpenAI APIs, OpenAPI, Google Sheets API · [Demo](https://youtu.be/J1yGDs0M-gA) · [Code](https://github.com/saket77/webgpt-frontend)

- Published a Chrome extension with a deployed hosted planner backend that turns natural-language goals into executed workflows across the browser, Google Sheets, and Excel.
- Designed a connector model — MCP-server-style — where site adapters and API-backed "surfaces" are different flavors of connectors the agent plugs into, alongside bring-your-own planner backends via an OpenAPI-style contract.
- Built the Chrome runtime (sidepanel UX, state extraction, action execution, navigation recovery, replay) and the Express planner backend (command/result loops, run snapshots, artifacts, tests).

### Sachdev Associates — GST Reconciliation (WebGPT for CAs)
WebGPT, Google Sheets, connector-style tool actions, accounting-domain rules · [Code](https://github.com/saket77/webgpt-frontend)

- Built a CA-focused GST automation extension on WebGPT for Sachdev Associates, a Mumbai chartered-accountancy firm — detecting GST filing intent, reconciling invoices between the portal register (GSTR-2B) and client purchase registers with deterministic logic, and writing CA-reviewable tabs (matched, close matches, missing ITC, mismatches, portal-only, and filing-impact summaries).
- Implemented the GST engine as a modular vertical workflow layer on WebGPT — combining browser/sheet automation, connector-style tool actions, and accounting-domain rules — positioning WebGPT as an AI back-office platform for chartered accountants.

### POC Biotech — Pre-Sales Ordering Tool + Admin AI Inventory Assistant (Client Deployment)
Node.js, Express, OpenAI tool-calling, SQLite, Railway · [Site](https://pocbiotech-website-production.up.railway.app/)

- Built and deployed a pre-sales ordering website where a Mumbai pharmaceutical distributor's customers browse the catalog and submit product requests, routing each request to the owners by email — replacing manual back-and-forth with a structured pipeline.
- Added an admin-gated AI inventory assistant (OpenAI tool-calling) that helps the owners decide what to reorder — answering natural-language questions over their ERP data (stock, expiry, reorders, slow movers), grounded in read-only analytics tools and guarded SQL.
- Reduced purchasing ~3% by forecasting reorders against sitting inventory; scoped end to end with the owner and shipped as a single Railway service.

### Student Landing — Real-Estate Ops Automation (WebGPT deployment)
WebGPT, Dotloop (DOM connector), OpenAI vision (PDF prefill), Atlas Philly, Philadelphia government websites · [Code](https://github.com/saket77/webgpt-frontend)

- Embedded with Student Landing's operations team and deployed WebGPT routines that automate Dotloop lease-agreement prep and property verification against city and third-party sites.
- Built WebGPT's Dotloop connector as a DOM-driven integration, then added document understanding: WebGPT grabs the source agreement's presigned S3 link (from the page or a Dotloop REST call), runs an OpenAI vision model over the PDF, and pre-fills template fields like lease terms for human review.

### CropGPT — Intent-to-Edit Media Automation Engine
Python, FFmpeg, OpenAI APIs, image-generation models, JSON Schema · [Code](https://github.com/saket77/cropGPT)

- Translates creative intent into reusable edit actions (crop, caption, CTA placement, audio normalization, export, QA); produced the YouTube Shorts that demo WebGPT.
- Extended into generative interior-design workflows using OpenAI APIs and image-generation models: rough room plans and style intent become furnished-room image specs for review and iteration.

## Experience

### Lutron Electronics — Project Application Software Engineer, promoted to Senior (Dec 2023)
Philadelphia, PA | Jan 2022 – Present

- Built an internal AI design-assistant chatbot on AWS Bedrock, indexing Lutron's UX-principles docs (RAG) to give designers and product managers context-aware guidance and rapid validation of new UI proposals.
- Packaged WebGPT's agent engine as a Node module and embedded it into Connect Design, a Lutron-owned React web app, shipping an in-product AI agent that handles chat, planning, and execution while the app exposes its own domain skills.
- Designed distributed backend services in Go exposing standardized APIs for rule evaluation and asset generation, including a fault-tolerant image-generation pipeline (Go Lambdas, SQS, API Gateway, S3) with a decoupled producer/consumer design.
- Architected Bill-of-Materials services (hierarchical grouping, batch operations, rollback, deterministic state sync) and a MuleSoft–Go integration mapping product models to Salesforce RLM for an ERP migration.
- Built a React + TypeScript micro-frontend (container-presenter, Zustand) with real-time 3D product visualization (Threekit), cutting design rework ~40%; added Cypress visual-regression gates to CI/CD.
- Resolved 100+ production defects and multiple P1/P2 outages during a multi-system ERP transition, protecting revenue-critical quoting and ordering workflows.
- Shipped an Azure C# notification service automating high-volume quote and order communications, with retry logic, telemetry, and SLA-aligned delivery.
- Integrated a React micro-frontend into a WPF desktop application (WebView, service workers, offline caching) for a hybrid desktop–web experience with local fallback.
- Built a REST-to-LEAP translation layer for real-time control of Lutron devices — lighting, scenes, and shades — with command serialization and state validation.

### Infinite Solutions — Software Engineer
Remote | Jul 2021 – Jan 2022

- Migrated Mississippi's state healthcare-support site to AWS and refactored it to Java Spring and Angular under HIPAA; shipped WebSocket APIs for real-time updates and REST APIs for CRUD and search.

## Education

**Harrisburg University of Science and Technology** — M.S., Computer Information Sciences (in progress), Software Engineering concentration · 30 graduate credits completed

**Virginia Tech** — B.S., Computer Science · Dean's List (Spring 2020 – Spring 2021)

**Certifications:** Baruch College (CUNY) Pre-MFE Advanced Calculus & Probability, Certificate of Distinction; University of Chicago Linear Algebra & Numerical Python

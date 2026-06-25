# Saket Mundhada

Philadelphia, PA | (917) 690-4451 | saketmundhada7@gmail.com | [LinkedIn](https://www.linkedin.com/in/spm1234) | [GitHub](https://github.com/saket77) | [Portfolio](https://saket-portfolio-production.up.railway.app)

## Summary

Full-stack AI automation engineer who scopes messy business workflows, builds LLM-powered prototypes, and turns working patterns into reusable agent runtimes. Built WebGPT, an open-source browser/spreadsheet agent system; deployed WebGPT-powered workflows for a real estate operations team; and prototyped DesignGPT, an embeddable enterprise AI-agent framework for Lutron web applications. Targeting Forward Deployed / Applied AI engineering roles.

## Skills

**Languages:** TypeScript, JavaScript, Go, Python, Java, C#, C, C++, SQL, Bash

**AI / Applied AI:** OpenAI APIs, AWS Bedrock, RAG, MCP-style connectors, tool/function calling, planner-executor agents, browser agents, structured extraction, human-in-the-loop, evals & replay

**Frontend:** React, TypeScript, micro-frontends, Zustand, Redux, GraphQL, Vite, Chrome MV3 extensions

**Backend / Integration:** Node.js, Express, Go (Lambda, SQS, API Gateway), REST, OpenAPI, MuleSoft, Salesforce CPQ/RLM, Microsoft Graph, Google Sheets API

**Cloud / DevOps:** AWS (Lambda, S3, SQS, Bedrock, API Gateway), Azure, Railway, CI/CD (GitHub Actions, Maven), Kubernetes

## Projects

### WebGPT — Open-Source AI Workflow Agent Platform
TypeScript, React, Chrome MV3, Node.js, Express, OpenAI APIs, OpenAPI, Google Sheets API · [Demo](https://youtube.com/shorts/Y_MClhc6Khg) · [Code](https://github.com/saket77/webgpt-frontend)

- Published a Chrome extension with a deployed hosted planner backend that turns natural-language goals into executed workflows across the browser, Google Sheets, and Excel.
- Designed a connector model — MCP-server-style — where site adapters and API-backed "surfaces" are different flavors of connectors the agent plugs into, alongside bring-your-own planner backends via an OpenAPI-style contract.
- Built the Chrome runtime (sidepanel UX, state extraction, action execution, navigation recovery, replay) and the Express planner backend (command/result loops, run snapshots, artifacts, tests).

### WebGPT for CAs — GST Reconciliation Workflow (Sachdev Associates)
WebGPT, Google Sheets, connector-style tool actions, accounting-domain rules · [Demo](https://youtube.com/shorts/Y_MClhc6Khg) · [Code](https://github.com/saket77/webgpt-frontend)

- Built a CA-focused GST automation extension for WebGPT with Sachdev Associates, a Mumbai chartered-accountancy firm, performing invoice-level reconciliation between the GST portal register (GSTR-2B) and client purchase registers — separating matched, missing, portal-only, and close-match entries into CA-reviewable tabs.
- Designed domain-aware agent workflows that detect GST filing intent, read structured spreadsheet data, apply deterministic reconciliation logic, and write CA-reviewable tabs (matched invoices, close matches, missing ITC, mismatches, and filing-impact summaries).
- Implemented the GST engine as a modular vertical workflow layer on WebGPT — combining browser/sheet automation, connector-style tool actions, and accounting-domain rules — positioning WebGPT as an AI back-office platform for chartered accountants.

### POC Biotech — Pre-Sales Ordering Tool + Admin AI Inventory Assistant (Client Deployment)
Node.js, Express, OpenAI tool-calling, SQLite, Railway · [Site](https://pocbiotech-website-production.up.railway.app/)

- Built and deployed a pre-sales ordering website where a Mumbai pharmaceutical distributor's customers browse the catalog and submit product requests.
- Routed incoming quote requests to the owners by email, replacing manual back-and-forth with a structured pipeline.
- Added an admin-gated AI inventory assistant (OpenAI tool-calling) that helps the owners decide what to reorder — answering natural-language questions over their ERP data (stock, expiry, reorders, slow movers), grounded in read-only analytics tools and guarded SQL.
- Reduced purchasing ~3% by forecasting reorders against sitting inventory; scoped end to end with the owner and shipped as a single Railway service.

### Student Landing — Real Estate Operations Automation
WebGPT, Dotloop, Atlas Philly, Philadelphia government websites · [Demo](https://youtube.com/shorts/Y_MClhc6Khg) · [Code](https://github.com/saket77/webgpt-frontend)

- Embedded with a Philadelphia real-estate firm's operations team and deployed WebGPT routines that automate Dotloop agreement prep and property verification against city and third-party sites.
- Built WebGPT's Dotloop connector, driving Dotloop via API calls rather than brittle DOM steps — with field mapping and human-review patterns — now being promoted to a first-class "surface" (like Google Sheets) for speed.

### CropGPT — Intent-to-Edit Media Automation Engine
Python, FFmpeg, OpenAI APIs, image-generation models, JSON Schema · [Demo](https://youtube.com/shorts/Y_MClhc6Khg) · [Code](https://github.com/saket77/cropGPT)

- Translates creative intent into reusable edit actions (crop, caption, CTA placement, audio normalization, export, QA); produced WebGPT's demo videos.
- Extended into generative interior-design workflows using OpenAI APIs and image-generation models: rough room plans and style intent become furnished-room image specs for review and iteration.

## Experience

### Lutron Electronics — Project Application Software Engineer → Senior (promoted Dec 2023)
Philadelphia, PA | Jan 2022 – Present

- Built an internal AI design-assistant chatbot on AWS Bedrock, indexing Lutron's UX-principles docs (RAG) to give designers and product managers context-aware guidance and rapid validation of new UI proposals.
- Built DesignGPT, a prototype embeddable AI-agent framework — WebGPT's engine packaged as a Node module — so Lutron web applications could expose their own domain skills while the framework handled chat, planning, and execution.
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

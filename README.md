# Visual Workflow Automation

A drag-and-drop workflow builder in the spirit of n8n. You connect nodes on a
canvas — fetch a PDF, extract its text, summarise it with an LLM, branch on a
condition, send an email — save the workflow, and run it. The backend
interprets the saved graph step by step and returns a log of every step.

**[Live demo →](https://n8n-workflow-automation.vercel.app/)**

---

## What it does

| Node | What it does |
|---|---|
| **Trigger** | Starting point of every workflow; carries the input data |
| **PDF Parse** | Downloads the PDF at `pdfUrl` and extracts its text |
| **AI Summary** | Summarises the incoming text in one paragraph (Google Gemini) |
| **If / Else** | Branches to the `true` or `false` path based on the incoming data |
| **Email** | Sends the summary by email (Resend) |
| **Log** | Writes the current data to the execution log |

A typical flow: **Trigger → PDF Parse → AI Summary → Email**.

## How it works

```
┌──────────────────────────┐      POST /api/save            ┌──────────────────────┐
│  automation-ui           │ ─────────────────────────────▶ │  server (Express)    │ ──▶ Supabase (Postgres)
│  React + React Flow      │      POST /api/execute/:id     │  execution engine    │ ──▶ Gemini · Resend
│  canvas, node config     │ ◀───────────────────────────── │  step-by-step logs   │
└──────────────────────────┘      execution log             └──────────────────────┘
```

- The **canvas** stores nodes and edges as JSON; saving writes the graph to a `workflows` table.
- The **execution engine** loads the graph, starts at the trigger, and walks the edges. Each node receives the previous node's output as its input, so data flows through the workflow like a pipeline.
- **Branching** follows the `true` / `false` handle of an If / Else node.
- Every step appends to an **execution log** that's returned to the UI, so failures show exactly which node broke and why.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Flow
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL on Supabase
- **Services:** Google Gemini (summaries), Resend (email), pdf-parse

## Run it locally

You'll need Node.js 18+, a Supabase project, a Gemini API key and a Resend API key.

**1. Clone**

```bash
git clone https://github.com/AjithThaduri/n8n-workflow-automation.git
cd n8n-workflow-automation
```

**2. Create the table** — in the Supabase SQL editor:

```sql
create table workflows (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  email text,
  created_at timestamptz default now()
);
```

**3. Start the server**

```bash
cd server
npm install
cat > .env <<'ENV'
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-key
RESEND_API_KEY=your-resend-key
ENV
npm run dev            # http://localhost:8080
```

**4. Start the UI** — in a second terminal:

```bash
cd automation-ui
npm install
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev            # http://localhost:5173
```

Drag nodes onto the canvas, connect them, save, and run.

## Project layout

```
automation-ui/   React Flow canvas, node components, sidebar
server/          Express API and the workflow execution engine
```

## Ideas for next steps

- Per-workflow email recipients configured on the Email node
- Retries and timeouts per node
- Scheduled and webhook triggers
- Run history stored alongside each workflow

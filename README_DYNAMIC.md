# Emergency Triage Assistant — Dynamic README

> AI-powered clinical decision support platform for real-time emergency triage with sub-400ms response guarantees.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple?logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

This dynamic README is a living document that contains the project overview, quick start, and a few small utilities and patterns to surface runtime health and performance into badges and GitHub pages.

## What's "dynamic" here

- Quick commands to fetch live health & latency from the running backends.
- Example scripts to publish a small JSON endpoint (suitable for shields.io `endpoint` badges).
- Ready-to-copy badge snippets showing service health / SLA grade.
- Single-file reference for maintainers and CI.

## Quick status badges (examples)

The most practical way to show live project state in a README is with shields.io `endpoint` badges. They expect a public JSON URL that returns a simple shape.

Example JSON shape for a health badge (HTTP GET the URL):

```json
{ "schemaVersion": 1, "label": "ERT SLA", "message": "EXCELLENT (312ms)", "color": "brightgreen" }
```

Shields badge URL:

```
https://img.shields.io/endpoint?url=<URL-ENCODED-HEALTH-ENDPOINT>
```

Note: For local dev you can run a tiny server or use GitHub Actions / Vercel to host a small JSON file that your badge points to.

## Small helper: poll health and expose JSON for badges

Below is an example Node script you can run on a public host (or GitHub Actions) that polls the Node/FastAPI `/health` endpoints and writes a small JSON for shields.io.

Save as `backend/scripts/generate_shields_health.js` and run with `node`.

```js
// Minimal example — run on any public host (or CI) and serve the output as JSON
import fetch from 'node-fetch';
import fs from 'fs';

const NODE_HEALTH = 'http://your-host:5001/health';
const FASTAPI_HEALTH = 'http://your-host:8000/health';

async function getHealth(url){
  try{
    const res = await fetch(url, { timeout: 2000 });
    if(!res.ok) throw new Error('not-ok');
    const json = await res.json();
    return { ok: true, json };
  }catch(e){
    return { ok: false, error: String(e) };
  }
}

function grade(ms){
  if(ms < 400) return { message: `EXCELLENT (${ms}ms)`, color: 'brightgreen' };
  if(ms < 600) return { message: `GOOD (${ms}ms)`, color: 'yellow' };
  return { message: `SLOW (${ms}ms)`, color: 'red' };
}

(async ()=>{
  const n = await getHealth(NODE_HEALTH);
  const f = await getHealth(FASTAPI_HEALTH);

  const nodeMs = n.ok && n.json?.performance?.total_ms ? n.json.performance.total_ms : null;
  const fastMs = f.ok && f.json?.performance?.total_ms ? f.json.performance.total_ms : null;

  const out = {
    node: n.ok ? 'up' : 'down',
    nodeMs,
    fastapi: f.ok ? 'up' : 'down',
    fastMs,
    summary: nodeMs ? grade(nodeMs) : { message: 'DOWN', color: 'red' }
  };

  fs.writeFileSync('./public/ert_health.json', JSON.stringify({
    schemaVersion: 1,
    label: 'ERT SLA',
    message: out.summary.message,
    color: out.summary.color
  }));

  console.log('Wrote ./public/ert_health.json', out);
})();
```

Serve `./public/ert_health.json` from a public URL and point a Shields badge at it:

```
[![ERT SLA](https://img.shields.io/endpoint?url=https://my-host.com/ert_health.json)](https://my-host.com/)
```

## Project Quick Reference

This dynamic README condenses the fuller docs in the repo. For deeper background see the original `README.md` and the various `*.md` docs in the repo root.

- Node backend (Express) — Port 5001 — Triage & Hybrid LLM
- FastAPI backend — Port 8000 — RAG, PDF ingestion, Protocol Engine
- React frontend — Port 3000 — Dashboard & Patient Portal

## Prerequisites

- Node.js >= 18
- Python >= 3.10
- npm >= 9
- Ollama installed & `phi3:mini` pulled (local inference)

## Quick start (dev) — three terminals (macOS / zsh)

Terminal 1 — Node backend:

```bash
cd emergency-triage-assistant/backend
npm install
npm start
```

Terminal 2 — FastAPI backend:

```bash
cd emergency-triage-assistant/fastapi-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 3 — Frontend (Vite):

```bash
cd emergency-triage-assistant/frontend
npm install
npx vite --host
```

Open the UI: http://localhost:3000

## Health & latency endpoints (examples)

- Node health: `GET http://localhost:5001/health`
- FastAPI health: `GET http://localhost:8000/health`

Use `curl` to fetch basic info (example):

```bash
curl -s http://localhost:5001/health | jq .
curl -s http://localhost:8000/health | jq .
```

## Suggested CI: publish status JSON

Add a GitHub Action that:
- Runs a short smoke test against staging or production health endpoints
- Writes the shield-shaped JSON into an artifact or to a public page (GitHub Pages / Vercel)
- Commits or uploads the JSON where shields.io can read it

Example action steps (conceptual):
- checkout
- node -- in repo run `node backend/scripts/generate_shields_health.js`
- upload `public/ert_health.json` to a public host

## Core features (short)

- Sub-400ms triage using Groq + Ollama hybrid
- Rule-based Emergency Protocol Engine (cardiac arrest, stroke, sepsis, etc.)
- Ultra-fast RAG with cache + rule fallback
- PDF ingestion & per-patient FAISS indexing (optional)
- Triage modes: Optimized / Detailed / A-B Compare

## Environment variables (copy as needed)

`backend/.env`

```env
PORT=5001
NODE_ENV=development
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
# GROQ_API_KEY=your_groq_api_key_here
```

`fastapi-backend/.env`

```env
GROQ_API_KEY=your_groq_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
EMBEDDING_MODEL=all-MiniLM-L6-v2
FAISS_INDEX_DIR=./data/faiss_indexes
PDF_STORAGE_DIR=./data/pdfs
CHUNK_SIZE=150
CHUNK_OVERLAP=25
TOP_K=2
```

## Useful troubleshooting

- Ollama: make sure `ollama serve` is running and `phi3:mini` is pulled.
- Ports: Node=5001, FastAPI=8000, Frontend=3000
- If health endpoints fail, check logs in `backend/logs` and `fastapi-backend` console.

## Contributing

Follow Conventional Commits and open PRs against `main`. See `CONTRIBUTING.md` if present.

---

If you want, I can:
- Replace the main `README.md` with this dynamic version (editing it in-place).
- Add the tiny Node script file and a sample GitHub Actions workflow to publish the health JSON for shields.

Tell me which you'd prefer and I will implement it next.  

(End of dynamic README)

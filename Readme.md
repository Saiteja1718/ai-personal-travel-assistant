
# AI Personal Travel Assistant

A full-stack AI-powered travel planning application built with
React, TypeScript, FastAPI, LangChain, and Groq-hosted LLMs.

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite

**Backend:** Python, FastAPI, Pydantic

**AI:** LangChain LCEL, Groq API, GPT-OSS-20B

**Testing:** pytest, FastAPI TestClient

## Implemented Features

- AI-powered travel information extraction
- Personalized travel recommendations
- Multi-stage sequential trip planning
- Parallel travel-data processing
- Sequential versus parallel latency benchmarking
- Structured API request and response validation
- Automated backend tests

## Project Structure

- `backend/app/` — FastAPI application
- `backend/tests/` — Backend tests
- `frontend/src/` — React application
- `backend/benchmark_parallel.py` — Performance benchmark

## Local Development

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env
```

Configure your Groq API key in `backend/.env`.

Start the API:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

API documentation: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Frontend: http://localhost:5173

## Testing

Backend:

```bash
cd backend
python -m pytest -v
```

Frontend:

```bash
cd frontend
npm run build
```

## Development Status

Phases 1–5 implemented.

Current weather and place-data demonstrations use mock data.

Planned enhancements:
- Conditional travel-planning workflows
- Retrieval-Augmented Generation (RAG)
- Travel knowledge database
- Live travel API integrations
- Docker and AWS deployment
- GitHub Actions CI/CD

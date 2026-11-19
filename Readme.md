
# AI Personal Travel Assistant

A full-stack AI travel planning application built with React,
TypeScript, FastAPI, LangChain, RAG, and AI agents.

## Current phase

Phase 1: React frontend and FastAPI backend.

## Technology stack

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

Backend:
- Python
- FastAPI
- Pydantic
- Uvicorn

Planned:
- LangChain and LangGraph
- LLM integration
- ChromaDB and RAG
- SQLite
- Weather and places APIs
- LangSmith
- Docker and AWS

## Run the backend

From the project root:

```bash
source backend/.venv/bin/activate
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend URL: http://localhost:8000

Health endpoint: http://localhost:8000/health

API docs: http://localhost:8000/docs

## Run the frontend

In a separate terminal from the project root:

```bash
cd frontend
npm run dev
```

Frontend URL: http://localhost:5173

## Run backend tests

From the backend directory:

```bash
python -m pytest -v
```

## Build the frontend

From the frontend directory:

```bash
npm run build
```

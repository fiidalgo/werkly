# Embedding Worker

This is a background worker for creating vector embeddings for documents for RAG.

## Purpose

The worker extracts text from docs, creates embeddings using the OpenAI `text-embedding-3-small` model, and stores the embeddings in Supabase with `pgvector`.

The worker runs as a separate Docker container to isolate this CPU-heavy workload from the API which is latency-sensitive.

## Environment Variables

The environment variables the worker relies on are:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin access
- `OPENAI_API_KEY` - OpenAI API key

## Usage

### Docker (recommended)

```bash
docker build -t werkly-embedding-worker .
docker run --env-file ../../.env werkly-embedding-worker
```

### Local

```bash
cd workers/embedding
pip install -r requirements.txt
python worker.py
```
#!/bin/bash
set -e

# Run the ingestion script to populate ChromaDB if not already there
echo "Running data ingestion..."
python -m backend.ingest

# Start the FastAPI application
echo "Starting FastAPI server..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 8000

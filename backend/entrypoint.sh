#!/bin/bash
set -e

# Run the ingestion script to populate ChromaDB if not already there
echo "Running data ingestion..."
python -m backend.ingest

# Start the FastAPI application on port 8080
echo "Starting FastAPI server on port 8080..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 8080

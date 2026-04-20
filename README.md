# Legal FAQ Q&A Web Application

This project is a lightweight Question-and-Answer (Q&A) web application designed to allow users to ask questions based on a predefined set of legal FAQs and receive AI-generated responses. It demonstrates a Retrieval-Augmented Generation (RAG) system.

## Approach to the Problem

To build this system efficiently and meet all the acceptance criteria, the architecture is divided into three main components:

1. **Backend (FastAPI, Python)**:
   - Provides REST APIs to ingest the FAQs, ask questions, and retrieve logs.
   - Uses `sqlite` and `ChromaDB` (or an in-memory FAISS index) as the vector database to store FAQ embeddings and perform similarity searches.
   - Integrates with the OpenAI API (using `langchain` or `openai` python package) to embed questions, retrieve the top 1-2 relevant FAQs, and generate contextual AI responses based *only* on the retrieved context.
   - Uses a SQLite database (`SQLAlchemy`) to log user questions and AI responses for later review.

2. **Frontend (React/Next.js with TypeScript)**:
   - A modern, responsive user interface.
   - Allows users to submit their questions.
   - Displays the AI's response alongside the retrieved FAQ titles/IDs.
   - Provides a separate view to check logs of previous queries and responses.

3. **Infrastructure (Docker & Docker Compose)**:
   - Both the frontend and backend are containerized.
   - `docker-compose.yml` ensures that the whole application can be started end-to-end with minimal setup (just `docker-compose up --build`).

## Estimated Time to Complete

My estimated time to complete the project is **4 hours**.

- **1 hour**: Environment setup, Git repository initialization, and generating the dataset of 50-100 legal FAQs.
- **1 hour**: Backend development (FastAPI endpoints, RAG pipeline, Vector DB integration, and SQLite logging).
- **1 hour**: Frontend development (TypeScript React UI, connecting to backend APIs, handling loading states and edge cases).
- **1 hour**: Dockerization, linting, testing, and final documentation.

---

*Note: The challenges faced and the final time spent will be detailed in the last commit message.*

# Legal FAQ Q&A Web Application

This project is a lightweight Question-and-Answer (Q&A) web application designed to allow users to ask questions based on a predefined set of legal FAQs and receive AI-generated responses. It demonstrates a Retrieval-Augmented Generation (RAG) system.

## Architecture & Design

To build this system efficiently and meet all the acceptance criteria, the architecture is divided into three main components:

1. **Backend (FastAPI, Python)**:
   - Provides REST APIs to ingest the FAQs, ask questions, and retrieve logs.
   - Uses `ChromaDB` as the vector database to store FAQ embeddings and perform similarity searches.
   - Integrates with the OpenAI API using `LangChain` to embed questions, retrieve the top 2 relevant FAQs, and generate contextual AI responses based *only* on the retrieved context.
   - Uses a SQLite database (`SQLAlchemy`) to log user questions and AI responses for later review.

2. **Frontend (React/Next.js with TypeScript)**:
   - A modern, responsive user interface using Tailwind CSS.
   - Allows users to submit their questions.
   - Displays the AI's response alongside the retrieved FAQ titles.
   - Provides a separate view to check logs of previous queries and responses.

3. **Infrastructure (Docker & Docker Compose)**:
   - Both the frontend and backend are containerized.
   - `docker-compose.yml` ensures that the whole application can be started end-to-end with minimal setup.

## Estimated Time to Complete

My estimated time to complete the project is **4 hours**.

- **1 hour**: Environment setup, Git repository initialization, and generating the dataset of 50-100 legal FAQs.
- **1 hour**: Backend development (FastAPI endpoints, RAG pipeline, Vector DB integration, and SQLite logging).
- **1 hour**: Frontend development (TypeScript React UI, connecting to backend APIs, handling loading states and edge cases).
- **1 hour**: Dockerization, linting, testing, and final documentation.

---

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd zlayt_ai_evaluation_challenge_project
   ```

2. **Set up Environment Variables**:
   Copy the example environment file and add your OpenAI API Key:
   ```bash
   cp .env.example .env
   # Edit .env and insert your OPENAI_API_KEY
   ```

3. **Run the Application with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

   - The Frontend will be available at: http://localhost:3000
   - The Backend API will be available at: http://localhost:8000

4. **Ingestion**:
   The backend container will automatically run the ingestion script (`backend/ingest.py`) on startup to populate the ChromaDB vector database with the provided 50 legal FAQs.

---

*Note: The challenges faced and the final time spent will be detailed in the last commit message.*

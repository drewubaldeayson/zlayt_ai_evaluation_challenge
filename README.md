# Legal AI Assistant - RAG Q&A Web Application

This project is a lightweight, production-ready Question-and-Answer (Q&A) web application designed to allow users to ask questions based on a predefined set of 50 legal FAQs. It demonstrates a robust **Retrieval-Augmented Generation (RAG)** pipeline.

---

## Key Features (MVP + Extra Features)

To demonstrate technical excellence beyond the MVP requirements, several advanced features were implemented:

1. **Robust RAG Pipeline**: 
   - **Local Embeddings:** Uses HuggingFace (`all-MiniLM-L6-v2`) to embed FAQs entirely locally. This completely avoids vector database initialization failures even if the OpenAI quota is exhausted.
   - **Smart Deduplication:** The backend filters out duplicate documents before sending the context to the LLM, ensuring clean, unique sources.
   - **Graceful Fallback:** If the OpenAI API rate-limits or fails, the application degrades gracefully by returning the retrieved context straight from the internal database instead of crashing.
2. **Beautiful, Professional UI**: A modern, responsive interface built with Next.js, Tailwind CSS, and Lucide icons.
   - **Interactive Sources Consulted:** Retrieved context is displayed in sleek accordions, complete with "Verified Internal Source" badges and a "Copy Citation" button.
   - **Personal Chat History:** Uses browser `localStorage` to save the user's past queries in a convenient sidebar.
3. **Admin Dashboard & Analytics**:
   - A secure `/admin/login` portal (Creds: `admin` / `admin123`).
   - Displays real-time KPIs (Total Queries, Positive/Negative Feedback, Top Locations).
   - Detailed audit logs capturing User-Agent, IP Address, and **Geolocation tracking** (Country) via `ip-api`.
4. **User Feedback Loop**: Interactive Thumbs Up/Down buttons let users rate AI responses, logging feedback directly to the SQLite database.

---

## Setup & Run Instructions (For Reviewers)

The application is completely containerized and requires minimal setup. The vector database (`ChromaDB`) and the relational database (`logs.db`) are generated automatically on startup, ensuring a 100% clean state for your review.

**1. Clone the repository**:
```bash
git clone <repository_url>
cd zlayt_ai_evaluation_challenge_project
```

**2. Set up Environment Variables**:
Copy the example environment file and add your OpenAI API Key:
```bash
cp .env.example .env
# Edit .env and insert your actual OPENAI_API_KEY
```

**3. Run the Application**:
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up --build -d
```
*(Note: On the first run, the backend will download the HuggingFace embedding model and ingest the 50 FAQs from `backend/faqs.json` into ChromaDB automatically).*

**4. Access the Application**:
- **Main App (User Chat)**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) 
  - *Click the "Use Test Admin Credentials" button to autofill `admin` / `admin123`.*
- **Backend API Docs**: [http://localhost:8080/docs](http://localhost:8080/docs)

---

## Architecture & Design

1. **Backend (FastAPI, Python)**:
   - Provides REST APIs to ingest FAQs, process queries, handle feedback, and retrieve logs.
   - Uses `ChromaDB` as the vector database to perform similarity searches.
   - Integrates with the OpenAI API (`gpt-3.5-turbo`) using `LangChain` to generate contextual AI responses based *strictly* on retrieved context.
   - Uses `SQLAlchemy` (SQLite) to log queries, AI responses, IP, Geolocation, and Feedback.

2. **Frontend (Next.js, React, TypeScript)**:
   - Responsive UI using Tailwind CSS.
   - Separate layouts for User Chat and Admin Dashboard.
   - Handles API connection errors gracefully.

3. **Infrastructure (Docker)**:
   - `docker-compose.yml` orchestrates both the `frontend` (Node) and `backend` (Python) containers.

---

## Project Evaluation & Estimates

**Estimated Time to Complete**: **4 hours**
- **1 hour**: Environment setup, Git repository initialization, and generating the dataset of 50 legal FAQs.
- **1 hour**: Backend development (FastAPI endpoints, RAG pipeline, Vector DB integration, and SQLite logging).
- **1 hour**: Frontend development (TypeScript React UI, connecting to backend APIs, handling loading states).
- **1 hour**: Dockerization, linting, extra features (Analytics, Feedback, Fallbacks), and final documentation.

**Time Estimate Validation**:
I successfully met my original time estimate of 4 hours. The initial scaffolding went smoothly. During the remaining time, I implemented additional features (Admin Dashboard, LocalStorage History, Geolocation) to provide a polished, production-ready feel.

**Technical Challenges Faced**:
1. **Docker Path Execution**: Ensuring that `uvicorn` and Python scripts resolved relative paths correctly within the Docker container required careful volume mapping and `entrypoint.sh` adjustments.
2. **OpenAI Quota/Rate Limits**: During testing, API rate limits caused the backend to crash. *Solution*: Switched to HuggingFace local embeddings for the Vector DB to ensure ingestion always succeeds, and added a graceful fallback mechanism if the OpenAI generation fails.
3. **Cross-Origin Resource Sharing (CORS)**: With the backend on `8080` and the frontend on `3000`, configuring CORS in FastAPI and Next.js was necessary to allow the frontend to communicate with the backend smoothly.
4. **Source Deduplication**: ChromaDB occasionally returned identical overlapping chunks. *Solution*: Implemented a Set-based deduplication filter in the backend to ensure the frontend displays clean, unique source accordions.
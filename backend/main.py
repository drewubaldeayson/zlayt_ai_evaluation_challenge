from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import json
from .database import engine, init_db, get_db, QueryLog
from .schemas import QueryRequest, QueryResponse, LogEntry, FeedbackRequest
from .rag import retrieve_and_generate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Legal FAQ Q&A API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/api/ask", response_model=QueryResponse)
def ask_question(request: QueryRequest, db: Session = Depends(get_db)):
    # Retrieve relevant FAQs and generate answer
    rag_result = retrieve_and_generate(request.question)
    
    # Extract
    answer = rag_result["answer"]
    retrieved_faqs = rag_result["retrieved_faqs"]
    
    # Log query and response to SQLite
    log_entry = QueryLog(
        user_query=request.question,
        retrieved_faq_titles=json.dumps(retrieved_faqs),
        ai_response=answer,
        feedback=0
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    return QueryResponse(
        id=log_entry.id,
        answer=answer,
        retrieved_faqs=retrieved_faqs
    )

@app.post("/api/logs/{log_id}/feedback")
def submit_feedback(log_id: int, request: FeedbackRequest, db: Session = Depends(get_db)):
    log_entry = db.query(QueryLog).filter(QueryLog.id == log_id).first()
    if not log_entry:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    log_entry.feedback = request.feedback
    db.commit()
    return {"status": "success", "feedback": request.feedback}

@app.get("/api/logs", response_model=list[LogEntry])
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(QueryLog).order_by(QueryLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

from pydantic import BaseModel
from typing import List, Optional
import datetime

class QueryRequest(BaseModel):
    question: str

class FAQSource(BaseModel):
    title: str
    content: str

class QueryResponse(BaseModel):
    id: int
    answer: str
    retrieved_faqs: List[FAQSource] # List of rich objects

class LogEntry(BaseModel):
    id: int
    user_query: str
    retrieved_faq_titles: Optional[str]
    ai_response: str
    feedback: int
    ip_address: Optional[str]
    user_agent: Optional[str]
    country: Optional[str]
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class FeedbackRequest(BaseModel):
    feedback: int

class AdminLoginRequest(BaseModel):
    username: str
    password: str

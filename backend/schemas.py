from pydantic import BaseModel
from typing import List, Optional
import datetime

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    retrieved_faqs: List[str] # List of titles or IDs

class LogEntry(BaseModel):
    id: int
    user_query: str
    retrieved_faq_titles: Optional[str]
    ai_response: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime
import os

DATABASE_URL = "sqlite:///./logs.db"
# Use a specific URL if provided in env
if os.getenv("DATABASE_URL"):
    DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_query = Column(Text, nullable=False)
    retrieved_faq_titles = Column(Text, nullable=True) # Stored as JSON string or comma-separated
    ai_response = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

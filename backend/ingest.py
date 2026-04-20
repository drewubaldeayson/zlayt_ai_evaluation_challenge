import json
import os
import logging
from .rag import add_faqs_to_vectorstore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_and_ingest():
    file_path = os.path.join(os.path.dirname(__file__), "faqs.json")
    with open(file_path, "r", encoding="utf-8") as f:
        faqs = json.load(f)
    
    try:
        add_faqs_to_vectorstore(faqs)
        logger.info(f"Successfully ingested {len(faqs)} FAQs.")
    except Exception as e:
        logger.error(f"Warning: Failed to ingest FAQs. This may be due to OpenAI API limits or invalid keys. Error: {e}")

if __name__ == "__main__":
    load_and_ingest()

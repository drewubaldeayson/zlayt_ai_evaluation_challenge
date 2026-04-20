import json
import os
from .rag import add_faqs_to_vectorstore

def load_and_ingest():
    file_path = os.path.join(os.path.dirname(__file__), "faqs.json")
    with open(file_path, "r", encoding="utf-8") as f:
        faqs = json.load(f)
    
    add_faqs_to_vectorstore(faqs)
    print(f"Successfully ingested {len(faqs)} FAQs.")

if __name__ == "__main__":
    load_and_ingest()

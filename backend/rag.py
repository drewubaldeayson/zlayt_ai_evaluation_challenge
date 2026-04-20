import os
import logging
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain.prompts import PromptTemplate

logger = logging.getLogger(__name__)

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

try:
    # Use local embeddings to avoid OpenAI quota limits on vector DB
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Use OpenAI for generation only
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo", 
        temperature=0.0, 
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    vectorstore = Chroma(
        collection_name="legal_faqs",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
except Exception as e:
    logger.error(f"Failed to initialize LangChain dependencies. Missing/Invalid API Key? Error: {e}")
    vectorstore = None
    llm = None

prompt_template = """
You are a helpful and knowledgeable legal assistant. 
Use the following pieces of context to answer the user's question. 
If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.
Keep the answer clear and concise.

Context: {context}

Question: {question}

Helpful Answer:"""

QA_PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

def retrieve_and_generate(question: str):
    if not vectorstore or not llm:
        return {
            "answer": "I'm currently unable to connect to my AI processing service (likely due to missing or rate-limited API keys). Please check your configuration and try again later.",
            "retrieved_faqs": []
        }

    try:
        # Retrieve more to ensure we can filter duplicates
        docs = vectorstore.similarity_search(question, k=4)
    except Exception as e:
        logger.error(f"Vector search failed: {e}")
        docs = []
    
    # Deduplicate and extract context
    unique_docs = []
    seen_titles = set()
    for doc in docs:
        title = doc.metadata.get('title', 'Unknown Question')
        if title not in seen_titles:
            seen_titles.add(title)
            unique_docs.append(doc)
        if len(unique_docs) == 2:
            break

    context = ""
    retrieved_sources = []
    for doc in unique_docs:
        title = doc.metadata.get('title', 'Unknown Question')
        content = doc.page_content
        context += f"Q: {title}\nA: {content}\n\n"
        retrieved_sources.append({"title": title, "content": content})

    if not unique_docs:
        return {
            "answer": "I couldn't find any relevant legal FAQs in my database for your question.",
            "retrieved_faqs": []
        }

    try:
        # Generate answer
        chain = QA_PROMPT | llm
        response = chain.invoke({"context": context, "question": question})
        answer = response.content
    except Exception as e:
        logger.error(f"LLM Generation failed: {e}")
        answer = f"My AI generation service is temporarily unavailable (possibly quota exceeded), but I found this relevant information in my database:\n\n{context}"
    
    return {
        "answer": answer,
        "retrieved_faqs": retrieved_sources
    }

def add_faqs_to_vectorstore(faqs):
    if not vectorstore:
        raise Exception("Vectorstore is not initialized.")
    documents = []
    for faq in faqs:
        doc = Document(
            page_content=faq['answer'],
            metadata={"title": faq['question']}
        )
        documents.append(doc)
    vectorstore.add_documents(documents)

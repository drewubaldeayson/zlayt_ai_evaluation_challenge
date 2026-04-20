import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.schema import Document
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

# Initialize embeddings and LLM
# They will pull the OPENAI_API_KEY from environment variables automatically.
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.0)

# Create ChromaDB collection
vectorstore = Chroma(
    collection_name="legal_faqs",
    embedding_function=embeddings,
    persist_directory=CHROMA_PERSIST_DIR
)

# We use a custom prompt for generating answers
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
    # Retrieve top 2 most relevant FAQs
    docs = vectorstore.similarity_search(question, k=2)
    
    # Extract context and titles
    context = ""
    retrieved_titles = []
    for doc in docs:
        context += f"Q: {doc.metadata.get('title', 'Unknown Question')}\nA: {doc.page_content}\n\n"
        retrieved_titles.append(doc.metadata.get('title', 'Unknown Question'))

    # Generate answer
    chain = QA_PROMPT | llm
    response = chain.invoke({"context": context, "question": question})
    
    return {
        "answer": response.content,
        "retrieved_faqs": retrieved_titles
    }

def add_faqs_to_vectorstore(faqs):
    documents = []
    for faq in faqs:
        doc = Document(
            page_content=faq['answer'],
            metadata={"title": faq['question']}
        )
        documents.append(doc)
    vectorstore.add_documents(documents)

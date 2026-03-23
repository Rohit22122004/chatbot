import os
import chromadb
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

class RAGManager:
    def __init__(self, data_dir="data/runbooks"):
        self.client = chromadb.PersistentClient(path="backend/data/db")
        self.emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name="infra_runbooks", 
            embedding_function=self.emb_fn
        )
        self.data_dir = data_dir

    def load_runbooks(self):
        if not os.path.exists(self.data_dir):
            return 0
            
        loader = DirectoryLoader(self.data_dir, glob="**/*.md", loader_cls=TextLoader)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(documents)
        
        # Upsert into ChromaDB
        for i, chunk in enumerate(chunks):
            self.collection.upsert(
                ids=[f"chunk_{i}"],
                documents=[chunk.page_content],
                metadatas=[chunk.metadata]
            )
        return len(chunks)

    def query_context(self, query: str, n_results: int = 3):
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return "\n\n".join(results["documents"][0]) if results["documents"] else ""

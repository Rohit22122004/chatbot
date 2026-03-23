from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import time
import random
import json
import asyncio

from llm import LLMManager
from rag import RAGManager

app = FastAPI(title="InfraAI Backend")

# CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
llm = LLMManager()
rag = RAGManager()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: bool = True

@app.on_event("startup")
async def startup_event():
    # Load runbooks into ChromaDB on startup
    count = rag.load_runbooks()
    print(f"Loaded {count} chunks from runbooks.")

@app.get("/")
def read_root():
    return {"message": "Welcome to InfraAI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/metrics")
async def get_metrics():
    # Mock CPU, RAM, and Disk metrics for 20 points
    metrics = {
        "cpu": [random.uniform(5, 45) for _ in range(20)],
        "memory": [random.uniform(20, 80) for _ in range(20)],
        "disk": [random.uniform(40, 60) for _ in range(20)],
        "labels": [f"T-{i}m" for i in range(20, 0, -1)]
    }
    return metrics

@app.get("/api/logs")
async def get_logs():
    # Mock log data
    log_levels = ["INFO", "WARN", "ERROR"]
    services = ["gateway-proxy", "auth-service", "data-worker", "db-controller"]
    messages = [
        "Request received and processed successfully",
        "Retrying operation due to temporary timeout",
        "Failed to connect to primary database cluster",
        "Memory usage above 80% threshold",
        "Pod restarted due to liveness probe failure"
    ]
    
    logs = []
    for i in range(20):
        logs.append({
            "id": i,
            "timestamp": time.strftime("%H:%M:%S", time.localtime(time.time() - i * 300)),
            "level": random.choice(log_levels),
            "service": random.choice(services),
            "message": random.choice(messages)
        })
    return sorted(logs, key=lambda x: x["id"], reverse=False)

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Search context from RAG
    user_query = request.messages[-1].content
    context = rag.query_context(user_query)
    
    if request.stream:
        async def event_generator():
            async for chunk in llm.stream_chat_response([m.dict() for m in request.messages], context):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    else:
        response = await llm.get_chat_response([m.dict() for m in request.messages], context)
        return {"content": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


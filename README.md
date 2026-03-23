# InfraAI - Infrastructure AI Assistant

A production-grade AI assistant for DevOps/SRE teams to monitor and troubleshoot infrastructure issues in real-time.

## Features
- **AI Chatbot**: Local LLM integration with Ollama (Llama 3/Mistral).
- **RAG Integration**: Powered by ChromaDB and LangChain to provide context from runbooks.
- **Glassmorphism UI**: Modern, futuristic dashboard with dark theme and Three.js background.
- **Real-time Monitoring**: Live metrics for CPU, Memory, and Disk I/O.
- **Live Logs**: Searchable logs viewer across multiple services.

## Tech Stack
- **Backend**: FastAPI (Python), LangChain, ChromaDB, Ollama.
- **Frontend**: React, Vite, Three.js, Recharts, Tailwind CSS.

## Prerequisites
- **Ollama**: Ensure Ollama is installed and running (`ollama serve`). 
- **Models**: Pull llama3 using `ollama pull llama3`.

## Setup
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python main.py` (Runs on port 8000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 3000)

## Docker Deployment
Alternatively, use Docker Compose to start the entire stack:
```bash
docker-compose up --build
```

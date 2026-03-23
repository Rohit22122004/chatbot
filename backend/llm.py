import os
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from typing import List

class LLMManager:
    def __init__(self, model_name=None, base_url=None):
        self.model_name = model_name or os.getenv("OLLAMA_MODEL", "llama3")
        self.base_url = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        self.llm = ChatOllama(
            model=self.model_name,
            base_url=self.base_url,
            temperature=0.2,
        )
        self.system_prompt = (
            "You are an AI SRE/DevOps Assistant for infrastructure support. "
            "Your goal is to help users troubleshoot and resolve real-time infrastructure issues. "
            "Use the provided documentation and context. "
            "Respond concisely and professionally. "
            "Include code snippets, shell commands, or Kubernetes commands when helpful. "
            "Suggest concrete actions like 'scale', 'restart', or 'check logs'."
        )

    async def get_chat_response(self, messages, context: str = ""):
        try:
            chat_messages = [SystemMessage(content=f"{self.system_prompt}\n\nContext: {context}")]
            for msg in messages:
                if msg["role"] == "user":
                    chat_messages.append(HumanMessage(content=msg["content"]))
                else:
                    chat_messages.append(AIMessage(content=msg["content"]))
            
            # Non-streaming response for simplicity first
            response = await self.llm.ainvoke(chat_messages)
            return response.content
        except Exception as e:
            return f"Error interacting with Ollama: {str(e)}"

    async def stream_chat_response(self, messages, context: str = ""):
        try:
            chat_messages = [SystemMessage(content=f"{self.system_prompt}\n\nContext: {context}")]
            for msg in messages:
                if msg["role"] == "user":
                    chat_messages.append(HumanMessage(content=msg["content"]))
                else:
                    chat_messages.append(AIMessage(content=msg["content"]))
            
            async for chunk in self.llm.astream(chat_messages):
                yield chunk.content
        except Exception as e:
            yield f"Error interacting with Ollama streaming: {str(e)}"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Command } from 'lucide-react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your InfraAI SRE assistant. How can I help you troubleshoot your production environment today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: [...messages, userMsg],
        stream: false
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI engine. Please ensure Ollama is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Check CoreDNS health",
    "Analyze DB timeouts",
    "List crashing pods",
    "Scaling suggested fix"
  ];

  return (
    <div className="glass flex flex-col h-full rounded-2xl border-white/10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse" />
      
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center border border-white/10 shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none p-4 bg-black/60 border-t border-white/5 backdrop-blur-md">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
          {suggestions.map((sg) => (
            <button 
              key={sg}
              onClick={() => setInput(sg)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] text-slate-400 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Command className="w-2.5 h-2.5" />
              {sg}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about your infra..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-500 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:bg-slate-700 transition-all shadow-lg"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

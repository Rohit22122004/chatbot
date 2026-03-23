import React from 'react';
import { Terminal, Search, Clock } from 'lucide-react';

const LogsViewer = ({ logs }) => {
  if (!logs) return null;

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Live Logs</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
             <input 
               type="text" 
               placeholder="Filter logs..." 
               className="bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-blue-500/50 w-40"
             />
           </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 px-2 py-1 hover:bg-white/5 rounded transition-colors group">
            <span className="text-slate-600 shrink-0 group-hover:text-slate-400">{log.timestamp}</span>
            <span className={`shrink-0 font-bold ${
              log.level === 'ERROR' ? 'text-red-500' : 
              log.level === 'WARN' ? 'text-amber-500' : 'text-blue-500'
            }`}>
              [{log.level}]
            </span>
            <span className="text-slate-500 shrink-0">[{log.service}]</span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsViewer;

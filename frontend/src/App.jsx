import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Background3D from './components/Background3D';
import MetricsPanel from './components/MetricsPanel';
import ChatInterface from './components/ChatInterface';
import LogsViewer from './components/LogsViewer';
import { LayoutDashboard, AlertCircle, Shield, Settings, Menu } from 'lucide-react';
import { API_BASE_URL } from './config';


const App = () => {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, logsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/metrics`),
          axios.get(`${API_BASE_URL}/api/logs`)
        ]);

        setMetrics(metricsRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex text-slate-200">
      <Background3D />
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 glass border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block">InfraAI</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem icon={LayoutDashboard} label="Control Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={AlertCircle} label="Active Alerts" badge="3" />
          <NavItem icon={Shield} label="Security" />
          <NavItem icon={Settings} label="System Config" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="p-3 glass rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center overflow-hidden">
               <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-semibold">Operator Active</p>
              <p className="text-slate-500">Local SRE Cluster</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 gap-6 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-none flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Main Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time infrastructure health and AI insights</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end text-[10px] uppercase tracking-wider text-slate-500">
                <span>Cluster State: Healthy</span>
                <span className="text-blue-500">Uptime: 14d 2h 45m</span>
             </div>
             <button className="md:hidden p-2 glass rounded-lg">
                <Menu className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Left: Metrics & Logs */}
          <div className="flex-1 flex flex-col gap-6 min-h-0 order-2 lg:order-1">
            <div className="flex-none">
              <MetricsPanel metrics={metrics} />
            </div>
            <div className="flex-1 min-h-0">
              <LogsViewer logs={logs} />
            </div>
          </div>

          {/* Right: AI Assistant */}
          <div className="flex-none w-full lg:w-[450px] flex flex-col h-full order-1 lg:order-2 min-h-0">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner shadow-blue-500/5' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
    <span className="text-sm font-medium hidden lg:block">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 hidden lg:block">
        {badge}
      </span>
    )}
  </button>
);

export default App;

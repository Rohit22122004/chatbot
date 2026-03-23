import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Database, HardDrive, Activity } from 'lucide-react';

const MetricCard = ({ title, value, data, icon: Icon, color }) => (
  <div className="glass p-4 rounded-xl flex flex-col h-full border-blue-500/10">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm font-medium text-slate-300">{title}</span>
      </div>
      <span className={`text-lg font-bold ${color}`}>{value}%</span>
    </div>
    <div className="flex-1 min-h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color === 'text-blue-500' ? '#3b82f6' : color === 'text-green-500' ? '#22c55e' : '#f59e0b'} 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const MetricsPanel = ({ metrics }) => {
  if (!metrics) return null;

  const cpuData = metrics.cpu.map((v, i) => ({ value: v, name: metrics.labels[i] }));
  const memData = metrics.memory.map((v, i) => ({ value: v, name: metrics.labels[i] }));
  const diskData = metrics.disk.map((v, i) => ({ value: v, name: metrics.labels[i] }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard 
        title="CPU Usage" 
        value={Math.round(metrics.cpu[metrics.cpu.length - 1])} 
        data={cpuData} 
        icon={Cpu} 
        color="text-blue-500" 
      />
      <MetricCard 
        title="Memory" 
        value={Math.round(metrics.memory[metrics.memory.length - 1])} 
        data={memData} 
        icon={Activity} 
        color="text-green-500" 
      />
      <MetricCard 
        title="Disk I/O" 
        value={Math.round(metrics.disk[metrics.disk.length - 1])} 
        data={diskData} 
        icon={HardDrive} 
        color="text-amber-500" 
      />
    </div>
  );
};

export default MetricsPanel;

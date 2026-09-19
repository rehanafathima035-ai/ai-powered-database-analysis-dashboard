import React, { useState } from 'react';
import { 
  History, 
  Settings, 
  Database, 
  BarChart2, 
  HelpCircle, 
  Plus, 
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';

function Sidebar({ isConnected, setIsConnected }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat/connect', { method: 'POST' });
      if (response.ok) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
    setIsConnecting(false);
  };

  const navItems = [
    { icon: <BarChart2 size={20} />, label: 'Analytics' },
    { icon: <History size={20} />, label: 'History' },
    { icon: <Plus size={20} />, label: 'Saved Queries' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col bg-[#0f172a] z-20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-indigo-500 p-1.5 rounded-lg">
            <BarChart2 className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">v360</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">MySQL Status</h3>
            {isConnected ? (
              <CheckCircle2 className="text-emerald-500" size={14} />
            ) : (
              <XCircle className="text-amber-500" size={14} />
            )}
          </div>
          
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
            Connect to your MySQL instance to enable natural language querying.
          </p>

          <button 
            onClick={handleConnect}
            disabled={isConnected || isConnecting}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              isConnected 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : isConnected ? (
              'Connected'
            ) : (
              <>
                <Play size={12} fill="currentColor" />
                Connect Database
              </>
            )}
          </button>
        </div>

        <button className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 transition-colors w-full">
          <HelpCircle size={18} />
          <span className="text-xs font-medium">Documentation</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

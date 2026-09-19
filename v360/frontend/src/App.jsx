import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import Dashboard from './components/Dashboard';
import { Database, AlertCircle } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI Data Analytics Assistant. Connect to your MySQL database to get started.', id: 1 }
  ]);
  const [currentResult, setCurrentResult] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      <Sidebar isConnected={isConnected} setIsConnected={setIsConnected} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 glass z-10">
          <div className="flex items-center gap-3">
            <Database className={isConnected ? "text-emerald-400" : "text-amber-400"} size={20} />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              v360 Data Assistant
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!isConnected && (
              <span className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle size={12} />
                Disconnected
              </span>
            )}
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              RF
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel - 40% width */}
          <div className="w-[400px] border-r border-white/5 flex flex-col">
            <ChatPanel 
              messages={messages} 
              setMessages={setMessages} 
              setCurrentResult={setCurrentResult}
              isConnected={isConnected}
            />
          </div>

          {/* Results Panel - 60% width */}
          <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-900/50">
            <Dashboard result={currentResult} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

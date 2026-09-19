import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, MessageSquare, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatPanel({ messages, setMessages, setCurrentResult, isConnected }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConfirm = async (question, sql) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sql, preview: false })
      });

      const data = await response.json();
      
      const aiMessage = { 
        role: 'ai', 
        content: data.insights || (data.error ? `Error: ${data.error}` : 'Analysis complete! Check the dashboard.'),
        sql: data.sql,
        id: Date.now() + 1 
      };

      setMessages(prev => [...prev, aiMessage]);
      if (data.table_data) {
        setCurrentResult(data);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Connection to server failed during confirmation.', id: Date.now() + 1 }]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput, preview: true })
      });

      const data = await response.json();
      
      const aiMessage = { 
        role: 'ai', 
        content: data.error ? `Error: ${data.error}` : 'I have generated a preview of the data. Please confirm if this is what you are looking for:',
        sql: data.sql,
        is_preview: data.is_preview,
        sample_data: data.table_data,
        question: data.question,
        id: Date.now() + 1 
      };

      setMessages(prev => [...prev, aiMessage]);
      // Note: We don't call setCurrentResult(data) here because we wait for confirmation
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Connection to server failed.', id: Date.now() + 1 }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-none'
                }`}
              >
                {msg.content}
                {msg.sql && (
                  <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    <div className="flex items-center gap-1.5 mb-1 opacity-50 text-[10px]">
                      <Terminal size={10} />
                      GENERATED SQL
                    </div>
                    {msg.sql}
                  </div>
                )}
                {msg.is_preview && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-bold text-amber-400 mb-2 flex items-center gap-2">
                       SAMPLE DATA PREVIEW
                    </p>
                    <div className="overflow-x-auto mb-3 bg-black/20 rounded-lg p-2 border border-white/5">
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr>
                            {msg.sample_data && msg.sample_data.length > 0 && Object.keys(msg.sample_data[0]).map(k => (
                              <th key={k} className="pb-1 pr-2 opacity-50 uppercase">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.sample_data && msg.sample_data.map((row, i) => (
                            <tr key={i}>
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="pr-2 py-0.5">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      onClick={() => handleConfirm(msg.question, msg.sql)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} />
                      Confirm & Generate Full Analysis
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none text-slate-400">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 glass">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            placeholder={isConnected ? "Ask anything about your data..." : "Connect database first..."}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected || isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading || !isConnected}
            className="absolute right-2 top-2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 transition-all"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
          <Zap size={10} className="text-indigo-400" />
          AI can make mistakes. Verify important results.
        </p>
      </div>
    </div>
  );
}

export default ChatPanel;

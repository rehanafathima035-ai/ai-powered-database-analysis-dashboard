import React from 'react';
import {
  Table as TableIcon,
  BarChart,
  Download,
  PieChart as PieIcon,
  TrendingUp,
  Activity, Zap
} from 'lucide-react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

function Dashboard({ result }) {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
        <div className="p-6 rounded-full bg-slate-800/50 border border-white/5 animate-pulse">
          <Activity size={48} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-300">Awaiting Analytics</h3>
          <p className="text-sm max-w-xs">Ask a question to see data visualizations and insights appear here.</p>
        </div>
      </div>
    );
  }

  const { table_data, sql, insights } = result;

  // Basic heuristic for chart selection
  const chartData = table_data.slice(0, 10); // Limit to 10 for visualization
  const keys = table_data.length > 0 ? Object.keys(table_data[0]) : [];
  const numericKey = keys.find(k => typeof table_data[0][k] === 'number');
  const labelKey = keys.find(k => k !== numericKey);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-indigo-400" size={24} />
          Query Results
        </h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Card */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 glass flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BarChart className="text-indigo-400" size={16} />
              Visualization
            </h3>
            <div className="flex bg-black/20 p-1 rounded-lg">
              <button className="p-1 px-2 text-[10px] bg-indigo-500 rounded text-white font-bold tracking-tight">BAR</button>
              <button className="p-1 px-2 text-[10px] text-slate-500 font-bold hover:text-slate-300 transition-colors">LINE</button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey={labelKey}
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey={numericKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 glass flex flex-col min-h-[400px]">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-6">
            <TableIcon className="text-emerald-400" size={16} />
            Data Table
          </h3>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 font-medium">
                <tr>
                  {keys.map(k => <th key={k} className="pb-3 pr-4 border-b border-white/5 font-semibold uppercase tracking-wider">{k}</th>)}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {table_data.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    {keys.map(k => <td key={k} className="py-3 pr-4 border-b border-white/5">{row[k]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 glass">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-indigo-300">
          <Zap size={16} className="fill-indigo-300" />
          AI Analysis & Insights
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed italic">
          "{insights}"
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

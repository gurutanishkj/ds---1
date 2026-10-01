import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { generateChartData } from '../algorithms/pathAnalysis';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { getVertexLabel } from '../algorithms/dijkstra';

const LINE_COLORS = ['#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#f43f5e'];

export const ChartPanel: React.FC = () => {
  const { vertices, edges, sourceNode, destNode, k } = useGraphStore();

  const chartData = React.useMemo(() => {
    return generateChartData(vertices, edges, sourceNode, destNode, 10);
  }, [vertices, edges, sourceNode, destNode]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 text-center text-slate-500 text-xs">
        Connect vertices with paths to generate the K vs. Cost chart.
      </div>
    );
  }

  // Extract path keys from first item (excluding 'k', 'Shortest Cost', 'Shortest Path')
  const pathKeys = Object.keys(chartData[0]).filter(
    (key) => key !== 'k' && key !== 'Shortest Cost' && key !== 'Shortest Path'
  );

  const sourceLabel = getVertexLabel(vertices, sourceNode);
  const destLabel = getVertexLabel(vertices, destNode);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-300 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-indigo-400" /> K vs. Shortest Path Cost Chart
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Routes from {sourceLabel} to {destLabel}
        </div>
      </div>

      <div className="text-xs text-slate-400">
        Observe how the slope of each line equals its edge count <code className="text-indigo-300">m = |P|</code>. Paths with more edges have steeper slopes and eventually cross paths with fewer edges.
      </div>

      {/* Recharts Container */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="k"
              stroke="#94a3b8"
              fontSize={11}
              label={{ value: 'Constant (k)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              label={{ value: 'Path Cost', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            {pathKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}

            {/* Shortest Envelope Line */}
            <Line
              type="monotone"
              dataKey="Shortest Cost"
              name="★ Active Shortest"
              stroke="#e11d48"
              strokeWidth={3}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Path Identity Schedule at current k */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Path Identity Across K Intervals:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
          {chartData.slice(0, 4).map((entry) => (
            <div
              key={entry.k}
              className={`p-2 rounded-lg border text-center ${
                entry.k === k
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold ring-1 ring-amber-400/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-500">k = {entry.k}</div>
              <div className="truncate font-sans font-medium">{String(entry['Shortest Path'] || '–')}</div>
              <div className="text-white font-bold">Cost: {String(entry['Shortest Cost'])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

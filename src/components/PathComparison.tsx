import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { findAllSimplePaths, formatPathLabels } from '../algorithms/shortestPath';
import { detectPathSwitch } from '../algorithms/pathAnalysis';
import { Calculator, ArrowRightLeft, Sparkles, HelpCircle } from 'lucide-react';
import { getVertexLabel } from '../algorithms/dijkstra';

export const PathComparison: React.FC = () => {
  const {
    vertices,
    edges,
    sourceNode,
    destNode,
    k,
    setShowExplainModal,
  } = useGraphStore();

  const paths = React.useMemo(() => {
    return findAllSimplePaths(vertices, edges, sourceNode, destNode, k, 6);
  }, [vertices, edges, sourceNode, destNode, k]);

  const switchDetection = React.useMemo(() => {
    return detectPathSwitch(vertices, edges, sourceNode, destNode);
  }, [vertices, edges, sourceNode, destNode]);

  const sourceLabel = getVertexLabel(vertices, sourceNode);
  const destLabel = getVertexLabel(vertices, destNode);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-300 uppercase tracking-wider">
          <Calculator className="w-4 h-4 text-indigo-400" /> Path Cost & Comparison Table
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Target: {sourceLabel} → {destLabel}
        </div>
      </div>

      {/* Path-Switch Detector Banner */}
      {switchDetection.hasSwitch && (
        <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-500/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>PATH SWITCH DETECTED (Threshold k* = {switchDetection.thresholdK})</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {switchDetection.rangeDescription}
          </p>
        </div>
      )}

      {/* Paths Table */}
      {paths.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                <th className="pb-2">Candidate Path</th>
                <th className="pb-2 text-center">Edges (m)</th>
                <th className="pb-2 text-center">Orig Cost</th>
                <th className="pb-2 text-center">Formula W + mk</th>
                <th className="pb-2 text-center">New Cost</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paths.map((p, idx) => {
                const label = formatPathLabels(vertices, p.nodes);
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      p.isShortest
                        ? 'bg-amber-500/10 font-semibold'
                        : 'hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <td className="py-2.5 font-sans font-medium text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-[10px] font-mono">{idx + 1}.</span>
                        {label}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-300">{p.edgeCount}</td>
                    <td className="py-2.5 text-center text-slate-300">{p.originalCost}</td>
                    <td className="py-2.5 text-center text-slate-400 text-[11px]">
                      {p.originalCost} + ({p.edgeCount} × {k})
                    </td>
                    <td
                      className={`py-2.5 text-center font-bold ${
                        p.isShortest ? 'text-amber-400 text-sm' : 'text-slate-300'
                      }`}
                    >
                      {p.modifiedCost}
                    </td>
                    <td className="py-2.5 text-right font-sans">
                      {p.isShortest ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Sparkles className="w-2.5 h-2.5" /> Shortest
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-500 border border-slate-700">
                          Suboptimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-6 text-center text-slate-500 text-xs italic">
          No simple paths found between selected source and destination.
        </div>
      )}

      {/* Explain Button & Mathematical Law Formula */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400 font-mono">
          Formula: <span className="text-indigo-300 font-bold">W'(P) = W(P) + |P| · k</span>
        </div>

        <button
          onClick={() => setShowExplainModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          <HelpCircle className="w-4 h-4" />
          🔍 EXPLAIN CHANGE
        </button>
      </div>
    </div>
  );
};

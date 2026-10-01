import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { Minus, Plus, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { compareTrees } from '../algorithms/pathAnalysis';
import { getVertexLabel, solveDijkstra } from '../algorithms/dijkstra';

export const KSlider: React.FC = () => {
  const {
    k,
    setK,
    applyK,
    resetWeights,
    vertices,
    edges,
    sourceNode,
    destNode,
    liveDijkstraResult,
    setShowBeforeAfterModal,
  } = useGraphStore();

  const handleDecrement = () => setK(Math.max(0, k - 1));
  const handleIncrement = () => setK(Math.min(30, k + 1));

  // Compute original tree & path at k = 0 to detect shifts
  const originalDijkstra = React.useMemo(() => {
    return solveDijkstra(vertices, edges, sourceNode, destNode, false);
  }, [vertices, edges, sourceNode, destNode]);

  const treeComparison = React.useMemo(() => {
    return compareTrees(vertices, edges, sourceNode, k);
  }, [vertices, edges, sourceNode, k]);

  const origPathStr = originalDijkstra.pathNodes
    .map((id) => getVertexLabel(vertices, id))
    .join(' → ');

  const currentPathStr = liveDijkstraResult.pathNodes
    .map((id) => getVertexLabel(vertices, id))
    .join(' → ');

  const pathChanged = origPathStr !== currentPathStr;
  const treeChanged = treeComparison.treeChanged;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      {/* Title & Formula */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" /> K Weight Transformation
        </div>
        <div className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/60 font-mono text-[11px] text-indigo-300 font-bold">
          w'(e) = w(e) + k
        </div>
      </div>

      {/* Stepper & Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Constant Increase (k):</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={k <= 0}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-lg text-white">
              {k}
            </span>
            <button
              onClick={handleIncrement}
              disabled={k >= 30}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>k = 0</span>
            <span>k = 5</span>
            <span>k = 10</span>
            <span>k = 15</span>
            <span>k = 20</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={applyK}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Apply k
          </button>
          <button
            onClick={resetWeights}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset (k=0)
          </button>
          <button
            onClick={() => setShowBeforeAfterModal(true)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
          >
            Split View
          </button>
        </div>
      </div>

      {/* Dynamic Transformation Status */}
      <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Shortest-Path Tree Changed?</span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
              treeChanged
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {treeChanged ? 'YES ⚡' : 'NO'}
          </span>
        </div>

        {treeChanged && (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Tree Edges Altered:</span>
            <span className="font-mono text-amber-300 font-bold">
              +{treeComparison.addedEdges.length} / -{treeComparison.removedEdges.length} edges
            </span>
          </div>
        )}

        <div className="space-y-1 pt-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Original Path (k=0):</span>
            <span className="text-slate-200 font-bold">{origPathStr || 'None'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Path (k={k}):</span>
            <span
              className={`font-bold ${
                pathChanged ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {currentPathStr || 'None'}
            </span>
          </div>
        </div>

        {pathChanged && (
          <div className="flex items-center gap-1.5 p-2 rounded bg-amber-950/40 border border-amber-700/50 text-[11px] text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Shortest path shifted from initial route!</span>
          </div>
        )}
      </div>
    </div>
  );
};

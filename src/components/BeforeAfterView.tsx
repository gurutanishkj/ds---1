import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { solveDijkstra, getVertexLabel } from '../algorithms/dijkstra';
import { compareTrees } from '../algorithms/pathAnalysis';
import { X, ArrowRight, GitCompare, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const BeforeAfterView: React.FC = () => {
  const {
    showBeforeAfterModal,
    setShowBeforeAfterModal,
    vertices,
    edges,
    sourceNode,
    destNode,
    k,
  } = useGraphStore();

  if (!showBeforeAfterModal) return null;

  // Solve for original graph (k = 0)
  const origDijkstra = solveDijkstra(vertices, edges, sourceNode, destNode, false);

  // Solve for modified graph with k
  const updatedEdges = edges.map((e) => ({
    ...e,
    modifiedWeight: e.originalWeight + k,
  }));
  const modDijkstra = solveDijkstra(vertices, updatedEdges, sourceNode, destNode, true);

  const treeComp = compareTrees(vertices, edges, sourceNode, k);

  const origPath = origDijkstra.pathNodes.map((id) => getVertexLabel(vertices, id)).join(' → ');
  const modPath = modDijkstra.pathNodes.map((id) => getVertexLabel(vertices, id)).join(' → ');

  const hasPathShift = origPath !== modPath;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Before vs. After Split-Screen Comparison
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono">
                  k = +{k}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct structural comparison between initial weights (k = 0) and transformed weights (k = {k})
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBeforeAfterModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift Summary Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            hasPathShift
              ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {hasPathShift ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>
              {hasPathShift
                ? `Shortest path changed! Original route [${origPath}] altered to [${modPath}].`
                : `Shortest path route preserved at k = ${k}: [${origPath}].`}
            </span>
          </div>
          <span className="font-mono font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 shrink-0">
            Tree Changed: {treeComp.treeChanged ? 'YES' : 'NO'}
          </span>
        </div>

        {/* Split View Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Original Graph (k = 0) */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Original Graph (k = 0)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Baseline Weights</span>
            </div>

            {/* Edge list */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Edge Weights:
              </div>
              {edges.map((e) => {
                const u = getVertexLabel(vertices, e.source);
                const v = getVertexLabel(vertices, e.target);
                const isTree = origDijkstra.treeEdges.includes(e.id);
                const isPath = origDijkstra.pathEdges.includes(e.id);

                return (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                      isPath
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                        : isTree
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>
                      {u} ─── {v}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-white font-bold">{e.originalWeight}</span>
                      {isPath && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans">
                          Path
                        </span>
                      )}
                      {isTree && !isPath && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-sans">
                          Tree
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Metrics */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Shortest Path:</span>
                <span className="font-mono font-bold text-cyan-300">{origPath || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Path Cost:</span>
                <span className="font-mono font-bold text-white">{origDijkstra.pathCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Tree Cost:</span>
                <span className="font-mono text-slate-300">{origDijkstra.totalTreeCost}</span>
              </div>
            </div>
          </div>

          {/* Right: Modified Graph (k > 0) */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Modified Graph (k = +{k})
              </span>
              <span className="text-[11px] font-mono text-slate-400">w'(e) = w(e) + {k}</span>
            </div>

            {/* Edge list */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Modified Weights:
              </div>
              {edges.map((e) => {
                const u = getVertexLabel(vertices, e.source);
                const v = getVertexLabel(vertices, e.target);
                const isTree = modDijkstra.treeEdges.includes(e.id);
                const isPath = modDijkstra.pathEdges.includes(e.id);
                const modW = e.originalWeight + k;

                return (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                      isPath
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                        : isTree
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>
                      {u} ─── {v}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">
                        {e.originalWeight} + {k} =
                      </span>
                      <span className="text-emerald-400 font-bold">{modW}</span>
                      {isPath && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans">
                          Path
                        </span>
                      )}
                      {isTree && !isPath && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-sans">
                          Tree
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Metrics */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Shortest Path:</span>
                <span className="font-mono font-bold text-amber-300">{modPath || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Path Cost:</span>
                <span className="font-mono font-bold text-white">{modDijkstra.pathCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Tree Cost:</span>
                <span className="font-mono text-slate-300">{modDijkstra.totalTreeCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Mutation Stats */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Spanning Tree Structural Mutation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">Retained Edges</div>
              <div className="text-sm font-bold text-emerald-400">{treeComp.retainedEdges.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">Edges Removed</div>
              <div className="text-sm font-bold text-rose-400">-{treeComp.removedEdges.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">New Edges Added</div>
              <div className="text-sm font-bold text-cyan-400">+{treeComp.addedEdges.length}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowBeforeAfterModal(false)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-colors"
          >
            Close Comparison <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

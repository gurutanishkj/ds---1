import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { getVertexLabel } from '../algorithms/dijkstra';
import { Network, Route, GitFork } from 'lucide-react';

export const DistanceTable: React.FC = () => {
  const {
    vertices,
    edges,
    sourceNode,
    destNode,
    isAlgorithmRunning,
    currentStepIndex,
    algorithmSteps,
    liveDijkstraResult,
    k,
  } = useGraphStore();

  const activeStep = isAlgorithmRunning && algorithmSteps[currentStepIndex]
    ? algorithmSteps[currentStepIndex]
    : null;

  const currentDistances = activeStep ? activeStep.distances : liveDijkstraResult.distances;
  const currentPrevious = activeStep ? activeStep.previous : liveDijkstraResult.previous;
  const currentVisited = activeStep
    ? new Set(activeStep.visitedVertices)
    : new Set(
        vertices.filter((v) => (liveDijkstraResult.distances[v.id] ?? Infinity) !== Infinity).map((v) => v.id)
      );
  const currentVertex = activeStep ? activeStep.currentVertex : null;

  // Source path details
  const pathLabel = liveDijkstraResult.pathNodes
    .map((id) => getVertexLabel(vertices, id))
    .join(' → ');

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-300 uppercase tracking-wider">
          <Route className="w-4 h-4 text-indigo-400" /> Live Distance Table
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Source: <span className="font-bold text-emerald-400">{getVertexLabel(vertices, sourceNode)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400">
              <th className="pb-2">Vertex</th>
              <th className="pb-2">Distance</th>
              <th className="pb-2">Previous</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {vertices.map((v) => {
              const dist = currentDistances[v.id];
              const prev = currentPrevious[v.id];
              const isCurrent = currentVertex === v.id;
              const isVisited = currentVisited.has(v.id);

              let statusText = 'Unvisited';
              let statusClass = 'bg-slate-800/80 text-slate-400 border-slate-700';

              if (isCurrent) {
                statusText = 'Current';
                statusClass = 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse';
              } else if (isVisited) {
                statusText = 'Visited';
                statusClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              }

              const distDisplay = dist === Infinity || dist === undefined ? '∞' : dist;
              const prevDisplay = prev ? getVertexLabel(vertices, prev) : '–';

              const isSource = v.id === sourceNode;
              const isDest = v.id === destNode;

              return (
                <tr
                  key={v.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isCurrent ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-2 flex items-center gap-1.5 font-bold">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isSource
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          : isDest
                          ? 'bg-rose-950 text-rose-300 border border-rose-500'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {v.label}
                    </span>
                    {isSource && <span className="text-[10px] text-emerald-400">(src)</span>}
                    {isDest && <span className="text-[10px] text-rose-400">(dst)</span>}
                  </td>
                  <td className="py-2 font-bold text-slate-100">{distDisplay}</td>
                  <td className="py-2 text-slate-300">{prevDisplay}</td>
                  <td className="py-2 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}`}
                    >
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Shortest-Path Tree Summary */}
      <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <GitFork className="w-3.5 h-3.5 text-cyan-400" /> Shortest-Path Tree Cost:
          </span>
          <span className="font-mono font-bold text-cyan-300">
            {liveDijkstraResult.totalTreeCost}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Network className="w-3.5 h-3.5 text-amber-400" /> Shortest Path ({getVertexLabel(vertices, sourceNode)} → {getVertexLabel(vertices, destNode)}):
          </span>
          <span className="font-mono font-bold text-amber-300">
            {pathLabel || 'Unreachable'} ({liveDijkstraResult.pathCost === Infinity ? '∞' : liveDijkstraResult.pathCost})
          </span>
        </div>

        {k > 0 && (
          <div className="p-2 rounded bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200">
            Transformation active: <span className="font-mono font-bold text-white">k = +{k}</span> added to all {edges.length} edges.
          </div>
        )}
      </div>
    </div>
  );
};

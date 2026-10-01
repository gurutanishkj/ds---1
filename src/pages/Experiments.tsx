import React, { useState } from 'react';
import { useGraphStore, type SpeedType } from '../store/graphStore';
import { generateRandomConnectedGraph } from '../algorithms/counterexample';
import { solveDijkstra, getVertexLabel } from '../algorithms/dijkstra';
import { compareTrees } from '../algorithms/pathAnalysis';
import {
  FlaskConical,
  Sparkles,
  Layers,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import type { Vertex, Edge } from '../types/graph';

export const Experiments: React.FC = () => {
  const { importGraphData, setActiveTab } = useGraphStore();

  const [vertexCount, setVertexCount] = useState<number>(5);
  const [density, setDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [minWeight, setMinWeight] = useState<number>(2);
  const [maxWeight, setMaxWeight] = useState<number>(14);
  const [testK, setTestK] = useState<number>(3);
  const [speed, setSpeed] = useState<SpeedType>('medium');

  // Local experiment state
  const [expGraph, setExpGraph] = useState<{
    vertices: Vertex[];
    edges: Edge[];
    source: string;
    dest: string;
  } | null>(() => {
    return generateRandomConnectedGraph(5, 2, 14, 'medium');
  });

  const [experimentRun, setExperimentRun] = useState<boolean>(true);

  const handleGenerateGraph = () => {
    const res = generateRandomConnectedGraph(vertexCount, minWeight, maxWeight, density);
    setExpGraph(res);
    setExperimentRun(false);
  };

  const handleRunExperiment = () => {
    setExperimentRun(true);
  };

  const handleSendToVisualizer = () => {
    if (!expGraph) return;
    importGraphData({
      vertices: expGraph.vertices,
      edges: expGraph.edges,
      source: expGraph.source,
      dest: expGraph.dest,
      k: testK,
    });
    setActiveTab('visualizer');
  };

  // Run Dijkstra on expGraph
  const experimentAnalysis = React.useMemo(() => {
    if (!expGraph) return null;

    const orig = solveDijkstra(expGraph.vertices, expGraph.edges, expGraph.source, expGraph.dest, false);

    const modEdges = expGraph.edges.map((e) => ({
      ...e,
      modifiedWeight: e.originalWeight + testK,
    }));
    const mod = solveDijkstra(expGraph.vertices, modEdges, expGraph.source, expGraph.dest, true);

    const treeComp = compareTrees(expGraph.vertices, expGraph.edges, expGraph.source, testK);

    const origPathStr = orig.pathNodes.map((id) => getVertexLabel(expGraph.vertices, id)).join(' → ');
    const modPathStr = mod.pathNodes.map((id) => getVertexLabel(expGraph.vertices, id)).join(' → ');

    // Generate batch sweep table for k = 0, 1, 2, 3, 4, 5, 6, 8, 10
    const sweepKValues = [0, 1, 2, 3, 4, 5, 6, 8, 10];
    const sweepResults = sweepKValues.map((sweepK) => {
      const sweptEdges = expGraph.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight + sweepK,
      }));
      const res = solveDijkstra(expGraph.vertices, sweptEdges, expGraph.source, expGraph.dest, sweepK > 0);
      const treeSweep = compareTrees(expGraph.vertices, expGraph.edges, expGraph.source, sweepK);
      return {
        k: sweepK,
        shortestPath: res.pathNodes.map((id) => getVertexLabel(expGraph.vertices, id)).join(' → '),
        pathCost: res.pathCost,
        treeCost: res.totalTreeCost,
        treeChanged: treeSweep.treeChanged,
        alteredEdgesCount: treeSweep.addedEdges.length,
      };
    });

    return {
      orig,
      mod,
      treeComp,
      origPathStr,
      modPathStr,
      pathChanged: origPathStr !== modPathStr,
      sweepResults,
    };
  }, [expGraph, testK]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-black text-white">Algorithm Laboratory & Experiment Arena</h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure custom parameter ranges, synthesize randomized connected topologies, and test uniform edge weight shifts across batch intervals.
          </p>
        </div>

        <button
          onClick={handleSendToVisualizer}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          Open in Main Visualizer <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Experiment Controls */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-xs">
          <div className="font-bold text-sm text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Generator Parameters
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Vertex Count (V):</span>
              <span className="font-bold font-mono text-white">{vertexCount}</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              value={vertexCount}
              onChange={(e) => setVertexCount(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="text-slate-300 mb-1">Graph Density:</div>
            <div className="grid grid-cols-3 gap-1.5 font-mono">
              {(['low', 'medium', 'high'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`py-1.5 rounded-lg border text-center capitalize ${
                    density === d
                      ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-300 block mb-1">Min Weight:</label>
              <input
                type="number"
                min={1}
                max={maxWeight}
                value={minWeight}
                onChange={(e) => setMinWeight(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Max Weight:</label>
              <input
                type="number"
                min={minWeight}
                max={50}
                value={maxWeight}
                onChange={(e) => setMaxWeight(parseInt(e.target.value) || 10)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Shift Constant (k):</span>
              <span className="font-bold font-mono text-amber-400">+{testK}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={testK}
              onChange={(e) => setTestK(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Animation Speed:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['slow', 'medium', 'fast'] as SpeedType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-1 rounded border capitalize ${
                    speed === s
                      ? 'bg-slate-800 border-indigo-400 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={handleGenerateGraph}
              className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/50 font-bold transition-colors"
            >
              Generate Graph
            </button>

            <button
              onClick={handleRunExperiment}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md transition-colors"
            >
              Run Experiment
            </button>
          </div>
        </div>

        {/* Center & Right: Experiment Results & Sweep */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {experimentAnalysis && experimentRun && (
            <>
              {/* Primary Output Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Tree Changed?</span>
                  <span
                    className={`text-lg font-black ${
                      experimentAnalysis.treeComp.treeChanged ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {experimentAnalysis.treeComp.treeChanged ? 'YES ⚡' : 'NO'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Altered Edges</span>
                  <span className="text-lg font-black text-cyan-400">
                    +{experimentAnalysis.treeComp.addedEdges.length}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Orig Path Cost</span>
                  <span className="text-lg font-black text-slate-100">
                    {experimentAnalysis.orig.pathCost}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">New Path Cost</span>
                  <span className="text-lg font-black text-amber-300">
                    {experimentAnalysis.mod.pathCost}
                  </span>
                </div>
              </div>

              {/* Path and Tree Details */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-3 text-xs">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Shortest Path Inversion Check
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Original Route (k=0):</span>
                    <div className="font-bold text-cyan-300 text-sm">{experimentAnalysis.origPathStr}</div>
                    <div className="text-slate-400 mt-1">Cost: {experimentAnalysis.orig.pathCost} | Tree Cost: {experimentAnalysis.orig.totalTreeCost}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Transformed Route (k={testK}):</span>
                    <div className={`font-bold text-sm ${experimentAnalysis.pathChanged ? 'text-amber-400' : 'text-slate-200'}`}>
                      {experimentAnalysis.modPathStr}
                    </div>
                    <div className="text-slate-400 mt-1">Cost: {experimentAnalysis.mod.pathCost} | Tree Cost: {experimentAnalysis.mod.totalTreeCost}</div>
                  </div>
                </div>
              </div>

              {/* Batch K-Sweep Table */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-cyan-400" /> Batch Sweep Across K-Values
                  </div>
                  <span className="text-[11px] text-slate-400">Parametric Sensitivity</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                        <th className="pb-2">k</th>
                        <th className="pb-2">Shortest Path</th>
                        <th className="pb-2 text-center">Path Cost</th>
                        <th className="pb-2 text-center">Tree Cost</th>
                        <th className="pb-2 text-right">Tree Mutated?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {experimentAnalysis.sweepResults.map((s) => (
                        <tr
                          key={s.k}
                          className={`hover:bg-slate-800/40 ${
                            s.k === testK ? 'bg-indigo-950/40 font-bold' : ''
                          }`}
                        >
                          <td className="py-2 text-indigo-400 font-bold">k = {s.k}</td>
                          <td className="py-2 text-slate-200 font-sans">{s.shortestPath}</td>
                          <td className="py-2 text-center text-white">{s.pathCost}</td>
                          <td className="py-2 text-center text-slate-300">{s.treeCost}</td>
                          <td className="py-2 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                                s.treeChanged
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {s.treeChanged ? 'Yes (Altered)' : 'Preserved'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

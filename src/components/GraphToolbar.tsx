import React, { useState } from 'react';
import { useGraphStore, type ToolType } from '../store/graphStore';
import {
  MousePointer,
  PlusCircle,
  GitCommit,
  Edit3,
  Trash2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Dices,
  Layers,
  Eraser,
  Flag,
  Target,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

export const GraphToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    vertices,
    sourceNode,
    destNode,
    setSourceNode,
    setDestNode,
    addVertex,
    undo,
    redo,
    history,
    historyIndex,
    clearGraph,
    generateCounterexample,
    generateRandom,
    loadPreset,
  } = useGraphStore();

  const reactFlow = useReactFlow();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomCount, setRandomCount] = useState(5);
  const [randomDensity, setRandomDensity] = useState<'low' | 'medium' | 'high'>('medium');

  const tools: { id: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', label: 'Select', icon: <MousePointer className="w-4 h-4" />, shortcut: 'S' },
    { id: 'add-vertex', label: 'Add Vertex', icon: <PlusCircle className="w-4 h-4" />, shortcut: 'V' },
    { id: 'add-edge', label: 'Add Edge', icon: <GitCommit className="w-4 h-4" />, shortcut: 'E' },
    { id: 'edit-weight', label: 'Edit Weight', icon: <Edit3 className="w-4 h-4" />, shortcut: 'W' },
    { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, shortcut: 'D' },
  ];

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleQuickAddVertex = () => {
    // Spawn in canvas center
    const x = 200 + Math.floor(Math.random() * 200);
    const y = 150 + Math.floor(Math.random() * 150);
    addVertex(x, y);
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      {/* Tools Selector */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Graph Editing Tools
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {t.icon}
                  {t.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-400 border border-slate-700">
                  {t.shortcut}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Add button */}
      <button
        onClick={handleQuickAddVertex}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-colors"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        + Spawn Vertex (Center)
      </button>

      {/* Source & Destination Selectors */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Source & Destination
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mb-1">
              <Flag className="w-3 h-3" /> Source
            </label>
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
            >
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1 text-[11px] text-rose-400 font-medium mb-1">
              <Target className="w-3 h-3" /> Destination
            </label>
            <select
              value={destNode}
              onChange={(e) => setDestNode(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
            >
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Undo, Redo, Zoom, Fit, Clear */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Canvas Controls
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-2 rounded-lg flex items-center justify-center text-xs ${
              canUndo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-2 rounded-lg flex items-center justify-center text-xs ${
              canRedo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => reactFlow.zoomIn()}
            title="Zoom In"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => reactFlow.zoomOut()}
            title="Zoom Out"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          <button
            onClick={() => reactFlow.fitView({ padding: 0.2 })}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
          >
            <Maximize2 className="w-3 h-3" /> Fit
          </button>
          <button
            onClick={clearGraph}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-xs text-rose-300 border border-rose-800/40 font-medium"
          >
            <Eraser className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Preset & Generators */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Presets & Generators
        </div>

        <button
          onClick={generateCounterexample}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          🎲 Counterexample
        </button>

        <button
          onClick={() => setShowRandomModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold shadow-sm transition-all"
        >
          <Dices className="w-3.5 h-3.5" />
          🎲 Random Graph
        </button>

        <div className="pt-1">
          <label className="text-[10px] text-slate-400 block mb-1">Load Preset Network:</label>
          <select
            onChange={(e) => loadPreset(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="classic-3-node">Classic 3-Node (A-B-C)</option>
            <option value="diamond-4-node">4-Node Diamond Network</option>
            <option value="spanning-tree-mutation">5-Node Full Tree Reconfiguration</option>
          </select>
        </div>
      </div>

      {/* Random Graph Config Modal */}
      {showRandomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl text-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-sm">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Generate Connected Graph
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Vertices: <span className="font-bold text-white">{randomCount}</span>
              </label>
              <input
                type="range"
                min={3}
                max={8}
                value={randomCount}
                onChange={(e) => setRandomCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Density:</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['low', 'medium', 'high'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setRandomDensity(d)}
                    className={`py-1 rounded border capitalize ${
                      randomDensity === d
                        ? 'bg-indigo-600 border-indigo-400 text-white font-semibold'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRandomModal(false)}
                className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  generateRandom(randomCount, randomDensity);
                  setShowRandomModal(false);
                }}
                className="px-3 py-1 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

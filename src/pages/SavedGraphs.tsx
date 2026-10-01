import React, { useState, useRef } from 'react';
import { useGraphStore } from '../store/graphStore';
import {
  FolderArchive,
  Download,
  Upload,
  Printer,
  Trash2,
  FolderOpen,
  Plus,
  FileJson,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { toPng } from 'html-to-image';

export const SavedGraphs: React.FC = () => {
  const {
    savedExperiments,
    saveCurrentExperiment,
    deleteSavedExperiment,
    loadSavedExperiment,
    importGraphData,
    vertices,
    edges,
    sourceNode,
    destNode,
    k,
    liveDijkstraResult,
  } = useGraphStore();

  const [newExpName, setNewExpName] = useState('');
  const [newExpNotes, setNewExpNotes] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportPrintRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    saveCurrentExperiment(newExpName.trim() || 'Untitled Experiment', newExpNotes.trim());
    setNewExpName('');
    setNewExpNotes('');
    setShowSaveModal(false);
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appName: 'PathShift Visualizer',
      source: sourceNode,
      destination: destNode,
      k,
      vertices,
      edges,
      results: {
        shortestPathNodes: liveDijkstraResult.pathNodes,
        shortestPathCost: liveDijkstraResult.pathCost,
        treeCost: liveDijkstraResult.totalTreeCost,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathshift-experiment-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.vertices && parsed.edges) {
          importGraphData({
            vertices: parsed.vertices,
            edges: parsed.edges,
            source: parsed.source || parsed.vertices[0]?.id || '',
            dest: parsed.destination || parsed.vertices[parsed.vertices.length - 1]?.id || '',
            k: parsed.k || 0,
          });
          alert('Graph data imported successfully!');
        } else {
          alert('Invalid JSON graph format. Must contain "vertices" and "edges".');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportPNG = async () => {
    if (!reportPrintRef.current) return;
    try {
      const dataUrl = await toPng(reportPrintRef.current, { backgroundColor: '#090d16' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pathshift-report-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Could not export PNG directly. Try the Print option.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white">Saved Experiments & Export Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Archive graph configurations locally, generate formal PDF/print reports, and export raw data in JSON format.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Save Current Graph
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Printable Report Preview Card */}
      <div
        ref={reportPrintRef}
        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl space-y-4 print:bg-white print:text-black print:border-none print:shadow-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:border-black">
          <div>
            <h2 className="text-lg font-bold text-white print:text-black">
              Formal Experiment Summary Report
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Live snapshot of current visualizer network, edge transformations, and shortest-path outcome
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleExportPNG}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <span className="text-slate-500 block text-[10px]">Vertices / Edges</span>
            <span className="font-bold text-white print:text-black text-sm">{vertices.length} V / {edges.length} E</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <span className="text-slate-500 block text-[10px]">Source & Destination</span>
            <span className="font-bold text-indigo-400 print:text-indigo-700 text-sm">{sourceNode} → {destNode}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <span className="text-slate-500 block text-[10px]">K Transformation</span>
            <span className="font-bold text-amber-400 print:text-amber-700 text-sm">+{k}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <span className="text-slate-500 block text-[10px]">Shortest Path Cost</span>
            <span className="font-bold text-emerald-400 print:text-emerald-700 text-sm">{liveDijkstraResult.pathCost}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-200 text-xs space-y-2">
          <div className="font-mono font-bold text-slate-200 print:text-black">
            Active Shortest Path: {liveDijkstraResult.pathNodes.join(' → ') || 'None'}
          </div>
          <div className="text-slate-400 print:text-gray-700 font-mono text-[11px]">
            Formula: W'(P) = W(P) + |P| · k. Adding k = {k} increases paths with m edges by m · {k}.
          </div>
        </div>
      </div>

      {/* Saved Experiments Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Locally Stored Archives ({savedExperiments.length})
          </div>
        </div>

        {savedExperiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedExperiments.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-base text-white">{exp.name}</h3>
                    <button
                      onClick={() => deleteSavedExperiment(exp.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Experiment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.date}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vertices / Edges:</span>
                      <span className="text-slate-200">{exp.vertices.length} / {exp.edges.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shift Value k:</span>
                      <span className="text-amber-400 font-bold">+{exp.k}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tree Mutated?</span>
                      <span className={exp.treeChanged ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {exp.treeChanged ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>

                  {exp.notes && (
                    <p className="text-xs text-slate-400 italic line-clamp-2">
                      "{exp.notes}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => loadSavedExperiment(exp)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" /> Load into Visualizer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center space-y-2">
            <FileJson className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-400">No Saved Experiments Found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save your custom graphs and configurations to revisit later or export them as JSON.
            </p>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-white">Save Current Experiment</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Experiment Name:</label>
                <input
                  type="text"
                  value={newExpName}
                  onChange={(e) => setNewExpName(e.target.value)}
                  placeholder="e.g., 3-Node Weight Inversion Test"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Notes / Hypothesis:</label>
                <textarea
                  value={newExpNotes}
                  onChange={(e) => setNewExpNotes(e.target.value)}
                  rows={3}
                  placeholder="Record your observation about tree edges and path shifts..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Save Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

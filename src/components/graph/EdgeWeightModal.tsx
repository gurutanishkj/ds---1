import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { getVertexLabel } from '../../algorithms/dijkstra';
import { Check, X } from 'lucide-react';

export const EdgeWeightModal: React.FC = () => {
  const {
    pendingEdgeModal,
    setPendingEdgeModal,
    addEdge,
    editingEdgeId,
    setEditingEdgeId,
    edges,
    vertices,
    updateEdgeWeight,
  } = useGraphStore();

  const [weight, setWeight] = useState<string>('5');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingEdgeId) {
      const edge = edges.find((e) => e.id === editingEdgeId);
      if (edge) {
        setWeight(edge.originalWeight.toString());
      }
    } else if (pendingEdgeModal) {
      setWeight('5');
    }
    setError('');
  }, [editingEdgeId, pendingEdgeModal, edges]);

  if (!pendingEdgeModal && !editingEdgeId) return null;

  const isEditingExisting = !!editingEdgeId;
  const currentEdge = isEditingExisting ? edges.find((e) => e.id === editingEdgeId) : null;

  const sourceLabel = isEditingExisting
    ? currentEdge
      ? getVertexLabel(vertices, currentEdge.source)
      : ''
    : pendingEdgeModal
    ? getVertexLabel(vertices, pendingEdgeModal.source)
    : '';

  const targetLabel = isEditingExisting
    ? currentEdge
      ? getVertexLabel(vertices, currentEdge.target)
      : ''
    : pendingEdgeModal
    ? getVertexLabel(vertices, pendingEdgeModal.target)
    : '';

  const handleSave = () => {
    const num = parseFloat(weight);
    if (isNaN(num)) {
      setError('Please enter a valid numeric weight');
      return;
    }
    if (num < 0) {
      setError('Dijkstra requires non-negative edge weights (≥ 0)');
      return;
    }

    if (isEditingExisting && editingEdgeId) {
      updateEdgeWeight(editingEdgeId, num);
      setEditingEdgeId(null);
    } else if (pendingEdgeModal) {
      addEdge(pendingEdgeModal.source, pendingEdgeModal.target, num);
      setPendingEdgeModal(null);
    }
  };

  const handleClose = () => {
    setPendingEdgeModal(null);
    setEditingEdgeId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">
            {isEditingExisting ? 'Edit Edge Weight' : 'Enter Edge Weight'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center gap-3 py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-sm">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700">
              {sourceLabel}
            </span>
            <span className="text-slate-400">─────</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-700">
              {targetLabel}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Original Weight w(e):
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={weight}
              autoFocus
              onChange={(e) => {
                setWeight(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="e.g. 5"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono text-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            {isEditingExisting ? 'Save Weight' : 'Create Edge'}
          </button>
        </div>
      </div>
    </div>
  );
};

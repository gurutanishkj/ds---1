import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';
import { Flag, Target, Sparkles } from 'lucide-react';

export interface VertexNodeData {
  label: string;
  isSource: boolean;
  isDest: boolean;
  distance: number;
  status: 'unvisited' | 'current' | 'visited';
  isPathNode: boolean;
  [key: string]: unknown;
}

export const CustomVertexNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as VertexNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(nodeData.label || id);

  const {
    activeTool,
    edgeStartNodeId,
    setEdgeStartNodeId,
    setPendingEdgeModal,
    deleteVertex,
    renameVertex,
    setSourceNode,
    setDestNode,
  } = useGraphStore();

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlurOrEnter = () => {
    setIsEditing(false);
    if (editLabel.trim() && editLabel !== nodeData.label) {
      renameVertex(id, editLabel.trim().toUpperCase());
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      deleteVertex(id);
      return;
    }

    if (activeTool === 'add-edge') {
      if (!edgeStartNodeId) {
        setEdgeStartNodeId(id);
      } else if (edgeStartNodeId !== id) {
        setPendingEdgeModal({ source: edgeStartNodeId, target: id });
        setEdgeStartNodeId(null);
      }
    }
  };

  const isEdgeStart = edgeStartNodeId === id;

  // Determine styling based on algorithm and source/dest state
  let borderStyle = 'border-slate-600/70 bg-slate-900/90 text-slate-100 shadow-md';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (nodeData.isSource) {
    borderStyle = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 shadow-emerald-500/20 shadow-lg ring-2 ring-emerald-500/40';
    badgeColor = 'bg-emerald-900/80 text-emerald-200 border-emerald-600';
  } else if (nodeData.isDest) {
    borderStyle = 'border-rose-500 bg-rose-950/80 text-rose-200 shadow-rose-500/20 shadow-lg ring-2 ring-rose-500/40';
    badgeColor = 'bg-rose-900/80 text-rose-200 border-rose-600';
  } else if (nodeData.status === 'current') {
    borderStyle = 'border-amber-400 bg-amber-950/90 text-amber-200 shadow-amber-500/40 shadow-xl ring-4 ring-amber-400/50 animate-pulse';
    badgeColor = 'bg-amber-900/90 text-amber-200 border-amber-500';
  } else if (nodeData.status === 'visited') {
    borderStyle = 'border-cyan-500/80 bg-cyan-950/70 text-cyan-200 shadow-cyan-500/20 shadow-md ring-1 ring-cyan-500/30';
    badgeColor = 'bg-cyan-900/70 text-cyan-200 border-cyan-600';
  } else if (nodeData.isPathNode) {
    borderStyle = 'border-amber-400 bg-slate-900 text-amber-300 shadow-amber-400/30 shadow-lg ring-2 ring-amber-400';
  }

  if (isEdgeStart) {
    borderStyle = 'border-indigo-400 bg-indigo-950/90 text-indigo-200 ring-4 ring-indigo-400/60 animate-bounce';
  } else if (selected) {
    borderStyle += ' ring-2 ring-blue-400';
  }

  const distText = nodeData.distance === Infinity ? '∞' : `${nodeData.distance}`;

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group relative flex flex-col items-center justify-center min-w-[58px] min-h-[58px] rounded-full border-2 p-2 transition-all duration-200 cursor-pointer select-none backdrop-blur-md ${borderStyle}`}
    >
      {/* React Flow Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-indigo-400 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-indigo-400 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-indigo-400 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-indigo-400 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Role Indicator Icons */}
      <div className="absolute -top-3 flex items-center space-x-1">
        {nodeData.isSource && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500 text-slate-950 shadow">
            <Flag className="w-2.5 h-2.5 inline" /> SRC
          </span>
        )}
        {nodeData.isDest && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-500 text-slate-950 shadow">
            <Target className="w-2.5 h-2.5 inline" /> DST
          </span>
        )}
        {nodeData.status === 'current' && !nodeData.isSource && !nodeData.isDest && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-400 text-slate-950 shadow">
            <Sparkles className="w-2.5 h-2.5 inline" /> CURR
          </span>
        )}
      </div>

      {/* Label or In-place Editor */}
      {isEditing ? (
        <input
          type="text"
          value={editLabel}
          maxLength={4}
          autoFocus
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={(e) => e.key === 'Enter' && handleBlurOrEnter()}
          className="w-10 text-center font-bold text-base bg-slate-800 text-white rounded border border-indigo-400 outline-none"
        />
      ) : (
        <div className="font-extrabold text-lg tracking-wider">
          {nodeData.label || id}
        </div>
      )}

      {/* Live Distance Pill */}
      <div
        className={`absolute -bottom-3 px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded-full border shadow-sm transition-colors ${badgeColor}`}
      >
        d={distText}
      </div>

      {/* Quick context hover buttons */}
      <div className="absolute -right-7 -top-2 hidden group-hover:flex flex-col gap-1 z-20">
        {!nodeData.isSource && (
          <button
            title="Set as Source"
            onClick={(e) => {
              e.stopPropagation();
              setSourceNode(id);
            }}
            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] shadow"
          >
            S
          </button>
        )}
        {!nodeData.isDest && (
          <button
            title="Set as Destination"
            onClick={(e) => {
              e.stopPropagation();
              setDestNode(id);
            }}
            className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] shadow"
          >
            D
          </button>
        )}
      </div>
    </div>
  );
};

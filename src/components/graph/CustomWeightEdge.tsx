import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';

export interface WeightEdgeData {
  originalWeight: number;
  modifiedWeight: number;
  k: number;
  isTreeEdge: boolean;
  isShortestPath: boolean;
  isActiveStepEdge: boolean;
  [key: string]: unknown;
}

export const CustomWeightEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) => {
  const edgeData = data as unknown as WeightEdgeData;
  const { activeTool, deleteEdge, setEditingEdgeId } = useGraphStore();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const origWeight = edgeData?.originalWeight ?? 1;
  const modWeight = edgeData?.modifiedWeight ?? origWeight;
  const k = edgeData?.k ?? 0;
  const isTreeEdge = edgeData?.isTreeEdge ?? false;
  const isShortestPath = edgeData?.isShortestPath ?? false;
  const isActiveStepEdge = edgeData?.isActiveStepEdge ?? false;

  let strokeColor = '#475569'; // slate-600
  let strokeWidth = 2;
  let strokeDasharray = undefined;

  if (isActiveStepEdge) {
    strokeColor = '#a855f7'; // purple-500
    strokeWidth = 4;
    strokeDasharray = '5 5';
  } else if (isShortestPath) {
    strokeColor = '#fbbf24'; // amber-400
    strokeWidth = 4;
    strokeDasharray = '6 3';
  } else if (isTreeEdge) {
    strokeColor = '#06b6d4'; // cyan-500
    strokeWidth = 3.5;
  }

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      deleteEdge(id);
    } else {
      setEditingEdgeId(id);
    }
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          transition: 'all 0.3s ease',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          onClick={handleEdgeClick}
          className="cursor-pointer group flex items-center justify-center select-none"
        >
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono font-bold shadow-md transition-all duration-200 backdrop-blur-md ${
              isShortestPath
                ? 'bg-amber-950/90 text-amber-300 border-amber-400 ring-2 ring-amber-400/40'
                : isTreeEdge
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400/30'
                : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-indigo-400 group-hover:scale-110'
            }`}
          >
            {k > 0 ? (
              <span className="flex items-center gap-1">
                <span className="text-slate-400 line-through text-[10px]">{origWeight}</span>
                <span className="text-slate-500 text-[10px]">→</span>
                <span className="text-emerald-400 font-extrabold">{modWeight}</span>
                <span className="text-[9px] text-indigo-400 font-normal">(+{k})</span>
              </span>
            ) : (
              <span>{origWeight}</span>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

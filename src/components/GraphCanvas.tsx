import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge as FlowEdge,
  type OnNodesChange,
  type Connection,
  applyNodeChanges,
} from '@xyflow/react';
import { useGraphStore } from '../store/graphStore';
import { CustomVertexNode, type VertexNodeData } from './graph/CustomVertexNode';
import { CustomWeightEdge, type WeightEdgeData } from './graph/CustomWeightEdge';
import { EdgeWeightModal } from './graph/EdgeWeightModal';

const nodeTypes = {
  customVertex: CustomVertexNode,
};

const edgeTypes = {
  customWeightEdge: CustomWeightEdge,
};

export const GraphCanvas: React.FC = () => {
  const {
    vertices,
    edges,
    sourceNode,
    destNode,
    k,
    activeTool,
    addVertex,
    setPendingEdgeModal,
    moveVertex,
    isAlgorithmRunning,
    currentStepIndex,
    algorithmSteps,
    liveDijkstraResult,
    theme,
  } = useGraphStore();

  // Determine active step data if algorithm is running
  const activeStep = isAlgorithmRunning && algorithmSteps[currentStepIndex]
    ? algorithmSteps[currentStepIndex]
    : null;

  const currentDistances = activeStep ? activeStep.distances : liveDijkstraResult.distances;
  const currentVisited = activeStep ? new Set(activeStep.visitedVertices) : null;
  const currentVertex = activeStep ? activeStep.currentVertex : null;
  const activeEdgeId = activeStep ? activeStep.activeEdge : null;

  // Convert store vertices to React Flow nodes
  const flowNodes: Node<VertexNodeData>[] = useMemo(() => {
    return vertices.map((v) => {
      let status: 'unvisited' | 'current' | 'visited' = 'unvisited';
      if (currentVertex === v.id) {
        status = 'current';
      } else if (currentVisited && currentVisited.has(v.id)) {
        status = 'visited';
      }

      return {
        id: v.id,
        type: 'customVertex',
        position: { x: v.x, y: v.y },
        data: {
          label: v.label,
          isSource: v.id === sourceNode,
          isDest: v.id === destNode,
          distance: currentDistances[v.id] ?? Infinity,
          status,
          isPathNode: liveDijkstraResult.pathNodes.includes(v.id),
        },
      };
    });
  }, [
    vertices,
    sourceNode,
    destNode,
    currentDistances,
    currentVertex,
    currentVisited,
    liveDijkstraResult.pathNodes,
  ]);

  // Convert store edges to React Flow edges
  const flowEdges: FlowEdge<WeightEdgeData>[] = useMemo(() => {
    return edges.map((e) => {
      const isTreeEdge = liveDijkstraResult.treeEdges.includes(e.id);
      const isShortestPath = liveDijkstraResult.pathEdges.includes(e.id);
      const isActiveStepEdge = e.id === activeEdgeId;

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'customWeightEdge',
        data: {
          originalWeight: e.originalWeight,
          modifiedWeight: e.modifiedWeight,
          k,
          isTreeEdge,
          isShortestPath,
          isActiveStepEdge,
        },
      };
    });
  }, [edges, liveDijkstraResult.treeEdges, liveDijkstraResult.pathEdges, activeEdgeId, k]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          moveVertex(change.id, Math.round(change.position.x), Math.round(change.position.y));
        }
      });
      // Allow internal reactflow drag
      applyNodeChanges(changes, flowNodes);
    },
    [moveVertex, flowNodes]
  );

  const handleConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && params.source !== params.target) {
        setPendingEdgeModal({ source: params.source, target: params.target });
      }
    },
    [setPendingEdgeModal]
  );

  const handlePaneClick = (event: React.MouseEvent) => {
    if (activeTool === 'add-vertex') {
      const canvasEl = event.currentTarget.getBoundingClientRect();
      const x = Math.round(event.clientX - canvasEl.left);
      const y = Math.round(event.clientY - canvasEl.top);
      addVertex(x, y);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onConnect={handleConnect}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color={theme === 'dark' ? '#334155' : '#cbd5e1'}
        />
        <Controls className="!bg-slate-900 !border-slate-700 !text-slate-200 fill-slate-200" />
      </ReactFlow>

      {/* Top Overlay Legend */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-800 text-xs font-medium text-slate-300 pointer-events-none shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Source
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Destination
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-amber-400 rounded-sm inline-block" /> Shortest Path
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-cyan-400 rounded-sm inline-block" /> Tree Edge
        </span>
      </div>

      <EdgeWeightModal />
    </div>
  );
};

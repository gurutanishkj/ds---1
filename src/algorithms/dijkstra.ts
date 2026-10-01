import type { Vertex, Edge, AlgorithmStep, DijkstraResult } from '../types/graph';

export function solveDijkstra(
  vertices: Vertex[],
  edges: Edge[],
  sourceId: string,
  destId?: string,
  useModifiedWeight: boolean = false
): DijkstraResult {
  const steps: AlgorithmStep[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>(vertices.map((v) => v.id));

  // Initialize
  vertices.forEach((v) => {
    distances[v.id] = v.id === sourceId ? 0 : Infinity;
    previous[v.id] = null;
  });

  let stepCounter = 1;

  steps.push({
    stepNumber: stepCounter++,
    type: 'INIT',
    currentVertex: sourceId,
    activeEdge: null,
    visitedVertices: [],
    unvisitedVertices: Array.from(unvisited),
    distances: { ...distances },
    previous: { ...previous },
    logMessage: `Initialized Dijkstra from source vertex [${getVertexLabel(vertices, sourceId)}]. dist[source] = 0, others = ∞.`,
  });

  // Build adjacency list (undirected graph)
  const adj = new Map<string, Array<{ neighborId: string; edge: Edge; weight: number }>>();
  vertices.forEach((v) => adj.set(v.id, []));

  edges.forEach((edge) => {
    const w = useModifiedWeight ? edge.modifiedWeight : edge.originalWeight;
    adj.get(edge.source)?.push({ neighborId: edge.target, edge, weight: w });
    adj.get(edge.target)?.push({ neighborId: edge.source, edge, weight: w });
  });

  while (unvisited.size > 0) {
    // Select unvisited vertex with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const vId of unvisited) {
      if (distances[vId] < minDistance) {
        minDistance = distances[vId];
        currentId = vId;
      }
    }

    if (!currentId || minDistance === Infinity) {
      // Remaining vertices are unreachable
      break;
    }

    const currentLabel = getVertexLabel(vertices, currentId);

    steps.push({
      stepNumber: stepCounter++,
      type: 'SELECT_VERTEX',
      currentVertex: currentId,
      activeEdge: null,
      visitedVertices: Array.from(visited),
      unvisitedVertices: Array.from(unvisited),
      distances: { ...distances },
      previous: { ...previous },
      logMessage: `Selected unvisited vertex [${currentLabel}] with smallest tentative distance ${minDistance}.`,
    });

    // Examine neighbors
    const neighbors = adj.get(currentId) || [];
    for (const { neighborId, edge, weight } of neighbors) {
      if (visited.has(neighborId)) continue;

      const neighborLabel = getVertexLabel(vertices, neighborId);
      const edgeWeightStr = `${weight}`;

      steps.push({
        stepNumber: stepCounter++,
        type: 'EXAMINE_EDGE',
        currentVertex: currentId,
        activeEdge: edge.id,
        visitedVertices: Array.from(visited),
        unvisitedVertices: Array.from(unvisited),
        distances: { ...distances },
        previous: { ...previous },
        logMessage: `Inspecting edge (${currentLabel} — ${neighborLabel}) with weight ${edgeWeightStr}.`,
        formulaDetail: `dist[${currentLabel}] (${distances[currentId]}) + w(${edgeWeightStr}) = ${distances[currentId] + weight}`,
      });

      const alternativeDist = distances[currentId] + weight;
      if (alternativeDist < distances[neighborId]) {
        const oldDist = distances[neighborId];
        distances[neighborId] = alternativeDist;
        previous[neighborId] = currentId;

        steps.push({
          stepNumber: stepCounter++,
          type: 'RELAX_EDGE',
          currentVertex: currentId,
          activeEdge: edge.id,
          visitedVertices: Array.from(visited),
          unvisitedVertices: Array.from(unvisited),
          distances: { ...distances },
          previous: { ...previous },
          logMessage: `Relaxed edge! Updated dist[${neighborLabel}] from ${oldDist === Infinity ? '∞' : oldDist} to ${alternativeDist} via [${currentLabel}].`,
          formulaDetail: `dist[${neighborLabel}] = ${alternativeDist}`,
        });
      } else {
        steps.push({
          stepNumber: stepCounter++,
          type: 'SKIP_EDGE',
          currentVertex: currentId,
          activeEdge: edge.id,
          visitedVertices: Array.from(visited),
          unvisitedVertices: Array.from(unvisited),
          distances: { ...distances },
          previous: { ...previous },
          logMessage: `No update for [${neighborLabel}]: alternative distance ${alternativeDist} ≥ current ${distances[neighborId]}.`,
        });
      }
    }

    // Mark current as visited
    unvisited.delete(currentId);
    visited.add(currentId);

    steps.push({
      stepNumber: stepCounter++,
      type: 'FINISH_VERTEX',
      currentVertex: currentId,
      activeEdge: null,
      visitedVertices: Array.from(visited),
      unvisitedVertices: Array.from(unvisited),
      distances: { ...distances },
      previous: { ...previous },
      logMessage: `Marked vertex [${currentLabel}] as visited. Permanent shortest distance confirmed: ${distances[currentId]}.`,
    });
  }

  // Construct shortest-path tree edges
  const treeEdges: string[] = [];
  let totalTreeCost = 0;

  for (const [vId, pId] of Object.entries(previous)) {
    if (pId && distances[vId] !== Infinity) {
      const treeEdge = edges.find(
        (e) => (e.source === vId && e.target === pId) || (e.source === pId && e.target === vId)
      );
      if (treeEdge) {
        treeEdges.push(treeEdge.id);
        const w = useModifiedWeight ? treeEdge.modifiedWeight : treeEdge.originalWeight;
        totalTreeCost += w;
      }
    }
  }

  // Construct path from source to dest
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  let pathCost = 0;

  if (destId && distances[destId] !== Infinity) {
    let curr: string | null = destId;
    while (curr) {
      pathNodes.unshift(curr);
      const prevNode: string | null = previous[curr];
      if (prevNode) {
        const edge = edges.find(
          (e) => (e.source === curr && e.target === prevNode) || (e.source === prevNode && e.target === curr)
        );
        if (edge) {
          pathEdges.unshift(edge.id);
        }
      }
      curr = prevNode;
    }
    pathCost = distances[destId];
  }

  steps.push({
    stepNumber: stepCounter++,
    type: 'COMPLETE',
    currentVertex: null,
    activeEdge: null,
    visitedVertices: Array.from(visited),
    unvisitedVertices: Array.from(unvisited),
    distances: { ...distances },
    previous: { ...previous },
    logMessage: `Dijkstra completed! Shortest-path tree constructed with ${treeEdges.length} edges (Total Tree Cost: ${totalTreeCost}).`,
  });

  return {
    distances,
    previous,
    treeEdges,
    pathEdges,
    pathNodes,
    pathCost,
    totalTreeCost,
    steps,
  };
}

export function getVertexLabel(vertices: Vertex[], id: string): string {
  const v = vertices.find((vert) => vert.id === id);
  return v ? v.label : id;
}

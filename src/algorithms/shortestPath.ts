import type { Vertex, Edge, PathCandidate } from '../types/graph';
import { getVertexLabel } from './dijkstra';

/**
 * Finds simple paths between source and destination using DFS.
 */
export function findAllSimplePaths(
  vertices: Vertex[],
  edges: Edge[],
  sourceId: string,
  destId: string,
  k: number = 0,
  maxPaths: number = 15
): PathCandidate[] {
  if (!sourceId || !destId || sourceId === destId) {
    return [];
  }

  const adj = new Map<string, Array<{ neighborId: string; edge: Edge }>>();
  vertices.forEach((v) => adj.set(v.id, []));

  edges.forEach((edge) => {
    adj.get(edge.source)?.push({ neighborId: edge.target, edge });
    adj.get(edge.target)?.push({ neighborId: edge.source, edge });
  });

  const paths: PathCandidate[] = [];
  const visited = new Set<string>();

  function dfs(curr: string, currentNodes: string[], currentEdges: string[], currentOrigCost: number) {
    if (paths.length >= maxPaths) return;

    if (curr === destId) {
      const edgeCount = currentEdges.length;
      const modCost = currentOrigCost + edgeCount * k;
      const formulaStr = `${currentOrigCost} + (${edgeCount} × ${k}) = ${modCost}`;

      paths.push({
        nodes: [...currentNodes],
        edgeIds: [...currentEdges],
        edgeCount,
        originalCost: currentOrigCost,
        modifiedCost: modCost,
        formulaString: formulaStr,
        isShortest: false,
      });
      return;
    }

    visited.add(curr);
    const neighbors = adj.get(curr) || [];

    for (const { neighborId, edge } of neighbors) {
      if (!visited.has(neighborId)) {
        dfs(
          neighborId,
          [...currentNodes, neighborId],
          [...currentEdges, edge.id],
          currentOrigCost + edge.originalWeight
        );
      }
    }

    visited.delete(curr);
  }

  dfs(sourceId, [sourceId], [], 0);

  paths.sort((a, b) => a.modifiedCost - b.modifiedCost);

  if (paths.length > 0) {
    const minCost = paths[0].modifiedCost;
    paths.forEach((p) => {
      p.isShortest = p.modifiedCost === minCost;
    });
  }

  return paths;
}

export function formatPathLabels(vertices: Vertex[], nodeIds: string[]): string {
  return nodeIds.map((id) => getVertexLabel(vertices, id)).join(' → ');
}

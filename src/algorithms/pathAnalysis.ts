import type { Vertex, Edge, PathCandidate, SwitchDetection } from '../types/graph';
import { findAllSimplePaths, formatPathLabels } from './shortestPath';
import { solveDijkstra } from './dijkstra';

export function detectPathSwitch(
  vertices: Vertex[],
  edges: Edge[],
  sourceId: string,
  destId: string
): SwitchDetection {
  const originalPaths = findAllSimplePaths(vertices, edges, sourceId, destId, 0);

  if (originalPaths.length < 2) {
    return {
      hasSwitch: false,
      thresholdK: null,
      path1: { nodes: [], edgeCount: 0, originalCost: 0 },
      path2: { nodes: [], edgeCount: 0, originalCost: 0 },
      rangeDescription: 'Only one simple path exists between source and destination.',
      explanation: 'No competing paths exist to cause a path shift.',
    };
  }

  const p1 = originalPaths[0]; // shortest at k = 0
  let minSwitchK: number | null = null;
  let bestAlternative: PathCandidate | null = null;

  for (let i = 1; i < originalPaths.length; i++) {
    const pAlt = originalPaths[i];
    // For pAlt to overtake p1 as k increases:
    // W(p1) + m1 * k > W(pAlt) + mAlt * k
    // Requires m1 > mAlt (p1 has more edges than pAlt, despite lower initial cost)
    if (p1.edgeCount > pAlt.edgeCount && pAlt.originalCost > p1.originalCost) {
      const kCross = (pAlt.originalCost - p1.originalCost) / (p1.edgeCount - pAlt.edgeCount);
      if (kCross > 0 && (minSwitchK === null || kCross < minSwitchK)) {
        minSwitchK = kCross;
        bestAlternative = pAlt;
      }
    }
  }

  if (minSwitchK !== null && bestAlternative) {
    const formattedK = Number.isInteger(minSwitchK) ? `${minSwitchK}` : minSwitchK.toFixed(2);
    const p1Label = formatPathLabels(vertices, p1.nodes);
    const p2Label = formatPathLabels(vertices, bestAlternative.nodes);

    return {
      hasSwitch: true,
      thresholdK: minSwitchK,
      path1: {
        nodes: p1.nodes,
        edgeCount: p1.edgeCount,
        originalCost: p1.originalCost,
      },
      path2: {
        nodes: bestAlternative.nodes,
        edgeCount: bestAlternative.edgeCount,
        originalCost: bestAlternative.originalCost,
      },
      rangeDescription: `Before k = ${formattedK}: [${p1Label}] is strictly shortest. After k > ${formattedK}: [${p2Label}] becomes strictly shortest.`,
      explanation: `Path [${p1Label}] has ${p1.edgeCount} edges, paying +${p1.edgeCount}k penalty. Path [${p2Label}] has only ${bestAlternative.edgeCount} edges, paying only +${bestAlternative.edgeCount}k penalty. At k = ${formattedK}, their costs tie. For any larger k, the fewer-hop path wins!`,
    };
  }

  return {
    hasSwitch: false,
    thresholdK: null,
    path1: {
      nodes: p1.nodes,
      edgeCount: p1.edgeCount,
      originalCost: p1.originalCost,
    },
    path2: {
      nodes: originalPaths[1].nodes,
      edgeCount: originalPaths[1].edgeCount,
      originalCost: originalPaths[1].originalCost,
    },
    rangeDescription: 'The initial shortest path retains the fewest or equal number of edges, so increasing k will never cause another path to become shorter.',
    explanation: 'When the initial shortest path already has fewer or equal edges compared to all alternatives, adding positive k increases all alternatives by at least as much or more.',
  };
}

export interface TreeComparisonResult {
  treeChanged: boolean;
  originalEdges: string[];
  modifiedEdges: string[];
  retainedEdges: string[];
  addedEdges: string[];
  removedEdges: string[];
  originalTreeCost: number;
  modifiedTreeCost: number;
}

export function compareTrees(
  vertices: Vertex[],
  edges: Edge[],
  sourceId: string,
  k: number
): TreeComparisonResult {
  const origResult = solveDijkstra(vertices, edges, sourceId, undefined, false);
  const updatedEdges = edges.map((e) => ({
    ...e,
    modifiedWeight: e.originalWeight + k,
  }));
  const modResult = solveDijkstra(vertices, updatedEdges, sourceId, undefined, true);

  const origSet = new Set(origResult.treeEdges);
  const modSet = new Set(modResult.treeEdges);

  const retainedEdges = origResult.treeEdges.filter((e) => modSet.has(e));
  const removedEdges = origResult.treeEdges.filter((e) => !modSet.has(e));
  const addedEdges = modResult.treeEdges.filter((e) => !origSet.has(e));

  const treeChanged = addedEdges.length > 0 || removedEdges.length > 0;

  return {
    treeChanged,
    originalEdges: origResult.treeEdges,
    modifiedEdges: modResult.treeEdges,
    retainedEdges,
    addedEdges,
    removedEdges,
    originalTreeCost: origResult.totalTreeCost,
    modifiedTreeCost: modResult.totalTreeCost,
  };
}

export function generateChartData(
  vertices: Vertex[],
  edges: Edge[],
  sourceId: string,
  destId: string,
  maxK: number = 10
) {
  const paths = findAllSimplePaths(vertices, edges, sourceId, destId, 0, 5);
  if (paths.length === 0) return [];

  const data = [];
  for (let currentK = 0; currentK <= maxK; currentK++) {
    const entry: Record<string, string | number> = { k: currentK };
    let shortestCost = Infinity;
    let shortestPathName = '';

    paths.forEach((p, idx) => {
      const pathCost = p.originalCost + p.edgeCount * currentK;
      const pathLabel = formatPathLabels(vertices, p.nodes);
      const key = `Path ${idx + 1}: ${pathLabel} (${p.edgeCount} edges)`;
      entry[key] = pathCost;

      if (pathCost < shortestCost) {
        shortestCost = pathCost;
        shortestPathName = pathLabel;
      }
    });

    entry['Shortest Cost'] = shortestCost;
    entry['Shortest Path'] = shortestPathName;
    data.push(entry);
  }

  return data;
}

import type { Vertex, Edge } from '../types/graph';

export interface GraphPreset {
  id: string;
  name: string;
  description: string;
  source: string;
  dest: string;
  recommendedK: number;
  vertices: Vertex[];
  edges: Edge[];
}

export const PRESET_GRAPHS: GraphPreset[] = [
  {
    id: 'classic-3-node',
    name: 'Classic 3-Node Counterexample',
    description: 'The canonical 3-vertex triangle where a 2-hop path (cost 8) loses to a 1-hop path (cost 10) once k ≥ 3.',
    source: 'A',
    dest: 'C',
    recommendedK: 3,
    vertices: [
      { id: 'A', label: 'A', x: 100, y: 240 },
      { id: 'B', label: 'B', x: 300, y: 100 },
      { id: 'C', label: 'C', x: 500, y: 240 },
    ],
    edges: [
      { id: 'e-AB', source: 'A', target: 'B', originalWeight: 4, modifiedWeight: 4 },
      { id: 'e-BC', source: 'B', target: 'C', originalWeight: 4, modifiedWeight: 4 },
      { id: 'e-AC', source: 'A', target: 'C', originalWeight: 10, modifiedWeight: 10 },
    ],
  },
  {
    id: 'diamond-4-node',
    name: '4-Node Diamond Network',
    description: '3-hop path S→U→V→T (cost 6) vs direct 1-hop bridge S→T (cost 9). Path flips at k > 1.5.',
    source: 'S',
    dest: 'T',
    recommendedK: 3,
    vertices: [
      { id: 'S', label: 'S', x: 100, y: 240 },
      { id: 'U', label: 'U', x: 300, y: 100 },
      { id: 'V', label: 'V', x: 300, y: 380 },
      { id: 'T', label: 'T', x: 520, y: 240 },
    ],
    edges: [
      { id: 'e-SU', source: 'S', target: 'U', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e-UV', source: 'U', target: 'V', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e-VT', source: 'V', target: 'T', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e-ST', source: 'S', target: 'T', originalWeight: 9, modifiedWeight: 9 },
      { id: 'e-SV', source: 'S', target: 'V', originalWeight: 7, modifiedWeight: 7 },
    ],
  },
  {
    id: 'spanning-tree-mutation',
    name: '5-Node Full Tree Reconfiguration',
    description: 'Observe how the entire shortest-path spanning tree branches mutate across vertices as k increases.',
    source: 'A',
    dest: 'E',
    recommendedK: 4,
    vertices: [
      { id: 'A', label: 'A', x: 80, y: 240 },
      { id: 'B', label: 'B', x: 260, y: 100 },
      { id: 'C', label: 'C', x: 260, y: 380 },
      { id: 'D', label: 'D', x: 440, y: 100 },
      { id: 'E', label: 'E', x: 560, y: 240 },
    ],
    edges: [
      { id: 'e-AB', source: 'A', target: 'B', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e-AC', source: 'A', target: 'C', originalWeight: 8, modifiedWeight: 8 },
      { id: 'e-BD', source: 'B', target: 'D', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e-DE', source: 'D', target: 'E', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e-CE', source: 'C', target: 'E', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e-BC', source: 'B', target: 'C', originalWeight: 4, modifiedWeight: 4 },
      { id: 'e-AE', source: 'A', target: 'E', originalWeight: 14, modifiedWeight: 14 },
    ],
  },
];

export function generateRandomCounterexample(): GraphPreset {
  const w1 = Math.floor(Math.random() * 4) + 2;
  const w2 = Math.floor(Math.random() * 4) + 2;
  const origP1 = w1 + w2;
  const delta = Math.floor(Math.random() * 4) + 2;
  const wDirect = origP1 + delta;

  const recK = delta + 1;

  return {
    id: `rand-counter-${Date.now()}`,
    name: `Generated Counterexample (k* = ${delta})`,
    description: `A 2-hop path (cost ${origP1}) initially beats direct 1-hop path (cost ${wDirect}). At k ≥ ${recK}, the direct path becomes shorter!`,
    source: 'A',
    dest: 'C',
    recommendedK: recK,
    vertices: [
      { id: 'A', label: 'A', x: 100, y: 240 },
      { id: 'B', label: 'B', x: 300, y: 100 },
      { id: 'C', label: 'C', x: 500, y: 240 },
    ],
    edges: [
      { id: `e-AB-${Date.now()}`, source: 'A', target: 'B', originalWeight: w1, modifiedWeight: w1 },
      { id: `e-BC-${Date.now()}`, source: 'B', target: 'C', originalWeight: w2, modifiedWeight: w2 },
      { id: `e-AC-${Date.now()}`, source: 'A', target: 'C', originalWeight: wDirect, modifiedWeight: wDirect },
    ],
  };
}

export function generateRandomConnectedGraph(
  vertexCount: number = 5,
  minWeight: number = 1,
  maxWeight: number = 15,
  density: 'low' | 'medium' | 'high' = 'medium'
): { vertices: Vertex[]; edges: Edge[]; source: string; dest: string } {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const count = Math.max(3, Math.min(vertexCount, 10));

  const centerX = 320;
  const centerY = 240;
  const radius = 170;

  const vertices: Vertex[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    vertices.push({
      id: letters[i],
      label: letters[i],
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
    });
  }

  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  function makeEdgeKey(u: string, v: string) {
    return u < v ? `${u}-${v}` : `${v}-${u}`;
  }

  function randomWeight() {
    return Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
  }

  const connectedNodes = [vertices[0].id];
  const remainingNodes = vertices.slice(1).map((v) => v.id);

  while (remainingNodes.length > 0) {
    const u = connectedNodes[Math.floor(Math.random() * connectedNodes.length)];
    const vIdx = Math.floor(Math.random() * remainingNodes.length);
    const v = remainingNodes[vIdx];
    remainingNodes.splice(vIdx, 1);
    connectedNodes.push(v);

    const w = randomWeight();
    edges.push({
      id: `e-${u}-${v}-${Date.now()}-${Math.random()}`,
      source: u,
      target: v,
      originalWeight: w,
      modifiedWeight: w,
    });
    edgeSet.add(makeEdgeKey(u, v));
  }

  const totalPossible = (count * (count - 1)) / 2;
  const targetEdgeCount =
    density === 'low'
      ? Math.min(count + 1, totalPossible)
      : density === 'medium'
      ? Math.min(Math.floor(count * 1.5), totalPossible)
      : Math.min(Math.floor(count * 2.2), totalPossible);

  let attempts = 0;
  while (edges.length < targetEdgeCount && attempts < 100) {
    attempts++;
    const i = Math.floor(Math.random() * count);
    const j = Math.floor(Math.random() * count);
    if (i !== j) {
      const u = vertices[i].id;
      const v = vertices[j].id;
      const key = makeEdgeKey(u, v);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        const w = randomWeight();
        edges.push({
          id: `e-${u}-${v}-${Date.now()}-${Math.random()}`,
          source: u,
          target: v,
          originalWeight: w,
          modifiedWeight: w,
        });
      }
    }
  }

  return {
    vertices,
    edges,
    source: vertices[0].id,
    dest: vertices[Math.min(2, count - 1)].id,
  };
}

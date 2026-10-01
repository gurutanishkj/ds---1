export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  originalWeight: number;
  modifiedWeight: number;
  isTreeEdge?: boolean;
  isShortestPath?: boolean;
}

export type StepType = 
  | 'INIT'
  | 'SELECT_VERTEX'
  | 'EXAMINE_EDGE'
  | 'RELAX_EDGE'
  | 'SKIP_EDGE'
  | 'FINISH_VERTEX'
  | 'COMPLETE';

export interface AlgorithmStep {
  stepNumber: number;
  type: StepType;
  currentVertex: string | null;
  activeEdge: string | null; // Edge ID
  visitedVertices: string[];
  unvisitedVertices: string[];
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  logMessage: string;
  formulaDetail?: string;
}

export interface DijkstraResult {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  treeEdges: string[]; // edge IDs in shortest path tree
  pathEdges: string[]; // edge IDs on shortest path between source & dest
  pathNodes: string[]; // node IDs on shortest path between source & dest
  pathCost: number;
  totalTreeCost: number;
  steps: AlgorithmStep[];
}

export interface PathCandidate {
  nodes: string[];
  edgeIds: string[];
  edgeCount: number;
  originalCost: number;
  modifiedCost: number;
  formulaString: string;
  isShortest: boolean;
}

export interface SwitchDetection {
  hasSwitch: boolean;
  thresholdK: number | null;
  path1: {
    nodes: string[];
    edgeCount: number;
    originalCost: number;
  };
  path2: {
    nodes: string[];
    edgeCount: number;
    originalCost: number;
  };
  rangeDescription: string;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialVertices: Vertex[];
  initialEdges: Edge[];
  source: string;
  destination: string;
  initialK: number;
  targetGoal: string;
  hint: string;
  checkSolved: (currentK: number, result: DijkstraResult, originalResult: DijkstraResult) => boolean;
  explanation: string;
  points: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SavedExperiment {
  id: string;
  name: string;
  date: string;
  vertices: Vertex[];
  edges: Edge[];
  source: string;
  destination: string;
  k: number;
  originalPath: string[];
  modifiedPath: string[];
  treeChanged: boolean;
  notes?: string;
}

export interface UserStats {
  score: number;
  xp: number;
  badges: string[];
  completedChallenges: string[];
  quizCompleted: boolean;
  quizScore: number;
}

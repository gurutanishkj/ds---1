import { create } from 'zustand';
import type {
  Vertex,
  Edge,
  AlgorithmStep,
  DijkstraResult,
  UserStats,
  SavedExperiment,
} from '../types/graph';
import { solveDijkstra } from '../algorithms/dijkstra';
import { PRESET_GRAPHS, generateRandomCounterexample, generateRandomConnectedGraph } from '../algorithms/counterexample';

export type ToolType = 'select' | 'add-vertex' | 'add-edge' | 'edit-weight' | 'delete';
export type SpeedType = 'slow' | 'medium' | 'fast';
export type TabType = 'visualizer' | 'learn' | 'challenges' | 'quiz' | 'experiments' | 'saved';

interface GraphStateHistory {
  vertices: Vertex[];
  edges: Edge[];
  sourceNode: string;
  destNode: string;
  k: number;
}

interface GraphStore {
  // Graph Data
  vertices: Vertex[];
  edges: Edge[];
  sourceNode: string;
  destNode: string;
  k: number;

  // Active Tooling
  activeTool: ToolType;
  edgeStartNodeId: string | null;
  pendingEdgeModal: { source: string; target: string } | null;
  editingEdgeId: string | null;

  // History (Undo / Redo)
  history: GraphStateHistory[];
  historyIndex: number;

  // Algorithm State
  isAlgorithmRunning: boolean;
  isAlgorithmPaused: boolean;
  algorithmSpeed: SpeedType;
  currentStepIndex: number;
  algorithmSteps: AlgorithmStep[];
  liveDijkstraResult: DijkstraResult;

  // Modals & Modes
  theme: 'dark' | 'light';
  activeTab: TabType;
  showExplainModal: boolean;
  showDemoMode: boolean;
  showPresentationMode: boolean;
  showBeforeAfterModal: boolean;

  // Gamification & Saved data
  userStats: UserStats;
  savedExperiments: SavedExperiment[];

  // Actions
  setActiveTab: (tab: TabType) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setActiveTool: (tool: ToolType) => void;
  setEdgeStartNodeId: (id: string | null) => void;
  setPendingEdgeModal: (modal: { source: string; target: string } | null) => void;
  setEditingEdgeId: (id: string | null) => void;

  // Graph manipulation
  addVertex: (x: number, y: number, customLabel?: string) => void;
  deleteVertex: (id: string) => void;
  renameVertex: (id: string, newLabel: string) => void;
  moveVertex: (id: string, x: number, y: number) => void;
  addEdge: (source: string, target: string, weight: number) => void;
  deleteEdge: (id: string) => void;
  updateEdgeWeight: (id: string, weight: number) => void;
  clearGraph: () => void;

  // Source & Destination
  setSourceNode: (id: string) => void;
  setDestNode: (id: string) => void;

  // K Weight Transformation
  setK: (newK: number) => void;
  applyK: () => void;
  resetWeights: () => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Algorithm Controls
  startAlgorithm: () => void;
  pauseAlgorithm: () => void;
  resumeAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetAlgorithm: () => void;
  setAlgorithmSpeed: (speed: SpeedType) => void;

  // Presets & Generators
  loadPreset: (presetId: string) => void;
  generateCounterexample: () => void;
  generateRandom: (verticesCount?: number, density?: 'low' | 'medium' | 'high') => void;

  // Modals
  setShowExplainModal: (show: boolean) => void;
  setShowDemoMode: (show: boolean) => void;
  setShowPresentationMode: (show: boolean) => void;
  setShowBeforeAfterModal: (show: boolean) => void;

  // Gamification
  addScoreAndXP: (score: number, xp: number) => void;
  completeChallenge: (challengeId: string, points: number) => void;
  saveQuizScore: (score: number) => void;

  // Saved Experiments
  saveCurrentExperiment: (name: string, notes?: string) => void;
  deleteSavedExperiment: (id: string) => void;
  loadSavedExperiment: (exp: SavedExperiment) => void;
  importGraphData: (data: { vertices: Vertex[]; edges: Edge[]; source: string; dest: string; k: number }) => void;
}

const initialPreset = PRESET_GRAPHS[0];

function computeLiveDijkstra(vertices: Vertex[], edges: Edge[], source: string, dest: string, k: number): DijkstraResult {
  if (vertices.length === 0 || !source) {
    return {
      distances: {},
      previous: {},
      treeEdges: [],
      pathEdges: [],
      pathNodes: [],
      pathCost: 0,
      totalTreeCost: 0,
      steps: [],
    };
  }

  const updatedEdges = edges.map((e) => ({
    ...e,
    modifiedWeight: e.originalWeight + k,
  }));

  return solveDijkstra(vertices, updatedEdges, source, dest, k > 0);
}

const STATS_KEY = 'pathshift_user_stats';
const SAVED_KEY = 'pathshift_saved_experiments';
const THEME_KEY = 'pathshift_theme';

function loadInitialStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    score: 0,
    xp: 0,
    badges: ['Graph Explorer'],
    completedChallenges: [],
    quizCompleted: false,
    quizScore: 0,
  };
}

function loadInitialSaved(): SavedExperiment[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function loadInitialTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch (e) {
    console.error(e);
  }
  return 'dark';
}

export const useGraphStore = create<GraphStore>((set, get) => {
  const initialVertices = initialPreset.vertices;
  const initialEdges = initialPreset.edges.map((e) => ({
    ...e,
    modifiedWeight: e.originalWeight,
  }));
  const initialSource = initialPreset.source;
  const initialDest = initialPreset.dest;
  const initialK = 0;

  const initialDijkstra = computeLiveDijkstra(
    initialVertices,
    initialEdges,
    initialSource,
    initialDest,
    initialK
  );

  return {
    vertices: initialVertices,
    edges: initialEdges,
    sourceNode: initialSource,
    destNode: initialDest,
    k: initialK,

    activeTool: 'select',
    edgeStartNodeId: null,
    pendingEdgeModal: null,
    editingEdgeId: null,

    history: [
      {
        vertices: initialVertices,
        edges: initialEdges,
        sourceNode: initialSource,
        destNode: initialDest,
        k: initialK,
      },
    ],
    historyIndex: 0,

    isAlgorithmRunning: false,
    isAlgorithmPaused: false,
    algorithmSpeed: 'medium',
    currentStepIndex: 0,
    algorithmSteps: initialDijkstra.steps,
    liveDijkstraResult: initialDijkstra,

    theme: loadInitialTheme(),
    activeTab: 'visualizer',
    showExplainModal: false,
    showDemoMode: false,
    showPresentationMode: false,
    showBeforeAfterModal: false,

    userStats: loadInitialStats(),
    savedExperiments: loadInitialSaved(),

    setActiveTab: (tab) => set({ activeTab: tab }),

    setTheme: (theme) => {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      set({ theme });
    },

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      get().setTheme(nextTheme);
    },

    setActiveTool: (tool) => set({ activeTool: tool, edgeStartNodeId: null }),
    setEdgeStartNodeId: (id) => set({ edgeStartNodeId: id }),
    setPendingEdgeModal: (modal) => set({ pendingEdgeModal: modal }),
    setEditingEdgeId: (id) => set({ editingEdgeId: id }),

    pushHistory: () => {
      const { vertices, edges, sourceNode, destNode, k, history, historyIndex } = get();
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push({
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        sourceNode,
        destNode,
        k,
      });
      if (nextHistory.length > 30) nextHistory.shift();
      set({ history: nextHistory, historyIndex: nextHistory.length - 1 });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        const snapshot = history[nextIndex];
        const updatedEdges = snapshot.edges.map((e) => ({
          ...e,
          modifiedWeight: e.originalWeight + snapshot.k,
        }));
        const newDijkstra = computeLiveDijkstra(
          snapshot.vertices,
          updatedEdges,
          snapshot.sourceNode,
          snapshot.destNode,
          snapshot.k
        );
        set({
          vertices: snapshot.vertices,
          edges: updatedEdges,
          sourceNode: snapshot.sourceNode,
          destNode: snapshot.destNode,
          k: snapshot.k,
          historyIndex: nextIndex,
          liveDijkstraResult: newDijkstra,
          algorithmSteps: newDijkstra.steps,
          currentStepIndex: newDijkstra.steps.length - 1,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        const snapshot = history[nextIndex];
        const updatedEdges = snapshot.edges.map((e) => ({
          ...e,
          modifiedWeight: e.originalWeight + snapshot.k,
        }));
        const newDijkstra = computeLiveDijkstra(
          snapshot.vertices,
          updatedEdges,
          snapshot.sourceNode,
          snapshot.destNode,
          snapshot.k
        );
        set({
          vertices: snapshot.vertices,
          edges: updatedEdges,
          sourceNode: snapshot.sourceNode,
          destNode: snapshot.destNode,
          k: snapshot.k,
          historyIndex: nextIndex,
          liveDijkstraResult: newDijkstra,
          algorithmSteps: newDijkstra.steps,
          currentStepIndex: newDijkstra.steps.length - 1,
        });
      }
    },

    addVertex: (x, y, customLabel) => {
      const { vertices } = get();
      const existingLabels = new Set(vertices.map((v) => v.label));
      let label = customLabel || '';
      if (!label) {
        for (let i = 0; i < 26; i++) {
          const char = String.fromCharCode(65 + i);
          if (!existingLabels.has(char)) {
            label = char;
            break;
          }
        }
        if (!label) label = `V${vertices.length + 1}`;
      }

      const newVertex: Vertex = {
        id: label,
        label,
        x,
        y,
      };

      const newVertices = [...vertices, newVertex];
      const source = get().sourceNode || newVertex.id;
      const dest = get().destNode || newVertex.id;

      const newDijkstra = computeLiveDijkstra(newVertices, get().edges, source, dest, get().k);

      set({
        vertices: newVertices,
        sourceNode: source,
        destNode: dest,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
      });
      get().pushHistory();
    },

    deleteVertex: (id) => {
      const { vertices, edges, sourceNode, destNode, k } = get();
      const newVertices = vertices.filter((v) => v.id !== id);
      const newEdges = edges.filter((e) => e.source !== id && e.target !== id);

      let newSource = sourceNode === id ? (newVertices[0]?.id || '') : sourceNode;
      let newDest = destNode === id ? (newVertices[newVertices.length - 1]?.id || '') : destNode;

      const newDijkstra = computeLiveDijkstra(newVertices, newEdges, newSource, newDest, k);

      set({
        vertices: newVertices,
        edges: newEdges,
        sourceNode: newSource,
        destNode: newDest,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
      });
      get().pushHistory();
    },

    renameVertex: (id, newLabel) => {
      const { vertices, edges, sourceNode, destNode, k } = get();
      const updatedVertices = vertices.map((v) => (v.id === id ? { ...v, label: newLabel } : v));
      const newDijkstra = computeLiveDijkstra(updatedVertices, edges, sourceNode, destNode, k);
      set({
        vertices: updatedVertices,
        liveDijkstraResult: newDijkstra,
      });
      get().pushHistory();
    },

    moveVertex: (id, x, y) => {
      set({
        vertices: get().vertices.map((v) => (v.id === id ? { ...v, x, y } : v)),
      });
    },

    addEdge: (source, target, weight) => {
      const { edges, vertices, sourceNode, destNode, k } = get();
      if (source === target) return;

      const exists = edges.some(
        (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
      );
      if (exists) return;

      const newEdge: Edge = {
        id: `e-${source}-${target}-${Date.now()}`,
        source,
        target,
        originalWeight: weight,
        modifiedWeight: weight + k,
      };

      const newEdges = [...edges, newEdge];
      const newDijkstra = computeLiveDijkstra(vertices, newEdges, sourceNode, destNode, k);

      set({
        edges: newEdges,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        edgeStartNodeId: null,
      });
      get().pushHistory();
    },

    deleteEdge: (id) => {
      const { edges, vertices, sourceNode, destNode, k } = get();
      const newEdges = edges.filter((e) => e.id !== id);
      const newDijkstra = computeLiveDijkstra(vertices, newEdges, sourceNode, destNode, k);

      set({
        edges: newEdges,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
      });
      get().pushHistory();
    },

    updateEdgeWeight: (id, weight) => {
      const { edges, vertices, sourceNode, destNode, k } = get();
      const newEdges = edges.map((e) =>
        e.id === id
          ? {
              ...e,
              originalWeight: weight,
              modifiedWeight: weight + k,
            }
          : e
      );

      const newDijkstra = computeLiveDijkstra(vertices, newEdges, sourceNode, destNode, k);

      set({
        edges: newEdges,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        editingEdgeId: null,
      });
      get().pushHistory();
    },

    clearGraph: () => {
      set({
        vertices: [],
        edges: [],
        sourceNode: '',
        destNode: '',
        k: 0,
        liveDijkstraResult: {
          distances: {},
          previous: {},
          treeEdges: [],
          pathEdges: [],
          pathNodes: [],
          pathCost: 0,
          totalTreeCost: 0,
          steps: [],
        },
        algorithmSteps: [],
        currentStepIndex: 0,
      });
      get().pushHistory();
    },

    setSourceNode: (id) => {
      const { vertices, edges, destNode, k } = get();
      const newDijkstra = computeLiveDijkstra(vertices, edges, id, destNode, k);
      set({
        sourceNode: id,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: 0,
      });
    },

    setDestNode: (id) => {
      const { vertices, edges, sourceNode, k } = get();
      const newDijkstra = computeLiveDijkstra(vertices, edges, sourceNode, id, k);
      set({
        destNode: id,
        liveDijkstraResult: newDijkstra,
      });
    },

    setK: (newK) => {
      const validK = Math.max(0, Math.min(newK, 50));
      const { vertices, edges, sourceNode, destNode } = get();
      const updatedEdges = edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight + validK,
      }));

      const newDijkstra = computeLiveDijkstra(vertices, updatedEdges, sourceNode, destNode, validK);

      set({
        k: validK,
        edges: updatedEdges,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
      });
    },

    applyK: () => {
      get().pushHistory();
    },

    resetWeights: () => {
      get().setK(0);
      get().pushHistory();
    },

    startAlgorithm: () => {
      const { vertices, edges, sourceNode, destNode, k } = get();
      const fullDijkstra = computeLiveDijkstra(vertices, edges, sourceNode, destNode, k);
      set({
        isAlgorithmRunning: true,
        isAlgorithmPaused: false,
        currentStepIndex: 0,
        algorithmSteps: fullDijkstra.steps,
      });
    },

    pauseAlgorithm: () => {
      set({ isAlgorithmPaused: true });
    },

    resumeAlgorithm: () => {
      set({ isAlgorithmPaused: false });
    },

    stepForward: () => {
      const { currentStepIndex, algorithmSteps } = get();
      if (currentStepIndex < algorithmSteps.length - 1) {
        set({ currentStepIndex: currentStepIndex + 1 });
      } else {
        set({ isAlgorithmRunning: false, isAlgorithmPaused: false });
      }
    },

    stepBackward: () => {
      const { currentStepIndex } = get();
      if (currentStepIndex > 0) {
        set({ currentStepIndex: currentStepIndex - 1 });
      }
    },

    resetAlgorithm: () => {
      set({
        isAlgorithmRunning: false,
        isAlgorithmPaused: false,
        currentStepIndex: 0,
      });
    },

    setAlgorithmSpeed: (speed) => set({ algorithmSpeed: speed }),

    loadPreset: (presetId) => {
      const preset = PRESET_GRAPHS.find((p) => p.id === presetId) || PRESET_GRAPHS[0];
      const updatedEdges = preset.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight,
      }));
      const newDijkstra = computeLiveDijkstra(preset.vertices, updatedEdges, preset.source, preset.dest, 0);

      set({
        vertices: preset.vertices,
        edges: updatedEdges,
        sourceNode: preset.source,
        destNode: preset.dest,
        k: 0,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: newDijkstra.steps.length - 1,
        isAlgorithmRunning: false,
      });
      get().pushHistory();
    },

    generateCounterexample: () => {
      const preset = generateRandomCounterexample();
      const updatedEdges = preset.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight,
      }));
      const newDijkstra = computeLiveDijkstra(preset.vertices, updatedEdges, preset.source, preset.dest, 0);

      set({
        vertices: preset.vertices,
        edges: updatedEdges,
        sourceNode: preset.source,
        destNode: preset.dest,
        k: 0,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: newDijkstra.steps.length - 1,
        isAlgorithmRunning: false,
      });
      get().pushHistory();
    },

    generateRandom: (verticesCount = 5, density = 'medium') => {
      const result = generateRandomConnectedGraph(verticesCount, 1, 15, density);
      const updatedEdges = result.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight,
      }));
      const newDijkstra = computeLiveDijkstra(result.vertices, updatedEdges, result.source, result.dest, 0);

      set({
        vertices: result.vertices,
        edges: updatedEdges,
        sourceNode: result.source,
        destNode: result.dest,
        k: 0,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: newDijkstra.steps.length - 1,
        isAlgorithmRunning: false,
      });
      get().pushHistory();
    },

    setShowExplainModal: (show) => set({ showExplainModal: show }),
    setShowDemoMode: (show) => set({ showDemoMode: show }),
    setShowPresentationMode: (show) => set({ showPresentationMode: show }),
    setShowBeforeAfterModal: (show) => set({ showBeforeAfterModal: show }),

    addScoreAndXP: (scoreToAdd, xpToAdd) => {
      const stats = get().userStats;
      const newScore = stats.score + scoreToAdd;
      const newXP = stats.xp + xpToAdd;
      const badges = [...stats.badges];

      if (newXP >= 150 && !badges.includes('Dijkstra Master')) {
        badges.push('Dijkstra Master');
      }
      if (newXP >= 300 && !badges.includes('Counterexample Hunter')) {
        badges.push('Counterexample Hunter');
      }
      if (newXP >= 500 && !badges.includes('PathShift Expert')) {
        badges.push('PathShift Expert');
      }

      const updatedStats: UserStats = {
        ...stats,
        score: newScore,
        xp: newXP,
        badges,
      };

      localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
      set({ userStats: updatedStats });
    },

    completeChallenge: (challengeId, points) => {
      const stats = get().userStats;
      if (!stats.completedChallenges.includes(challengeId)) {
        const completedChallenges = [...stats.completedChallenges, challengeId];
        get().addScoreAndXP(points, points * 2);
        const updatedStats = { ...get().userStats, completedChallenges };
        localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
        set({ userStats: updatedStats });
      }
    },

    saveQuizScore: (score) => {
      const stats = get().userStats;
      const badges = [...stats.badges];
      if (score >= 80 && !badges.includes('Algorithm Scholar')) {
        badges.push('Algorithm Scholar');
      }
      const updatedStats: UserStats = {
        ...stats,
        quizCompleted: true,
        quizScore: score,
        score: stats.score + score * 5,
        xp: stats.xp + score * 3,
        badges,
      };
      localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
      set({ userStats: updatedStats });
    },

    saveCurrentExperiment: (name, notes) => {
      const { vertices, edges, sourceNode, destNode, k, liveDijkstraResult } = get();
      const origResult = computeLiveDijkstra(vertices, edges, sourceNode, destNode, 0);

      const newExp: SavedExperiment = {
        id: `exp-${Date.now()}`,
        name: name || `Experiment ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleString(),
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        source: sourceNode,
        destination: destNode,
        k,
        originalPath: origResult.pathNodes,
        modifiedPath: liveDijkstraResult.pathNodes,
        treeChanged: origResult.treeEdges.sort().join(',') !== liveDijkstraResult.treeEdges.sort().join(','),
        notes: notes || '',
      };

      const updated = [newExp, ...get().savedExperiments];
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      set({ savedExperiments: updated });
    },

    deleteSavedExperiment: (id) => {
      const updated = get().savedExperiments.filter((exp) => exp.id !== id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      set({ savedExperiments: updated });
    },

    loadSavedExperiment: (exp) => {
      const updatedEdges = exp.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight + exp.k,
      }));
      const newDijkstra = computeLiveDijkstra(exp.vertices, updatedEdges, exp.source, exp.destination, exp.k);

      set({
        vertices: exp.vertices,
        edges: updatedEdges,
        sourceNode: exp.source,
        destNode: exp.destination,
        k: exp.k,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: newDijkstra.steps.length - 1,
        activeTab: 'visualizer',
      });
      get().pushHistory();
    },

    importGraphData: (data) => {
      const updatedEdges = data.edges.map((e) => ({
        ...e,
        modifiedWeight: e.originalWeight + (data.k || 0),
      }));
      const newDijkstra = computeLiveDijkstra(
        data.vertices,
        updatedEdges,
        data.source,
        data.dest,
        data.k || 0
      );

      set({
        vertices: data.vertices,
        edges: updatedEdges,
        sourceNode: data.source,
        destNode: data.dest,
        k: data.k || 0,
        liveDijkstraResult: newDijkstra,
        algorithmSteps: newDijkstra.steps,
        currentStepIndex: newDijkstra.steps.length - 1,
      });
      get().pushHistory();
    },
  };
});

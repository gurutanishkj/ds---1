import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../store/graphStore';
import {
  Film,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface DemoStep {
  title: string;
  description: string;
  action: () => void;
  highlightNote: string;
}

export const DemoMode: React.FC = () => {
  const {
    showDemoMode,
    setShowDemoMode,
    loadPreset,
    setK,
    startAlgorithm,
    setActiveTab,
  } = useGraphStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      title: 'Step 1: Baseline Network Initialization',
      description: 'We initialize the classic triangle network with vertices A, B, C and initial weights: (A-B = 4), (B-C = 4), and (A-C = 10).',
      highlightNote: 'Vertices: A, B, C | Candidate Route 1 (2 hops): 4+4=8 | Candidate Route 2 (1 hop): 10',
      action: () => {
        loadPreset('classic-3-node');
        setK(0);
      },
    },
    {
      title: 'Step 2: Run Dijkstra Algorithm at k = 0',
      description: 'Dijkstra explores neighbors greedily from source vertex A. The 2-hop route A → B → C has cost 8, which is strictly less than 10.',
      highlightNote: 'dist[B] = 4, dist[C] = 8 (via B). Shortest path is A → B → C.',
      action: () => {
        setK(0);
        startAlgorithm();
      },
    },
    {
      title: 'Step 3: Confirm Original Shortest-Path Tree',
      description: 'At baseline k = 0, the shortest-path spanning tree selects edges (A-B) and (B-C). Edge (A-C) is rejected as suboptimal.',
      highlightNote: 'Original Path: A → B → C (Cost: 8). Tree Cost: 8.',
      action: () => {
        setK(0);
      },
    },
    {
      title: 'Step 4: Apply Uniform Weight Increase (k = +3)',
      description: 'We increase every edge weight by constant k = 3. Edge weights transform: A-B = 4+3=7, B-C = 4+3=7, A-C = 10+3=13.',
      highlightNote: 'Every edge receives +3. Notice both edges on the top route increase by 3 each (+6 total)!',
      action: () => {
        setK(3);
      },
    },
    {
      title: 'Step 5: Recompute Dijkstra Under Transformed Weights',
      description: 'We re-evaluate shortest paths on the transformed graph G\'. Let us inspect the two path candidates.',
      highlightNote: 'Route A → B → C cost: 7 + 7 = 14. Route A → C cost: 13.',
      action: () => {
        setK(3);
        startAlgorithm();
      },
    },
    {
      title: 'Step 6: Observe the Path & Tree Inversion',
      description: 'Comparing 14 vs 13: The direct edge A → C (cost 13) is now strictly cheaper than the 2-hop route A → B → C (cost 14)!',
      highlightNote: 'Shortest path shifted to A → C! The shortest-path spanning tree mutated.',
      action: () => {
        setK(3);
      },
    },
    {
      title: 'Step 7: The Mathematical Takeaway',
      description: 'Because W\'(P) = W(P) + mk, paths with more edges receive a larger additional penalty mk. Therefore, adding a constant does NOT preserve shortest paths!',
      highlightNote: 'Conclusion: W\'(P) = W(P) + |P|·k disproves the invariance hypothesis.',
      action: () => {
        setK(3);
      },
    },
  ];

  const currentStep = demoSteps[stepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: number | null = null;
    if (isPlaying) {
      if (stepIndex < demoSteps.length - 1) {
        timer = window.setTimeout(() => {
          const nextIdx = stepIndex + 1;
          setStepIndex(nextIdx);
          demoSteps[nextIdx].action();
        }, 3200);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, stepIndex, demoSteps]);

  // Execute action on open
  useEffect(() => {
    if (showDemoMode) {
      setActiveTab('visualizer');
      demoSteps[0].action();
      setStepIndex(0);
      setIsPlaying(false);
    }
  }, [showDemoMode]);

  if (!showDemoMode) return null;

  const handleNext = () => {
    if (stepIndex < demoSteps.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      demoSteps[nextIdx].action();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      setStepIndex(prevIdx);
      demoSteps[prevIdx].action();
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    demoSteps[0].action();
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 rounded-2xl border border-indigo-500/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl text-slate-100 space-y-4 ring-1 ring-indigo-500/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Guided Classroom Demo Tour
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono">
                  Step {stepIndex + 1} of {demoSteps.length}
                </span>
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowDemoMode(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Step Content */}
        <div className="space-y-2">
          <div className="font-bold text-base text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            {currentStep.title}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
            {currentStep.highlightNote}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                <Play className="w-3.5 h-3.5" /> Auto-Play
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={stepIndex === demoSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white ml-1"
              title="Restart Tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowDemoMode(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Finish Tour
          </button>
        </div>
      </div>
    </div>
  );
};

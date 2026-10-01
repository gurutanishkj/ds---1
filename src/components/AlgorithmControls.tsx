import React, { useEffect, useRef } from 'react';
import { useGraphStore, type SpeedType } from '../store/graphStore';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Info,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { getVertexLabel } from '../algorithms/dijkstra';

export const AlgorithmControls: React.FC = () => {
  const {
    isAlgorithmRunning,
    isAlgorithmPaused,
    algorithmSpeed,
    currentStepIndex,
    algorithmSteps,
    startAlgorithm,
    pauseAlgorithm,
    resumeAlgorithm,
    stepForward,
    stepBackward,
    resetAlgorithm,
    setAlgorithmSpeed,
    vertices,
    edges,
  } = useGraphStore();

  const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);
  const [showComplexity, setShowComplexity] = React.useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);

  const speedMs = {
    slow: 1200,
    medium: 600,
    fast: 200,
  }[algorithmSpeed];

  // Auto-play loop
  useEffect(() => {
    if (isAutoPlaying) {
      if (currentStepIndex >= algorithmSteps.length - 1) {
        setIsAutoPlaying(false);
        return;
      }

      autoPlayTimerRef.current = window.setTimeout(() => {
        stepForward();
      }, speedMs);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, currentStepIndex, algorithmSteps.length, speedMs, stepForward]);

  const handleStart = () => {
    startAlgorithm();
    setIsAutoPlaying(false);
  };

  const handlePlayAuto = () => {
    if (!isAlgorithmRunning) {
      startAlgorithm();
    } else if (isAlgorithmPaused) {
      resumeAlgorithm();
    }
    setIsAutoPlaying(true);
  };

  const handlePause = () => {
    setIsAutoPlaying(false);
    pauseAlgorithm();
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    resetAlgorithm();
  };

  const currentStep = algorithmSteps[currentStepIndex];
  const progressPercent = algorithmSteps.length > 1
    ? Math.round((currentStepIndex / (algorithmSteps.length - 1)) * 100)
    : 0;

  // Check for negative weights
  const hasNegativeWeight = edges.some((e) => e.modifiedWeight < 0 || e.originalWeight < 0);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-200">
      {/* Warnings & Alerts */}
      {hasNegativeWeight && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Warning:</strong> Negative edge weights detected! Dijkstra cannot be used safely with negative weights.
          </span>
        </div>
      )}

      {/* Control Buttons & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          {!isAlgorithmRunning || currentStepIndex === 0 ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> Start
            </button>
          ) : isAutoPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              onClick={handlePlayAuto}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> Resume
            </button>
          )}

          <button
            onClick={stepBackward}
            disabled={!isAlgorithmRunning || currentStepIndex === 0}
            title="Step Back"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-300 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (!isAlgorithmRunning) startAlgorithm();
              stepForward();
            }}
            disabled={currentStepIndex >= algorithmSteps.length - 1}
            title="Next Step"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-300 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayAuto}
            disabled={currentStepIndex >= algorithmSteps.length - 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" /> Play Auto
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset Dijkstra"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" /> Speed:
          </div>
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
            {(['slow', 'medium', 'fast'] as SpeedType[]).map((spd) => (
              <button
                key={spd}
                onClick={() => setAlgorithmSpeed(spd)}
                className={`px-2 py-0.5 rounded capitalize font-medium ${
                  algorithmSpeed === spd
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowComplexity(!showComplexity)}
            title="Algorithm Complexity"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Algorithm Complexity Accordion */}
      {showComplexity && (
        <div className="p-3 rounded-lg bg-slate-950/80 border border-indigo-500/30 text-xs space-y-2">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Dijkstra's Algorithm Complexity & Guarantees
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500">Time Complexity:</span>{' '}
              <code className="text-emerald-400 font-mono">O((V + E) log V)</code> (using min-heap)
            </div>
            <div>
              <span className="text-slate-500">Space Complexity:</span>{' '}
              <code className="text-cyan-400 font-mono">O(V + E)</code>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Dijkstra computes the Single-Source Shortest Path (SSSP) tree greedy. It requires non-negative edge weights
            (<code className="text-slate-300 font-mono">w(e) ≥ 0</code>) because once a vertex is marked visited, its distance is assumed final.
          </p>
        </div>
      )}

      {/* Progress Bar & Step Log */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            Step {currentStepIndex + 1} of {algorithmSteps.length || 1}
          </span>
          <span className="font-semibold text-indigo-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Execution Log Details */}
      {currentStep && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                currentStep.type === 'RELAX_EDGE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : currentStep.type === 'FINISH_VERTEX'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : currentStep.type === 'SELECT_VERTEX'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : currentStep.type === 'COMPLETE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {currentStep.type.replace('_', ' ')}
            </span>
            <span className="text-slate-200">{currentStep.logMessage}</span>
          </div>

          {currentStep.formulaDetail && (
            <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-semibold shrink-0">
              {currentStep.formulaDetail}
            </div>
          )}
        </div>
      )}

      {/* Visited & Unvisited badges */}
      {currentStep && (
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Visited ({currentStep.visitedVertices.length}):</span>
            <div className="flex items-center gap-1">
              {currentStep.visitedVertices.length > 0 ? (
                currentStep.visitedVertices.map((vId) => (
                  <span
                    key={vId}
                    className="px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 font-bold"
                  >
                    {getVertexLabel(vertices, vId)}
                  </span>
                ))
              ) : (
                <span className="text-slate-600 italic">None</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Unvisited ({currentStep.unvisitedVertices.length}):</span>
            <div className="flex items-center gap-1">
              {currentStep.unvisitedVertices.map((vId) => (
                <span
                  key={vId}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                >
                  {getVertexLabel(vertices, vId)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

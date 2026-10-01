import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { Sparkles, Film, GraduationCap, BookCheck, ArrowRight } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const { setActiveTab, setShowDemoMode } = useGraphStore();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 p-6 md:p-8 backdrop-blur-md shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Graph Algorithm Educational Platform
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          Explore how changing every edge weight can change the shortest path.
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Discover why adding a uniform constant <code className="text-amber-300 font-bold font-mono">k</code> to all edges does{' '}
          <strong className="text-white">NOT</strong> necessarily preserve the original shortest-path spanning tree.
          Visualize Dijkstra's algorithm step-by-step, inspect algebraic crossover thresholds, and master hop-penalty theory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('visualizer')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            Launch Visualizer <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTab('visualizer');
              setShowDemoMode(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <Film className="w-4 h-4 text-amber-400" /> Try Demo Tour
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" /> Learn the Concept
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <BookCheck className="w-4 h-4 text-emerald-400" /> Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

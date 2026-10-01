import React, { useState } from 'react';
import { useGraphStore } from '../store/graphStore';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const { showPresentationMode, setShowPresentationMode } = useGraphStore();
  const [slide, setSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!showPresentationMode) return null;

  const slides = [
    {
      title: 'Graph Algorithm Invariance Question',
      subtitle: 'Viva & Laboratory Presentation',
      content: (
        <div className="text-center space-y-8 max-w-4xl mx-auto py-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-mono text-sm uppercase tracking-widest">
            Core Algorithmic Research Question
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            “Does adding the same constant <span className="text-amber-400">k</span> to every edge weight preserve the shortest-path spanning tree?”
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive investigation into Dijkstra's algorithm, path edge cardinality, and non-uniform hop penalties.
          </p>
          <div className="pt-6 font-mono text-sm text-slate-500">
            PathShift Educational Demonstration System
          </div>
        </div>
      ),
    },
    {
      title: 'The Canonical Graph: G = (V, E)',
      subtitle: 'Baseline Weights at k = 0',
      content: (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          <div className="text-lg text-slate-300 text-center">
            Consider undirected graph with vertices <span className="font-mono font-bold text-white">V = &#123;A, B, C&#125;</span>:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-center">
              <div className="text-sm uppercase tracking-wider text-slate-400">Route 1 (2 Hops)</div>
              <div className="text-2xl font-bold text-cyan-300">A ──(4)── B ──(4)── C</div>
              <div className="text-3xl font-black text-white pt-2">W(P₁) = 4 + 4 = 8</div>
              <div className="text-xs text-slate-400">Hop Count |P₁| = 2 edges</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-center">
              <div className="text-sm uppercase tracking-wider text-slate-400">Route 2 (1 Hop)</div>
              <div className="text-2xl font-bold text-amber-300">A ────────(10)──────── C</div>
              <div className="text-3xl font-black text-white pt-2">W(P₂) = 10</div>
              <div className="text-xs text-slate-400">Hop Count |P₂| = 1 edge</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 text-center text-emerald-200 text-xl font-bold font-mono">
            Initial State: W(P₁) = 8 &lt; W(P₂) = 10 &rArr; Path (A &rarr; B &rarr; C) is strictly shortest!
          </div>
        </div>
      ),
    },
    {
      title: 'Applying Uniform Weight Increase',
      subtitle: 'Transforming Weights: w\'(e) = w(e) + k',
      content: (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          <div className="text-center text-lg text-slate-300">
            Let us increase every edge weight uniformly by constant <span className="font-mono font-bold text-amber-400 text-2xl">k = 3</span>:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-sm">Edge (A - B)</div>
              <div className="text-slate-500 text-sm">4 + 3</div>
              <div className="text-3xl font-black text-emerald-400">= 7</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-sm">Edge (B - C)</div>
              <div className="text-slate-500 text-sm">4 + 3</div>
              <div className="text-3xl font-black text-emerald-400">= 7</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-sm">Edge (A - C)</div>
              <div className="text-slate-500 text-sm">10 + 3</div>
              <div className="text-3xl font-black text-amber-400">= 13</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 text-center space-y-2">
            <div className="text-slate-400 text-xs uppercase tracking-wider">Crucial Observation:</div>
            <p className="text-xl text-white font-medium">
              The 2-hop route gained <span className="font-bold text-amber-400">+6 total</span> (+3 on edge 1, +3 on edge 2).
              <br />
              The 1-hop route gained only <span className="font-bold text-cyan-400">+3 total</span>!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Transformed Route Cost Comparison',
      subtitle: 'Evaluating W\'(P₁) vs W\'(P₂)',
      content: (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center font-mono">
            <div className="p-8 rounded-2xl bg-slate-950 border border-rose-500/50 space-y-3">
              <div className="text-slate-400 text-sm">Route 1 (A &rarr; B &rarr; C)</div>
              <div className="text-xl text-slate-300">W'(P₁) = 7 + 7</div>
              <div className="text-5xl font-black text-rose-400">= 14</div>
              <div className="text-xs text-rose-300 font-sans pt-2">No longer shortest!</div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-3">
              <div className="text-slate-400 text-sm">Route 2 (A &rarr; C)</div>
              <div className="text-xl text-slate-300">W'(P₂) = 10 + 3</div>
              <div className="text-5xl font-black text-emerald-400">= 13</div>
              <div className="text-xs text-emerald-300 font-sans pt-2">New Shortest Route!</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-center space-y-2">
            <div className="text-3xl font-black text-amber-300 font-mono">
              14 &gt; 13 &nbsp;&rArr;&nbsp; Inversion Occurred!
            </div>
            <p className="text-slate-300 text-sm">
              The shortest path transformed from <strong className="text-white">A &rarr; B &rarr; C</strong> to <strong className="text-white">A &rarr; C</strong>.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Formal Mathematical Theorem',
      subtitle: 'General Formulation for Any Path P',
      content: (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          <div className="p-8 rounded-2xl bg-slate-950 border border-indigo-500/40 text-center space-y-4">
            <div className="text-slate-400 text-sm uppercase tracking-widest">Universal Path Weight Theorem:</div>
            <div className="text-3xl md:text-5xl font-black text-white font-mono">
              W'(P) = W(P) + |P| &middot; k
            </div>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Where <code className="text-white font-mono">|P|</code> is the number of edges (hops) on path P.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-base">Case A: Equal Edge Counts (|P₁| = |P₂|)</div>
              <p className="text-slate-400">
                W'(P₁) - W'(P₂) = W(P₁) - W(P₂).
                <br />
                The difference is independent of k. Shortest path is <strong>strictly preserved</strong>.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-base">Case B: Unequal Edge Counts (|P₁| &gt; |P₂|)</div>
              <p className="text-slate-400">
                W'(P₁) - W'(P₂) = [W(P₁) - W(P₂)] + (|P₁| - |P₂|)k.
                <br />
                As k increases, path P₁ is penalized more. Shortest path <strong>inverts for k &gt; k*</strong>.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Definitive Conclusion',
      subtitle: 'Viva Voce Summary & Invariant Disproof',
      content: (
        <div className="text-center space-y-8 max-w-4xl mx-auto py-10">
          <div className="inline-block px-5 py-2 rounded-full bg-rose-950 border border-rose-600 text-rose-300 font-bold text-xl uppercase tracking-widest">
            Conclusion
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white">
              NO, not necessarily.
            </h2>
            <div className="text-2xl md:text-3xl font-mono text-cyan-300 font-bold">
              W'(P) = W(P) + k &times; |P|
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-2xl mx-auto text-left text-sm text-slate-300 space-y-3 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold font-mono">1.</span>
              <span>Adding a constant k to every edge favors paths with fewer hops over paths with more hops.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold font-mono">2.</span>
              <span>The shortest-path spanning tree (SPT) does NOT necessarily remain invariant under uniform edge weight translation.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold font-mono">3.</span>
              <span>In contrast, a Minimum Spanning Tree (MST) IS always preserved because every spanning tree has exactly |V|-1 edges!</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[slide];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Top Slide Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{currentSlide.title}</h2>
            <p className="text-xs text-slate-400 font-mono">{currentSlide.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            Slide {slide + 1} of {slides.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowPresentationMode(false)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Close Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Body */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        {currentSlide.content}
      </div>

      {/* Slide Navigation Footer */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={() => setSlide((prev) => Math.max(0, prev - 1))}
          disabled={slide === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Slide
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                slide === idx ? 'w-8 bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setSlide((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={slide === slides.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-semibold text-sm shadow-md transition-colors"
        >
          Next Slide <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

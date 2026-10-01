import React, { useState } from 'react';
import { useGraphStore } from '../store/graphStore';
import {
  GraduationCap,
  Network,
  Route,
  Zap,
  GitBranch,
  TrendingUp,
  AlertOctagon,
  Binary,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface LearnSection {
  id: string;
  number: number;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const Learn: React.FC = () => {
  const { loadPreset, setActiveTab } = useGraphStore();
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');

  // Interactive mini widget states
  const [demoK, setDemoK] = useState<number>(3);
  const [practiceAns, setPracticeAns] = useState<number | null>(null);

  const sections: LearnSection[] = [
    {
      id: 'sec-1',
      number: 1,
      title: 'Weighted Graphs G = (V, E)',
      icon: <Network className="w-4 h-4 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            A <strong>weighted undirected graph</strong> is formally defined as a pair{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-indigo-300">
              G = (V, E)
            </code>
            , where <strong className="text-white">V</strong> is a finite set of vertices (nodes) and{' '}
            <strong className="text-white">E</strong> is a set of unordered pairs of vertices representing edges.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">Weight Mapping Function:</div>
            <div className="font-mono text-indigo-300 text-sm">w: E &rarr; &Ropf;<sup>&ge; 0</sup></div>
            <p className="text-xs text-slate-400">
              Each edge <code className="text-slate-300 font-mono">e = (u, v) &isin; E</code> is assigned a non-negative scalar weight <code className="text-slate-300 font-mono">w(e)</code>, representing distance, latency, impedance, or transmission cost.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-2',
      number: 2,
      title: 'Shortest Path Problem',
      icon: <Route className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Given a source vertex <code className="font-mono text-white">s &isin; V</code> and destination vertex{' '}
            <code className="font-mono text-white">t &isin; V</code>, a simple path <code className="font-mono text-white">P</code> is an alternating sequence of vertices and edges connecting <code className="font-mono text-white">s</code> to <code className="font-mono text-white">t</code>.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-500 uppercase">Cost of Path P:</span>
            <div className="font-mono text-base font-bold text-emerald-400">
              W(P) = &sum;<sub>e &isin; P</sub> w(e)
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The shortest path <code className="text-white font-mono">P*</code> is a path whose total cost is minimal: <code className="text-emerald-300 font-mono">&delta;(s, t) = min&#123;W(P) : P is a path from s to t&#125;</code>.
          </p>
        </div>
      ),
    },
    {
      id: 'sec-3',
      number: 3,
      title: 'Dijkstra\'s SSSP Algorithm',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Edsger W. Dijkstra (1959) solved the Single-Source Shortest Path (SSSP) problem using a greedy strategy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Greedy Selection</span>
              <p className="text-slate-400">
                At each step, extract unvisited vertex <code className="text-white font-mono">u</code> with smallest tentative distance <code className="text-white font-mono">dist[u]</code>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">2. Edge Relaxation</span>
              <p className="text-slate-400">
                For every neighbor <code className="text-white font-mono">v</code>: if <code className="text-white font-mono">dist[u] + w(u, v) &lt; dist[v]</code>, update <code className="text-white font-mono">dist[v]</code> and <code className="text-white font-mono">prev[v] = u</code>.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-xs text-indigo-200">
            <strong>Complexity:</strong> With a binary min-heap, Dijkstra executes in <code className="font-mono text-white font-bold">O((V + E) log V)</code> time.
          </div>
        </div>
      ),
    },
    {
      id: 'sec-4',
      number: 4,
      title: 'Shortest-Path Spanning Tree (SPT)',
      icon: <GitBranch className="w-4 h-4 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            When Dijkstra settles every reachable vertex in <code className="text-white font-mono">V</code>, the set of predecessor edges{' '}
            <code className="text-cyan-300 font-mono">&#123;(prev[v], v) : v &isin; V \ &#123;s&#125;&#125;</code> forms a directed rooted tree: the{' '}
            <strong>Shortest-Path Spanning Tree (SPT)</strong>.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-300">SPT vs MST (Crucial Distinction):</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                <strong className="text-white">MST:</strong> Minimizes the sum of all edge weights across the entire tree.
              </li>
              <li>
                <strong className="text-white">SPT:</strong> Minimizes the distance from root <code className="text-cyan-300">s</code> to every individual vertex <code className="text-cyan-300">v</code>.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-5',
      number: 5,
      title: 'Uniform Edge Weight Increase',
      icon: <TrendingUp className="w-4 h-4 text-rose-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Consider transforming graph <code className="text-white font-mono">G</code> into <code className="text-white font-mono">G'</code> by adding a uniform non-negative scalar <code className="text-rose-400 font-mono">k &gt; 0</code> to every edge:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-sm text-white">
            w'(e) = w(e) + k, &nbsp;&forall; e &isin; E
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Does the shortest path between any two vertices remain unchanged? In high school mathematics, adding a constant to both sides of an inequality preserves the order. But graph paths do not have a uniform number of edges!
          </p>
        </div>
      ),
    },
    {
      id: 'sec-6',
      number: 6,
      title: 'Why the Tree Can Change',
      icon: <AlertOctagon className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            A path is a composite chain of edges. When you add <code className="text-amber-400 font-mono">+k</code> to every edge, a path with 2 edges receives <code className="text-amber-400 font-mono">+2k</code>, while a direct single edge receives only <code className="text-amber-400 font-mono">+1k</code>.
          </p>
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 space-y-1.5">
            <div className="font-bold text-sm">The "Hop-Count Penalty" Principle:</div>
            <p>
              Uniform addition acts as a hop tax. It penalizes longer paths (more hops) heavily, causing shorter-hop alternatives to become more attractive.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-7',
      number: 7,
      title: 'Mathematical Formulation',
      icon: <Binary className="w-4 h-4 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-sm text-white space-y-2">
            <div>W'(P) = &sum;<sub>e &isin; P</sub> (w(e) + k) = W(P) + |P| &middot; k</div>
          </div>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              For two competing paths <strong className="text-white">P<sub>1</sub></strong> (with <code className="text-cyan-300">m<sub>1</sub></code> edges) and <strong className="text-white">P<sub>2</sub></strong> (with <code className="text-amber-300">m<sub>2</sub></code> edges) where <code className="text-slate-300">m<sub>1</sub> &gt; m<sub>2</sub></code> and <code className="text-slate-300">W(P<sub>1</sub>) &lt; W(P<sub>2</sub>)</code>:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-indigo-300 text-xs">
              W'(P<sub>1</sub>) &gt; W'(P<sub>2</sub>) &nbsp;&hArr;&nbsp; k &gt; (W(P<sub>2</sub>) - W(P<sub>1</sub>)) / (m<sub>1</sub> - m<sub>2</sub>)
            </div>
            <p className="text-slate-400">
              The crossover threshold is exact and derived purely by elementary algebra!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-8',
      number: 8,
      title: 'Interactive Worked Example',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Triangle Graph A, B, C:</span>
              <button
                onClick={() => {
                  loadPreset('classic-3-node');
                  setActiveTab('visualizer');
                }}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
              >
                Load In Visualizer
              </button>
            </div>
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <div>A ──(4)── B ──(4)── C &nbsp; &rArr; &nbsp; Path A&rarr;B&rarr;C = 8 (2 edges)</div>
              <div>A ──────────(10)────────── C &nbsp; &rArr; &nbsp; Path A&rarr;C = 10 (1 edge)</div>
            </div>

            {/* Interactive Stepper */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Adjust k in this example:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">k = {demoK}</span>
              </div>
              <input
                type="range"
                min={0}
                max={6}
                value={demoK}
                onChange={(e) => setDemoK(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className={`p-2 rounded border ${8 + 2 * demoK <= 10 + demoK ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div>A &rarr; B &rarr; C (2 edges):</div>
                  <div className="font-bold text-sm">8 + 2({demoK}) = {8 + 2 * demoK}</div>
                </div>
                <div className={`p-2 rounded border ${10 + demoK < 8 + 2 * demoK ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div>A &rarr; C (1 edge):</div>
                  <div className="font-bold text-sm">10 + 1({demoK}) = {10 + demoK}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Notice at k = 2, they tie (12 vs 12). At k &ge; 3, direct path A&rarr;C becomes strictly cheaper!
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-9',
      number: 9,
      title: 'Counterexample Synthesis',
      icon: <RotateCcw className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            In algorithm design and formal verification, a single counterexample disproves an invariant.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Statement Disproved:</span>
            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-600/40 text-rose-200 italic">
              "False Claim: If every edge weight is increased by k &gt; 0, the shortest-path spanning tree remains identical."
            </div>
            <p className="text-slate-400">
              The 3-node triangle with weights (4, 4, 10) constitutes an ironclad counterexample proving the claim is false in general.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-10',
      number: 10,
      title: 'Practice Comprehension Check',
      icon: <GraduationCap className="w-4 h-4 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="leading-relaxed">
            Quick check: Path 1 has 3 edges (initial weight 9). Path 2 has 1 edge (initial weight 15). At what minimum integer <code className="font-mono text-white">k</code> will Path 2 become strictly shorter?
          </p>

          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((ans) => (
              <button
                key={ans}
                onClick={() => setPracticeAns(ans)}
                className={`py-2 rounded-lg border font-mono font-bold text-sm transition-all ${
                  practiceAns === ans
                    ? ans === 4
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-rose-600 border-rose-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                k = {ans}
              </button>
            ))}
          </div>

          {practiceAns !== null && (
            <div
              className={`p-3 rounded-lg border ${
                practiceAns === 4
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {practiceAns === 4 ? (
                <div>
                  <strong className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 inline" /> Correct!</strong>
                  15 + k &lt; 9 + 3k ⟹ 2k &gt; 6 ⟹ k &gt; 3. The minimum integer strictly greater than 3 is <strong>k = 4</strong>.
                </div>
              ) : (
                <div>
                  <strong>Not quite.</strong> At k = 3, both paths tie at 18. To become <em>strictly shorter</em>, k must be &gt; 3, so minimum integer is k = 4.
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white">Algorithms Learning Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            A comprehensive, rigorous curriculum exploring Shortest-Path Spanning Trees, Dijkstra's algorithm, and Weight Transformation Theory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1">
            Curriculum Sections (10 Topics)
          </div>
          {sections.map((s) => {
            const isActive = s.id === activeSectionId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSectionId(s.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-400 shadow'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-500 font-bold">{s.number}.</span>
                  {s.icon}
                  <span className="text-slate-200">{s.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Section Reading Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/50 flex items-center justify-center font-mono font-bold text-xs">
                {currentSection.number}
              </span>
              <h2 className="text-lg font-bold text-white">{currentSection.title}</h2>
            </div>

            <div className="text-sm text-slate-300">
              {currentSection.content}
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <button
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSectionId);
                if (idx > 0) setActiveSectionId(sections[idx - 1].id);
              }}
              disabled={activeSectionId === sections[0].id}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              Previous Topic
            </button>

            <span className="text-slate-500 font-mono">
              Topic {currentSection.number} of {sections.length}
            </span>

            <button
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSectionId);
                if (idx < sections.length - 1) setActiveSectionId(sections[idx + 1].id);
              }}
              disabled={activeSectionId === sections[sections.length - 1].id}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold"
            >
              Next Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

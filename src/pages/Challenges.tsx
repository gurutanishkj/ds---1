import React, { useState } from 'react';
import { useGraphStore } from '../store/graphStore';
import type { Challenge } from '../types/graph';
import { solveDijkstra, getVertexLabel } from '../algorithms/dijkstra';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  Award,
} from 'lucide-react';

const CHALLENGES_LIST: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Challenge 1: The Canonical Inversion',
    difficulty: 'Easy',
    description: 'Given triangle A-B-C with weights A-B=4, B-C=4, and A-C=10. Find the smallest positive integer k that forces the direct route A → C to become strictly shorter than A → B → C.',
    source: 'A',
    destination: 'C',
    initialK: 0,
    targetGoal: 'Make path A → C strictly shorter than A → B → C',
    hint: 'Original costs: A-B-C is 8 (2 hops), A-C is 10 (1 hop). The cost difference is 2. How many edges does each path have?',
    explanation: 'At k = 2, costs tie at 12. At k = 3, A-B-C costs 8 + 2(3) = 14, while A-C costs 10 + 1(3) = 13. Since 13 < 14, k = 3 is the smallest integer!',
    points: 100,
    initialVertices: [
      { id: 'A', label: 'A', x: 100, y: 200 },
      { id: 'B', label: 'B', x: 260, y: 80 },
      { id: 'C', label: 'C', x: 420, y: 200 },
    ],
    initialEdges: [
      { id: 'e1', source: 'A', target: 'B', originalWeight: 4, modifiedWeight: 4 },
      { id: 'e2', source: 'B', target: 'C', originalWeight: 4, modifiedWeight: 4 },
      { id: 'e3', source: 'A', target: 'C', originalWeight: 10, modifiedWeight: 10 },
    ],
    checkSolved: (currentK) => currentK >= 3,
  },
  {
    id: 'ch-2',
    title: 'Challenge 2: The Diamond Crossroads',
    difficulty: 'Medium',
    description: 'In this 4-node diamond, S→U→V→T requires 3 hops (initial cost 6), while direct route S→T has 1 hop (initial cost 11). Find the minimum integer k so that S → T strictly wins.',
    source: 'S',
    destination: 'T',
    initialK: 0,
    targetGoal: 'Make the 1-hop path S → T strictly shorter than the 3-hop path S → U → V → T',
    hint: 'Cost formula: 6 + 3k vs 11 + 1k. Solve the inequality 11 + k < 6 + 3k.',
    explanation: '11 + k < 6 + 3k ⟹ 2k > 5 ⟹ k > 2.5. The smallest integer is k = 3!',
    points: 150,
    initialVertices: [
      { id: 'S', label: 'S', x: 80, y: 200 },
      { id: 'U', label: 'U', x: 250, y: 80 },
      { id: 'V', label: 'V', x: 250, y: 320 },
      { id: 'T', label: 'T', x: 420, y: 200 },
    ],
    initialEdges: [
      { id: 'e1', source: 'S', target: 'U', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e2', source: 'U', target: 'V', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e3', source: 'V', target: 'T', originalWeight: 2, modifiedWeight: 2 },
      { id: 'e4', source: 'S', target: 'T', originalWeight: 11, modifiedWeight: 11 },
    ],
    checkSolved: (currentK) => currentK >= 3,
  },
  {
    id: 'ch-3',
    title: 'Challenge 3: The 4-Hop Marathon',
    difficulty: 'Medium',
    description: 'A long meandering route has 4 hops with total initial cost 12. A shorter 2-hop route has initial cost 20. Find the minimum integer k needed for the 2-hop path to overtake the 4-hop path.',
    source: 'A',
    destination: 'E',
    initialK: 0,
    targetGoal: 'Overtake the 4-hop route using the 2-hop route',
    hint: 'Path 1: 12 + 4k. Path 2: 20 + 2k. Set 20 + 2k < 12 + 4k.',
    explanation: '20 + 2k < 12 + 4k ⟹ 2k > 8 ⟹ k > 4. Thus the minimal integer is k = 5!',
    points: 200,
    initialVertices: [
      { id: 'A', label: 'A', x: 80, y: 200 },
      { id: 'B', label: 'B', x: 200, y: 80 },
      { id: 'C', label: 'C', x: 320, y: 80 },
      { id: 'D', label: 'D', x: 440, y: 80 },
      { id: 'E', label: 'E', x: 560, y: 200 },
      { id: 'M', label: 'M', x: 320, y: 320 },
    ],
    initialEdges: [
      { id: 'e1', source: 'A', target: 'B', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e2', source: 'B', target: 'C', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e3', source: 'C', target: 'D', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e4', source: 'D', target: 'E', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e5', source: 'A', target: 'M', originalWeight: 10, modifiedWeight: 10 },
      { id: 'e6', source: 'M', target: 'E', originalWeight: 10, modifiedWeight: 10 },
    ],
    checkSolved: (currentK) => currentK >= 5,
  },
  {
    id: 'ch-4',
    title: 'Challenge 4: Tree Mutation Stealth',
    difficulty: 'Hard',
    description: 'In this network, find a value of k where the entire shortest-path spanning tree changes at least one edge, altering the tree structure.',
    source: 'A',
    destination: 'D',
    initialK: 0,
    targetGoal: 'Mutate the shortest-path spanning tree structure',
    hint: 'Examine competing branch paths in the lower section of the graph.',
    explanation: 'Adding k penalizes the 2-hop branch more than the 1-hop alternative, reconfiguring the spanning tree topology!',
    points: 250,
    initialVertices: [
      { id: 'A', label: 'A', x: 80, y: 200 },
      { id: 'B', label: 'B', x: 240, y: 90 },
      { id: 'C', label: 'C', x: 240, y: 310 },
      { id: 'D', label: 'D', x: 440, y: 200 },
    ],
    initialEdges: [
      { id: 'e1', source: 'A', target: 'B', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e2', source: 'B', target: 'D', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e3', source: 'A', target: 'C', originalWeight: 5, modifiedWeight: 5 },
      { id: 'e4', source: 'C', target: 'D', originalWeight: 5, modifiedWeight: 5 },
      { id: 'e5', source: 'A', target: 'D', originalWeight: 10, modifiedWeight: 10 },
    ],
    checkSolved: (currentK) => currentK >= 4,
  },
  {
    id: 'ch-5',
    title: 'Challenge 5: The Grand Master Synthesis',
    difficulty: 'Hard',
    description: 'A multi-tier network where a 3-hop path initially costs 9, and a 1-hop direct line costs 17. Find the exact minimum integer k where the 1-hop path becomes strictly superior.',
    source: 'A',
    destination: 'D',
    initialK: 0,
    targetGoal: 'Make the 1-hop route strictly better than the 3-hop route',
    hint: 'Inequality: 17 + k < 9 + 3k. Subtract 9 and k from both sides.',
    explanation: '8 < 2k ⟹ k > 4. Thus the minimal integer k is 5!',
    points: 300,
    initialVertices: [
      { id: 'A', label: 'A', x: 80, y: 200 },
      { id: 'B', label: 'B', x: 220, y: 100 },
      { id: 'C', label: 'C', x: 360, y: 100 },
      { id: 'D', label: 'D', x: 500, y: 200 },
    ],
    initialEdges: [
      { id: 'e1', source: 'A', target: 'B', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e2', source: 'B', target: 'C', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e3', source: 'C', target: 'D', originalWeight: 3, modifiedWeight: 3 },
      { id: 'e4', source: 'A', target: 'D', originalWeight: 17, modifiedWeight: 17 },
    ],
    checkSolved: (currentK) => currentK >= 5,
  },
];

export const Challenges: React.FC = () => {
  const { userStats, completeChallenge } = useGraphStore();
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [challengeK, setChallengeK] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  const challenge = CHALLENGES_LIST[selectedChallengeIdx];
  const isAlreadyCompleted = userStats.completedChallenges.includes(challenge.id);

  // Compute live result for current challenge
  const originalResult = React.useMemo(() => {
    return solveDijkstra(
      challenge.initialVertices,
      challenge.initialEdges,
      challenge.source,
      challenge.destination,
      false
    );
  }, [challenge]);

  const currentResult = React.useMemo(() => {
    const updatedEdges = challenge.initialEdges.map((e) => ({
      ...e,
      modifiedWeight: e.originalWeight + challengeK,
    }));
    return solveDijkstra(
      challenge.initialVertices,
      updatedEdges,
      challenge.source,
      challenge.destination,
      challengeK > 0
    );
  }, [challenge, challengeK]);

  const origPathStr = originalResult.pathNodes
    .map((id) => getVertexLabel(challenge.initialVertices, id))
    .join(' → ');

  const currentPathStr = currentResult.pathNodes
    .map((id) => getVertexLabel(challenge.initialVertices, id))
    .join(' → ');

  const handleTestSolution = () => {
    const isSolved = challenge.checkSolved(challengeK, currentResult, originalResult);
    if (isSolved) {
      completeChallenge(challenge.id, challenge.points);
      setIsCompletedModalOpen(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      alert(`Not quite yet! At k = ${challengeK}, the target condition is not fully met. Keep increasing k or review the hint!`);
    }
  };

  const handleSelectChallenge = (idx: number) => {
    setSelectedChallengeIdx(idx);
    setChallengeK(0);
    setShowHint(false);
    setIsCompletedModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Title & XP Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black tracking-tight text-white">
              Interactive PathShift Challenges
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Solve each algorithmic puzzle by finding the critical weight constant k that forces a shortest path transition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-sm">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-slate-400">Total Score:</span>
            <span className="font-bold text-white text-base">{userStats.score}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-700 font-mono text-sm">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">XP:</span>
            <span className="font-bold text-indigo-300 text-base">{userStats.xp}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Challenge Selectors */}
        <div className="flex flex-col gap-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Available Challenges ({userStats.completedChallenges.length}/{CHALLENGES_LIST.length} Solved)
          </div>
          {CHALLENGES_LIST.map((c, idx) => {
            const isCompleted = userStats.completedChallenges.includes(c.id);
            const isSelected = selectedChallengeIdx === idx;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectChallenge(idx)}
                className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-400'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{c.title}</span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                        c.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : c.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                    <span>+{c.points} pts</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 mt-1" />
              </button>
            );
          })}
        </div>

        {/* Center & Right: Challenge Arena */}
        <div className="lg:col-span-2 flex flex-col gap-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
                {isAlreadyCompleted && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {challenge.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400">Reward:</span>
              <div className="font-mono font-bold text-amber-400 text-base">+{challenge.points} pts</div>
            </div>
          </div>

          {/* Goal Banner */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Target Objective:</strong> {challenge.targetGoal}
            </span>
          </div>

          {/* Graph Visual Blueprint */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Network Edges & Baseline Weights:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              {challenge.initialEdges.map((e) => {
                const u = getVertexLabel(challenge.initialVertices, e.source);
                const v = getVertexLabel(challenge.initialVertices, e.target);
                const modW = e.originalWeight + challengeK;
                return (
                  <div key={e.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{u} ─── {v}</span>
                    <span className="text-white font-bold">
                      {e.originalWeight} {challengeK > 0 ? `→ ${modW}` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive K Controller */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Adjust Weight Increase (k):
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChallengeK(Math.max(0, challengeK - 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  -
                </button>
                <span className="font-mono text-xl font-black text-indigo-400 w-8 text-center">
                  {challengeK}
                </span>
                <button
                  onClick={() => setChallengeK(challengeK + 1)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={15}
              value={challengeK}
              onChange={(e) => setChallengeK(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />

            {/* Live Paths Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Initial Path (k=0):</span>
                <div className="font-bold text-cyan-300">{origPathStr}</div>
                <div className="text-slate-400 text-[11px]">Cost: {originalResult.pathCost}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Current Path (k={challengeK}):</span>
                <div className={`font-bold ${origPathStr !== currentPathStr ? 'text-amber-400' : 'text-slate-200'}`}>
                  {currentPathStr}
                </div>
                <div className="text-slate-400 text-[11px]">Cost: {currentResult.pathCost}</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={() => setChallengeK(0)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <button
                onClick={handleTestSolution}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                Submit & Verify Solution
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200">
                <strong>💡 Hint:</strong> {challenge.hint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">🎉 Challenge Completed!</h3>
              <p className="text-xs text-slate-300">
                You successfully discovered the critical weight threshold!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Your Chosen k:</span>
                <span className="font-bold text-emerald-400">{challengeK}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Original Path:</span>
                <span className="text-slate-300">{origPathStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Shortest Path:</span>
                <span className="font-bold text-amber-300">{currentPathStr}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-sans">
                <span className="text-slate-400 font-medium">Points Awarded:</span>
                <span className="font-bold text-white">+{challenge.points} XP</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-left bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/40">
              <strong>Mathematical Takeaway:</strong> {challenge.explanation}
            </p>

            <button
              onClick={() => setIsCompletedModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Continue to Next Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

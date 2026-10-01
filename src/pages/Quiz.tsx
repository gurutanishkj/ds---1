import React, { useState } from 'react';
import { useGraphStore } from '../store/graphStore';
import type { QuizQuestion } from '../types/graph';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  BookCheck,
} from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'If every edge weight in an undirected weighted graph is increased by a positive constant k, does the original shortest-path spanning tree always remain unchanged?',
    options: [
      'A. Always remains the same',
      'B. Never remains the same',
      'C. Not necessarily; paths with more edges receive larger cumulative penalties',
      'D. Only remains the same if the graph is a Directed Acyclic Graph (DAG)',
    ],
    correctIndex: 2,
    explanation: 'For any path P with m edges, the new cost is W\'(P) = W(P) + mk. Paths with more edges gain more total weight than paths with fewer edges, which can invert their relative order.',
  },
  {
    id: 2,
    question: 'For a simple path P consisting of m edges and initial cost W(P), what is the transformed cost W\'(P) after increasing every edge weight by k?',
    options: [
      'A. W\'(P) = W(P) + k',
      'B. W\'(P) = W(P) + m · k',
      'C. W\'(P) = m · W(P) + k',
      'D. W\'(P) = W(P) + k^m',
    ],
    correctIndex: 1,
    explanation: 'Because every edge on the path receives +k, a path with m edges increases by exactly m · k: W\'(P) = ∑ (w(e) + k) = W(P) + mk.',
  },
  {
    id: 3,
    question: 'Suppose two competing paths P₁ and P₂ between the same endpoints have the exact same number of edges (|P₁| = |P₂|). What happens to their relative cost ranking after adding k to every edge?',
    options: [
      'A. Their relative order never changes for any k',
      'B. The path with higher initial cost becomes cheaper',
      'C. The path with lower initial cost becomes more expensive',
      'D. They always tie in cost',
    ],
    correctIndex: 0,
    explanation: 'When |P₁| = |P₂| = m, W\'(P₁) - W\'(P₂) = [W(P₁) + mk] - [W(P₂) + mk] = W(P₁) - W(P₂). The difference is completely independent of k, so relative ranking is strictly preserved.',
  },
  {
    id: 4,
    question: 'Path A has 2 edges and initial weight 8. Path B has 1 edge and initial weight 11. What is the crossover threshold k* where both paths have identical cost?',
    options: [
      'A. k* = 1.5',
      'B. k* = 2',
      'C. k* = 3',
      'D. k* = 4',
    ],
    correctIndex: 2,
    explanation: 'Set 8 + 2k = 11 + 1k ⟹ 2k - k = 11 - 8 ⟹ k* = 3. At k = 3, both paths cost 14.',
  },
  {
    id: 5,
    question: 'How does a Minimum Spanning Tree (MST) behave when a constant k is added to every edge weight, compared to a Shortest-Path Tree (SPT)?',
    options: [
      'A. Both MST and SPT are always preserved',
      'B. MST is always preserved (since every spanning tree has |V|-1 edges), but SPT is not necessarily preserved',
      'C. SPT is always preserved, but MST is not',
      'D. Neither MST nor SPT is ever preserved',
    ],
    correctIndex: 1,
    explanation: 'A classic computer science theorem: Every spanning tree of G contains exactly |V|-1 edges, so adding k adds exactly (|V|-1)k to all spanning trees equally, preserving MST. But SPT branches have varying hop counts, so SPT can mutate!',
  },
  {
    id: 6,
    question: 'What is the standard time complexity of Dijkstra\'s algorithm when implemented with a min-priority queue (binary heap)?',
    options: [
      'A. O(V²)',
      'B. O((V + E) log V)',
      'C. O(V · E)',
      'D. O(V³)',
    ],
    correctIndex: 1,
    explanation: 'Using a binary min-heap priority queue, extracting the minimum vertex takes O(V log V) and edge relaxations take O(E log V), giving O((V + E) log V).',
  },
  {
    id: 7,
    question: 'Why does standard Dijkstra\'s algorithm fail or become unreliable if edge weights are allowed to be negative?',
    options: [
      'A. It cannot compute additions with negative numbers',
      'B. It assumes once a vertex is marked visited (settled), its shortest path distance is permanently optimal',
      'C. The heap will crash on negative keys',
      'D. Dijkstra only works on trees, not graphs',
    ],
    correctIndex: 1,
    explanation: 'Dijkstra makes the greedy assumption that extracting the smallest tentative distance guarantees the optimal distance. Negative edges can provide a cheaper detour later, breaking the greedy invariant.',
  },
  {
    id: 8,
    question: 'In an unweighted graph (or where all edges have identical weight w = 1), which algorithm is both sufficient and faster than Dijkstra to find shortest paths?',
    options: [
      'A. Depth First Search (DFS)',
      'B. Breadth First Search (BFS)',
      'C. Bellman-Ford',
      'D. Floyd-Warshall',
    ],
    correctIndex: 1,
    explanation: 'Breadth First Search (BFS) explores vertices layer by layer in O(V + E) time, which directly finds shortest paths in unweighted graphs without heap overhead.',
  },
  {
    id: 9,
    question: 'If a student suggests solving the Shortest Path problem with negative edge weights by adding a large constant k to make all weights positive, why is this idea mathematically flawed?',
    options: [
      'A. It produces integer overflow',
      'B. Adding k penalizes paths with more edges disproportionately, altering which path is shortest',
      'C. Graph vertices cannot handle offset weights',
      'D. It works completely fine and is standard practice',
    ],
    correctIndex: 1,
    explanation: 'This is a famous trap! Because W\'(P) = W(P) + mk, adding k alters the shortest path by favoring paths with fewer edges over paths with more edges.',
  },
  {
    id: 10,
    question: 'What is the "edge relaxation" step in Dijkstra\'s algorithm?',
    options: [
      'A. Removing redundant edges from the graph',
      'B. Checking if routing through current vertex u offers a shorter path to neighbor v (dist[u] + w < dist[v])',
      'C. Increasing edge weights to normalize the graph',
      'D. Checking if the graph has cycles',
    ],
    correctIndex: 1,
    explanation: 'Relaxation tests whether going from source to v via u is cheaper than the currently known shortest distance to v. If so, dist[v] and prev[v] are updated.',
  },
];

export const Quiz: React.FC = () => {
  const { userStats, saveQuizScore } = useGraphStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = Math.round(((currentIdx) / totalQuestions) * 100);

  const handleSelectOption = (idx: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === question.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      const finalScore = Math.round(((correctCount + (selectedOption === question.correctIndex ? 1 : 0)) / totalQuestions) * 100);
      setQuizFinished(true);
      saveQuizScore(finalScore);
      if (finalScore >= 70) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const finalPercentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookCheck className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white">Algorithm & Weight Transformation Quiz</h1>
          </div>
          <p className="text-xs text-slate-400">
            Test your conceptual understanding of Dijkstra, shortest-path spanning trees, and uniform weight shifts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs">
            <span className="text-slate-400">Best Score:</span>{' '}
            <span className="font-bold text-amber-400 text-sm">{userStats.quizScore}%</span>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="flex flex-col gap-6 p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Question {currentIdx + 1} of {totalQuestions}</span>
              <span className="text-indigo-400 font-bold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Concept Evaluation
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (idx === question.correctIndex) {
                  optionStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
                } else {
                  optionStyle = 'opacity-40 border-slate-800';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-400 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left text-xs sm:text-sm transition-all ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && idx === question.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== question.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation panel after submission */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                selectedOption === question.correctIndex
                  ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-600/50 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {selectedOption === question.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" /> Incorrect!
                  </>
                )}
              </div>
              <p className="text-slate-300">{question.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Score: <span className="font-bold text-white">{correctCount}</span> / {currentIdx + (isAnswerSubmitted ? 1 : 0)}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                {currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
            <p className="text-sm text-slate-300">
              {finalPercentage >= 80
                ? 'Outstanding mastery of graph algorithm transformations and Dijkstra theory!'
                : finalPercentage >= 50
                ? 'Good effort! Review the learning notes and try again for full mastery.'
                : 'Keep practicing! Review the hop-penalty formula W\'(P) = W(P) + mk.'}
            </p>
          </div>

          <div className="flex justify-center gap-6 font-mono text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-w-[120px]">
              <div className="text-slate-500 text-xs">Score</div>
              <div className="text-2xl font-black text-amber-400">{finalPercentage}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-w-[120px]">
              <div className="text-slate-500 text-xs">Correct Answers</div>
              <div className="text-2xl font-black text-emerald-400">{correctCount} / {totalQuestions}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-w-[120px]">
              <div className="text-slate-500 text-xs">XP Earned</div>
              <div className="text-2xl font-black text-indigo-400">+{correctCount * 30}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useGraphStore } from '../store/graphStore';
import { findAllSimplePaths, formatPathLabels } from '../algorithms/shortestPath';
import { detectPathSwitch } from '../algorithms/pathAnalysis';
import { X, BookOpen, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

export const ExplanationModal: React.FC = () => {
  const {
    showExplainModal,
    setShowExplainModal,
    vertices,
    edges,
    sourceNode,
    destNode,
    k,
  } = useGraphStore();

  if (!showExplainModal) return null;

  const originalPaths = findAllSimplePaths(vertices, edges, sourceNode, destNode, 0);
  const currentPaths = findAllSimplePaths(vertices, edges, sourceNode, destNode, k);
  const switchDetection = detectPathSwitch(vertices, edges, sourceNode, destNode);

  const p1 = originalPaths[0]; // original shortest
  const pCurrent = currentPaths[0]; // current shortest

  const p1Label = p1 ? formatPathLabels(vertices, p1.nodes) : 'None';
  const pCurrentLabel = pCurrent ? formatPathLabels(vertices, pCurrent.nodes) : 'None';
  const p1CurrentCost = p1 ? p1.originalCost + p1.edgeCount * k : 0;

  const didChange = p1 && pCurrent && p1.nodes.join('-') !== pCurrent.nodes.join('-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Why Did the Shortest Path Change?
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical Analysis & Hop-Penalty Mechanism
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExplainModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Graph Breakdown */}
        {p1 && pCurrent ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Original Route Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Original Route (at k = 0)
                </div>
                <div className="font-bold text-sm text-cyan-300 font-mono">
                  {p1Label}
                </div>
                <div className="text-slate-300 space-y-1">
                  <div>Initial Cost: <span className="font-mono font-bold text-white">{p1.originalCost}</span></div>
                  <div>Number of Edges: <span className="font-mono font-bold text-white">{p1.edgeCount}</span> hops</div>
                  <div>Penalty Added: <span className="font-mono text-cyan-400">+{p1.edgeCount} × {k} = +{p1.edgeCount * k}</span></div>
                  <div className="pt-1 border-t border-slate-800 text-slate-200 font-bold">
                    Transformed Cost: <span className="font-mono text-white text-sm">{p1CurrentCost}</span>
                  </div>
                </div>
              </div>

              {/* Competing / Current Route Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${didChange ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  {didChange ? 'New Shortest Route (at k = ' + k + ')' : 'Current Route (Unchanged)'}
                </div>
                <div className="font-bold text-sm text-amber-300 font-mono">
                  {pCurrentLabel}
                </div>
                <div className="text-slate-300 space-y-1">
                  <div>Initial Cost: <span className="font-mono font-bold text-white">{pCurrent.originalCost}</span></div>
                  <div>Number of Edges: <span className="font-mono font-bold text-white">{pCurrent.edgeCount}</span> hops</div>
                  <div>Penalty Added: <span className="font-mono text-amber-400">+{pCurrent.edgeCount} × {k} = +{pCurrent.edgeCount * k}</span></div>
                  <div className="pt-1 border-t border-slate-800 text-slate-200 font-bold">
                    Transformed Cost: <span className="font-mono text-white text-sm">{pCurrent.modifiedCost}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Statement */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              didChange
                ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                : 'bg-indigo-950/30 border-indigo-600/40 text-indigo-200'
            }`}>
              {didChange ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {didChange
                    ? `Order Inversion: ${p1CurrentCost} > ${pCurrent.modifiedCost}`
                    : `No Inversion at k = ${k}: Current path remains minimal (${pCurrent.modifiedCost})`}
                </div>
                <p className="text-slate-300 text-xs">
                  {didChange
                    ? `Because [${p1Label}] contains ${p1.edgeCount} edges, its cost grew by ${p1.edgeCount * k}. In contrast, [${pCurrentLabel}] contains only ${pCurrent.edgeCount} edges, so it only grew by ${pCurrent.edgeCount * k}. Thus, the fewer-hop path became cheaper!`
                    : switchDetection.hasSwitch
                    ? `At k = ${k}, the additional edge penalty has not yet overcome the original cost difference. Increase k to ${switchDetection.thresholdK} to witness the switch!`
                    : `The initial path has the fewest edges, so increasing k can never make a longer alternative shorter.`}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Formal Mathematical Proof */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            General Mathematical Formulation
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-center text-sm text-white">
            W'(P) = &sum;<sub>e &isin; P</sub> (w(e) + k) = W(P) + |P| &middot; k
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              Let <strong className="text-white">P<sub>1</sub></strong> and <strong className="text-white">P<sub>2</sub></strong> be two competing paths between the same pair of vertices with edge counts <strong className="text-cyan-300">m<sub>1</sub></strong> and <strong className="text-amber-300">m<sub>2</sub></strong>:
            </p>
            <div className="pl-3 border-l-2 border-indigo-500/50 space-y-1 font-mono text-[11px] text-slate-400">
              <div>W'(P<sub>1</sub>) - W'(P<sub>2</sub>) = [W(P<sub>1</sub>) - W(P<sub>2</sub>)] + (m<sub>1</sub> - m<sub>2</sub>) &middot; k</div>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong className="text-white">Case 1 (Equal Hops, m<sub>1</sub> = m<sub>2</sub>):</strong> The difference remains constant <code className="text-indigo-300">W(P<sub>1</sub>) - W(P<sub>2</sub>)</code> for all <code className="text-indigo-300">k</code>. The shortest path <strong>never changes</strong>.
              </li>
              <li>
                <strong className="text-white">Case 2 (Different Hops, m<sub>1</sub> &gt; m<sub>2</sub>):</strong> Although <code className="text-indigo-300">W(P<sub>1</sub>) &lt; W(P<sub>2</sub>)</code> initially, each unit of <code className="text-indigo-300">k</code> penalizes <strong className="text-white">P<sub>1</sub></strong> by <code className="text-indigo-300">(m<sub>1</sub> - m<sub>2</sub>)</code> more than <strong className="text-white">P<sub>2</sub></strong>.
              </li>
            </ul>
            <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200">
              <strong>Break-even Crossover Condition:</strong><br />
              At <code className="text-white font-bold">k* = (W(P<sub>2</sub>) - W(P<sub>1</sub>)) / (m<sub>1</sub> - m<sub>2</sub>)</code>, both paths tie. For any <code className="text-white font-bold">k &gt; k*</code>, the path with fewer edges strictly wins.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            PathShift Algorithm Learning Engine
          </span>
          <button
            onClick={() => setShowExplainModal(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

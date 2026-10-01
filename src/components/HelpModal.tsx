import React from 'react';
import { X, HelpCircle, MousePointer, PlusCircle, GitCommit, Edit3, Trash2, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">PathShift Quick Guide & Shortcuts</h2>
              <p className="text-xs text-slate-400">Master interactive shortest-path weight transformation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts & Tools */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-slate-300 uppercase tracking-wider">Canvas Tools & Shortcuts</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300"><MousePointer className="w-3.5 h-3.5 text-indigo-400" /> Select / Move</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">S</kbd>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300"><PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Add Vertex</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">V</kbd>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300"><GitCommit className="w-3.5 h-3.5 text-cyan-400" /> Add Edge</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">E</kbd>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300"><Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Weight</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">W</kbd>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300"><Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete Element</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">D</kbd>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">Undo / Redo</span>
              <span className="text-slate-400">Ctrl+Z / Ctrl+Y</span>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Recommended Learning Flow:
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 leading-relaxed">
            <li><strong>Select or Build a Graph:</strong> Use preset networks or build nodes and edges from scratch.</li>
            <li><strong>Pick Source & Destination:</strong> Choose endpoints to evaluate the shortest path.</li>
            <li><strong>Run Dijkstra:</strong> Step through neighbor inspection, tentative distances, and edge relaxation.</li>
            <li><strong>Slide Weight Increase (k):</strong> Watch modified weights update dynamically: <code className="text-indigo-300 font-mono">w'(e) = w(e) + k</code>.</li>
            <li><strong>Examine Crossover:</strong> Click <em>Explain Change</em> to inspect the exact algebraic crossover threshold where the fewer-hop path beats the multi-hop path.</li>
            <li><strong>Take Challenges & Quiz:</strong> Earn badges and test your understanding for your laboratory viva!</li>
          </ol>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
};

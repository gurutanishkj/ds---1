import React, { useEffect } from 'react';
import { useGraphStore } from './store/graphStore';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Learn } from './pages/Learn';
import { Challenges } from './pages/Challenges';
import { Quiz } from './pages/Quiz';
import { Experiments } from './pages/Experiments';
import { SavedGraphs } from './pages/SavedGraphs';
import { DemoMode } from './components/DemoMode';
import { PresentationMode } from './components/PresentationMode';
import { ReactFlowProvider } from '@xyflow/react';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  const { activeTab, theme, setTheme } = useGraphStore();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-[#080c14] text-slate-100' : 'light bg-slate-50 text-slate-800'}`}>
          {/* Top Navbar */}
          <Navbar />

          {/* Main Content Area Based on Active Tab */}
          <main className="flex-1 pb-16">
            {activeTab === 'visualizer' && <Dashboard />}
            {activeTab === 'learn' && <Learn />}
            {activeTab === 'challenges' && <Challenges />}
            {activeTab === 'quiz' && <Quiz />}
            {activeTab === 'experiments' && <Experiments />}
            {activeTab === 'saved' && <SavedGraphs />}
          </main>

          {/* Global Modals for Demo & Presentation Mode */}
          <DemoMode />
          <PresentationMode />

          {/* Modern Academic Lab Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 px-4 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wider">PATHSHIFT</span>
                <span className="text-slate-600">|</span>
                <span>Interactive Shortest Path &amp; Weight Transformation Visualizer</span>
              </div>

              <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                <span>Algorithm Theory: Dijkstra SSSP</span>
                <span>•</span>
                <span>W'(P) = W(P) + |P|·k</span>
                <span>•</span>
                <span>CS Algorithms Viva Platform</span>
              </div>
            </div>
          </footer>
        </div>
      </ReactFlowProvider>
    </ErrorBoundary>
  );
};

export default App;

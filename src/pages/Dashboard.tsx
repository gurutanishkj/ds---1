import React, { useEffect } from 'react';
import { useGraphStore } from '../store/graphStore';
import { GraphCanvas } from '../components/GraphCanvas';
import { GraphToolbar } from '../components/GraphToolbar';
import { AlgorithmControls } from '../components/AlgorithmControls';
import { DistanceTable } from '../components/DistanceTable';
import { KSlider } from '../components/KSlider';
import { PathComparison } from '../components/PathComparison';
import { ChartPanel } from '../components/ChartPanel';
import { ExplanationModal } from '../components/ExplanationModal';
import { BeforeAfterView } from '../components/BeforeAfterView';
import { DemoMode } from '../components/DemoMode';
import { PresentationMode } from '../components/PresentationMode';
import { LandingHeader } from '../components/LandingHeader';

export const Dashboard: React.FC = () => {
  const {
    setActiveTool,
    undo,
    redo,
    isAlgorithmRunning,
    startAlgorithm,
    pauseAlgorithm,
    resumeAlgorithm,
    isAlgorithmPaused,
  } = useGraphStore();

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          setActiveTool('select');
          break;
        case 'v':
          setActiveTool('add-vertex');
          break;
        case 'e':
          setActiveTool('add-edge');
          break;
        case 'w':
          setActiveTool('edit-weight');
          break;
        case 'd':
          setActiveTool('delete');
          break;
        case ' ':
          e.preventDefault();
          if (!isAlgorithmRunning) {
            startAlgorithm();
          } else if (isAlgorithmPaused) {
            resumeAlgorithm();
          } else {
            pauseAlgorithm();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setActiveTool,
    undo,
    redo,
    isAlgorithmRunning,
    startAlgorithm,
    pauseAlgorithm,
    resumeAlgorithm,
    isAlgorithmPaused,
  ]);

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Landing Banner */}
      <LandingHeader />

      {/* Main 3-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Graph Tools (Width: 3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <GraphToolbar />
        </div>

        {/* Center Column: Interactive React Flow Canvas & Bottom Controls (Width: 5 or 6 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* React Flow Graph Canvas */}
          <div className="w-full h-[520px]">
            <GraphCanvas />
          </div>

          {/* Bottom Algorithm Controls */}
          <AlgorithmControls />
        </div>

        {/* Right Column: Analysis, Transformation & Comparison (Width: 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5">
          {/* K Slider Transformation */}
          <KSlider />

          {/* Path Comparison & Switch Detector */}
          <PathComparison />

          {/* Live Distance Table */}
          <DistanceTable />

          {/* K vs Shortest Path Chart */}
          <ChartPanel />
        </div>
      </div>

      {/* Modals & Overlays */}
      <ExplanationModal />
      <BeforeAfterView />
      <DemoMode />
      <PresentationMode />
    </div>
  );
};

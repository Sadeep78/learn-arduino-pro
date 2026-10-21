import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  RotateCcw,
  Terminal,
  Code2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  GripVertical,
  LayoutGrid,
  Columns,
  Layers,
  ShieldAlert,
  Play,
  Square
} from 'lucide-react';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';
import { ComponentPalette } from '../components/canvas/ComponentPalette';
import { CircuitCheckPanel } from '../components/canvas/CircuitCheckPanel';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SerialMonitor } from '../components/editor/SerialMonitor';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';
import { LESSONS } from '../data/lessons';

export type SimulatorLayoutMode = 'circuit' | 'split' | 'code';

export const SimulatorView: React.FC = () => {
  const { activeLessonId, setActiveLessonId } = useUIStore();
  const {
    circuit,
    activeCode,
    loadCircuit,
    isRunning,
    startSimulation,
    stopSimulation,
    checklist,
    isShortCircuit
  } = useSimulatorStore();

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  // View layout mode: 'circuit' (canvas-only), 'split' (canvas + code), or 'code' (code-only)
  const [layoutMode, setLayoutMode] = useState<SimulatorLayoutMode>('split');

  // Resizable split layout state (percentage of width for canvas studio)
  const [canvasWidthPercent, setCanvasWidthPercent] = useState<number>(55);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Drawer states
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(true);
  const [isCheckPanelOpen, setIsCheckPanelOpen] = useState<boolean>(true);
  const [isSerialMonitorOpen, setIsSerialMonitorOpen] = useState<boolean>(true);

  // Lesson change confirmation dialog
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  // Synchronize on mount if simulator circuit doesn't match active lesson
  useEffect(() => {
    if (circuit.components.length === 0) {
      loadCircuit(activeLesson.initialCircuit, activeLesson.codeSnippet);
    }
  }, []);

  // Handle drag resizing between canvas and code columns in split mode
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newPercent = ((e.clientX - rect.left) / rect.width) * 100;
      // Clamp between 30% and 70%
      setCanvasWidthPercent(Math.min(70, Math.max(30, Math.round(newPercent))));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Check if current canvas has unsaved changes compared to starter circuit
  const isCircuitModified = () => {
    if (!activeLesson) return false;
    const starter = activeLesson.initialCircuit;
    if (circuit.components.length !== starter.components.length) return true;
    if (circuit.wires.length !== starter.wires.length) return true;
    if (activeCode.trim() !== activeLesson.codeSnippet.trim()) return true;
    return false;
  };

  const handleSelectLesson = (lessonId: string) => {
    if (lessonId === activeLessonId) return;

    if (isCircuitModified()) {
      setPendingLessonId(lessonId);
      setShowConfirmReset(true);
    } else {
      executeLessonSwitch(lessonId);
    }
  };

  const executeLessonSwitch = (lessonId: string) => {
    const target = LESSONS.find((l) => l.id === lessonId);
    if (!target) return;
    setActiveLessonId(target.id);
    loadCircuit(target.initialCircuit, target.codeSnippet);
    setShowConfirmReset(false);
    setPendingLessonId(null);
  };

  const handleResetToStarter = () => {
    if (isCircuitModified()) {
      setShowConfirmReset(true);
    } else {
      loadCircuit(activeLesson.initialCircuit, activeLesson.codeSnippet);
    }
  };

  // Checklist statistics for header pill
  const totalChecks = checklist.length;
  const passCount = checklist.filter((item) => item.status === 'pass').length;
  const failCount = checklist.filter((item) => item.status === 'fail').length;
  const isAllPassed = totalChecks > 0 && failCount === 0 && !isShortCircuit;

  return (
    <div className="space-y-2.5 select-none w-full">
      {/* Top Controls Bar: Curriculum, View Mode Tabs, Drawers Toggles & Global Simulation Run */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5">
        {/* Left: Lesson Selector & Reset */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blueprint-teal/10 text-blueprint-teal text-xs font-mono font-bold flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CURRICULUM</span>
          </div>

          <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
            <select
              value={activeLessonId}
              onChange={(e) => handleSelectLesson(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-blueprint-creamDark/70 dark:bg-blueprint-nightBg/70 border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-100 focus:outline-none focus:border-blueprint-teal cursor-pointer"
            >
              {LESSONS.map((l) => (
                <option key={l.id} value={l.id}>
                  Lesson #{String(l.number).padStart(2, '0')}: {l.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={handleResetToStarter}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition flex-shrink-0"
            title="Reset circuit and sketch to lesson initial starter state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blueprint-teal" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Center: View Mode Switcher Tabs */}
        <div className="flex items-center justify-center p-1 rounded-xl bg-blueprint-creamDark/80 dark:bg-blueprint-nightBg/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder self-center flex-shrink-0">
          <button
            onClick={() => setLayoutMode('circuit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              layoutMode === 'circuit'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Full Circuit Canvas View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Circuit</span>
          </button>

          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              layoutMode === 'split'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Split Studio (Canvas + Code)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>

          <button
            onClick={() => setLayoutMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              layoutMode === 'code'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Code Editor & Telemetry View"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Right: Drawer Toggles & Run Simulation */}
        <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0">
          {layoutMode !== 'code' && (
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                isPaletteOpen
                  ? 'bg-blueprint-teal text-white border-blueprint-teal'
                  : 'bg-blueprint-creamDark dark:bg-blueprint-nightBg border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal'
              }`}
              title="Toggle Component Palette"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Components</span>
            </button>
          )}

          {layoutMode !== 'code' && (
            <button
              onClick={() => setIsCheckPanelOpen(!isCheckPanelOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                isCheckPanelOpen ? 'ring-2 ring-blueprint-teal' : ''
              } ${
                isShortCircuit
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : isAllPassed
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
              }`}
              title="Toggle Circuit Check Panel"
            >
              {isShortCircuit ? (
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
              ) : isAllPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Circuit Check ({passCount}/{totalChecks})</span>
            </button>
          )}

          {/* Primary Simulation Run/Stop Button */}
          {isRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono font-bold text-xs shadow-md transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={() => startSimulation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-mono font-bold text-xs shadow-md shadow-blueprint-teal/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SIMULATION</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div
        ref={splitContainerRef}
        className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/80 dark:bg-blueprint-nightCard/80 backdrop-blur-md min-h-[640px] relative"
      >
        {/* Canvas Studio Container (Rendered when in 'circuit' or 'split' mode) */}
        {layoutMode !== 'code' && (
          <div
            style={{ width: layoutMode === 'split' ? `${canvasWidthPercent}%` : '100%' }}
            className={`flex flex-col min-w-0 max-lg:!w-full relative h-[640px] ${
              layoutMode === 'split' ? 'border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder' : ''
            }`}
          >
            {/* Component Palette Slide-over Drawer (Left) */}
            {isPaletteOpen && (
              <div className="absolute top-0 left-0 bottom-0 z-30 flex animate-in slide-in-from-left-2 duration-200 shadow-2xl">
                <ComponentPalette
                  isOpen={isPaletteOpen}
                  onClose={() => setIsPaletteOpen(false)}
                />
              </div>
            )}

            {/* Main Canvas Workspace: Full width and height of container */}
            <div className="flex-1 w-full h-full relative">
              <CircuitCanvas />
            </div>

            {/* Circuit Check Slide-over Drawer (Right) */}
            {isCheckPanelOpen && (
              <div className="absolute top-0 right-0 bottom-0 z-30 w-80 sm:w-96 flex animate-in slide-in-from-right-2 duration-200 shadow-2xl">
                <CircuitCheckPanel
                  isDocked={false}
                  onClose={() => setIsCheckPanelOpen(false)}
                  className="h-full rounded-l-2xl border-l shadow-2xl"
                />
              </div>
            )}
          </div>
        )}

        {/* Draggable Vertical Resizer Bar (Visible only in Split mode on desktop) */}
        {layoutMode === 'split' && (
          <div
            onMouseDown={() => setIsResizing(true)}
            className={`hidden lg:flex w-2 items-center justify-center bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 hover:bg-blueprint-teal/40 cursor-col-resize transition-colors select-none flex-shrink-0 ${
              isResizing ? 'bg-blueprint-teal text-white' : 'text-gray-400'
            }`}
            title="Drag to resize Canvas and Code columns"
          >
            <GripVertical className="w-3 h-3 opacity-60" />
          </div>
        )}

        {/* Code & Telemetry Studio (Rendered when in 'split' or 'code' mode) */}
        {layoutMode !== 'circuit' && (
          <div
            style={{ width: layoutMode === 'split' ? `${100 - canvasWidthPercent}%` : '100%' }}
            className="flex flex-col min-w-0 max-lg:!w-full h-[640px] bg-[#1E1E1E]"
          >
            {/* Top: Code Editor */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
              <CodeEditor />
            </div>

            {/* Bottom: Collapsible Serial Monitor Panel */}
            <div className="border-t border-[#333333] flex flex-col flex-shrink-0 bg-[#1E1E1E]">
              {/* Header Toggle */}
              <div
                onClick={() => setIsSerialMonitorOpen(!isSerialMonitorOpen)}
                className="h-9 px-3 bg-[#252526] hover:bg-[#2A2D2E] cursor-pointer flex items-center justify-between border-b border-[#333333] transition"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blueprint-teal" />
                  <span className="font-mono text-xs font-bold text-gray-200">
                    Serial Monitor & Telemetry
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
                </div>

                <button
                  className="text-gray-400 hover:text-gray-200 p-0.5"
                  title={isSerialMonitorOpen ? 'Collapse Serial Monitor' : 'Expand Serial Monitor'}
                >
                  {isSerialMonitorOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Serial Monitor Body */}
              {isSerialMonitorOpen && (
                <div className="h-44 sm:h-52 overflow-hidden">
                  <SerialMonitor />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal when switching lessons or resetting modified circuit */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-blueprint-navy dark:text-white">
                  Reset Canvas Circuit?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Your current wires or code modifications will be replaced with the starter circuit.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 text-xs font-mono text-gray-600 dark:text-gray-300">
              Target: <strong>{pendingLessonId ? LESSONS.find(l => l.id === pendingLessonId)?.title : activeLesson.title}</strong>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  setPendingLessonId(null);
                }}
                className="px-4 py-2 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                Keep Current
              </button>

              <button
                onClick={() => {
                  if (pendingLessonId) {
                    executeLessonSwitch(pendingLessonId);
                  } else {
                    loadCircuit(activeLesson.initialCircuit, activeLesson.codeSnippet);
                    setShowConfirmReset(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
              >
                Reset & Load Starter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

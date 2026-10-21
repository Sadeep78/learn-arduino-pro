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
  GripVertical
} from 'lucide-react';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';
import { ComponentPalette } from '../components/canvas/ComponentPalette';
import { CircuitCheckPanel } from '../components/canvas/CircuitCheckPanel';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SerialMonitor } from '../components/editor/SerialMonitor';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';
import { LESSONS } from '../data/lessons';

export const SimulatorView: React.FC = () => {
  const { activeLessonId, setActiveLessonId } = useUIStore();
  const { circuit, activeCode, loadCircuit } = useSimulatorStore();

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  // Resizable split layout state (percentage of width for canvas studio)
  const [canvasWidthPercent, setCanvasWidthPercent] = useState<number>(60);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Collapsible panels
  const [isCheckPanelCollapsed, setIsCheckPanelCollapsed] = useState<boolean>(false);
  const [isSerialMonitorOpen, setIsSerialMonitorOpen] = useState<boolean>(true);

  // Lesson change confirmation dialog
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  // Synchronize on mount if simulator circuit doesn't match active lesson
  useEffect(() => {
    // If on initial load circuit is empty or mismatched, load current lesson starter
    if (circuit.components.length === 0) {
      loadCircuit(activeLesson.initialCircuit, activeLesson.codeSnippet);
    }
  }, []);

  // Handle drag resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newPercent = ((e.clientX - rect.left) / rect.width) * 100;
      // Clamp between 35% and 75%
      setCanvasWidthPercent(Math.min(75, Math.max(35, Math.round(newPercent))));
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

  return (
    <div className="space-y-3 select-none">
      {/* Top Controls: Lesson Selector Bar */}
      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-blueprint-nightCard/90 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Lesson Selector & Dropdown */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blueprint-teal/10 text-blueprint-teal text-xs font-mono font-bold">
            <BookOpen className="w-4 h-4" />
            <span>CURRICULUM</span>
          </div>

          <div className="relative flex-1 sm:max-w-md min-w-[240px]">
            <select
              value={activeLessonId}
              onChange={(e) => handleSelectLesson(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-blueprint-creamDark/70 dark:bg-blueprint-nightBg/70 border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-100 focus:outline-none focus:border-blueprint-teal cursor-pointer"
            >
              {LESSONS.map((l) => (
                <option key={l.id} value={l.id}>
                  Lesson #{String(l.number).padStart(2, '0')}: {l.title} ({l.categoryLabel})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
            <span>+{activeLesson.xpReward} XP</span>
            <span>·</span>
            <span className="capitalize">{activeLesson.difficulty}</span>
          </div>
        </div>

        {/* Right: Reset Starter Circuit Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleResetToStarter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition"
            title="Reset circuit and sketch to lesson initial starter state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blueprint-teal" />
            <span>Reset to Starter</span>
          </button>
        </div>
      </div>

      {/* Main Resizable Split Studio: Canvas Studio | Code & Serial Studio */}
      <div
        ref={splitContainerRef}
        className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/70 dark:bg-blueprint-nightCard/70 backdrop-blur-md min-h-[640px]"
      >
        {/* Left Side: Canvas Studio (Palette + Canvas Workspace + Docked Circuit Check) */}
        <div
          style={{ width: `${canvasWidthPercent}%` }}
          className="flex flex-col min-w-0 max-lg:!w-full border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder"
        >
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
            {/* Palette */}
            <ComponentPalette />

            {/* Canvas Workspace: Takes remaining width dynamically */}
            <div className="flex-1 min-w-0 relative">
              <CircuitCanvas />
            </div>

            {/* Docked Right Panel: Circuit Check (Desktop >= 1024px) */}
            <div className="hidden lg:flex flex-shrink-0">
              <CircuitCheckPanel
                isDocked={true}
                isCollapsed={isCheckPanelCollapsed}
                onToggleCollapse={() => setIsCheckPanelCollapsed(!isCheckPanelCollapsed)}
              />
            </div>
          </div>

          {/* Bottom Drawer on screens < 1024px */}
          <div className="lg:hidden border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder">
            <CircuitCheckPanel isDocked={false} />
          </div>
        </div>

        {/* Draggable Vertical Resizer Bar (Desktop only) */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`hidden lg:flex w-2.5 items-center justify-center bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 hover:bg-blueprint-teal/40 cursor-col-resize transition-colors select-none flex-shrink-0 ${
            isResizing ? 'bg-blueprint-teal text-white' : 'text-gray-400'
          }`}
          title="Drag to resize Canvas and Code Editor columns"
        >
          <GripVertical className="w-3 h-3 opacity-60" />
        </div>

        {/* Right Side: Code & Telemetry Studio (Editor + Collapsible Serial Monitor) */}
        <div
          style={{ width: `${100 - canvasWidthPercent}%` }}
          className="flex flex-col min-w-0 max-lg:!w-full h-[620px] lg:h-auto bg-[#1E1E1E]"
        >
          {/* Top: Code Editor */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <CodeEditor />
          </div>

          {/* Bottom: Collapsible Serial Monitor Panel */}
          <div className="border-t border-[#333333] flex flex-col flex-shrink-0 bg-[#1E1E1E]">
            {/* Collapsible Header Toggle */}
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

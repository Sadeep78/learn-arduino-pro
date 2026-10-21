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
  GripVertical,
  LayoutGrid,
  Columns,
  Layers,
  ShieldAlert,
  Play,
  Square,
  FileCode,
  Save
} from 'lucide-react';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';
import { ComponentPalette } from '../components/canvas/ComponentPalette';
import { CircuitCheckPanel } from '../components/canvas/CircuitCheckPanel';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SerialMonitor } from '../components/editor/SerialMonitor';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { LESSONS } from '../data/lessons';

export type SimulatorTab = 'circuit' | 'code' | 'check' | 'split';

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
  const { saveProject } = useProjectStore();

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  // Active view tab: 'circuit' (default, dedicated workbench), 'code' (sketch.ino), 'check' (verification), 'split' (side-by-side)
  const [activeTab, setActiveTab] = useState<SimulatorTab>('circuit');

  // Palette drawer visibility in Circuit Designer
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(true);

  // Resizable split layout state (for 'split' mode only)
  const [canvasWidthPercent, setCanvasWidthPercent] = useState<number>(55);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Collapsible panels
  const [isSerialMonitorOpen, setIsSerialMonitorOpen] = useState<boolean>(true);

  // Lesson change confirmation dialog
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveProject = () => {
    const title = saveTitle.trim() || `${activeLesson.title} project`;
    saveProject(title, `Saved from ${activeLesson.title}`, circuit, activeCode);
    setShowSaveDialog(false);
    setSaveTitle('');
    setSaveStatus('Saved to My Projects');
    setTimeout(() => setSaveStatus(null), 2500);
  };

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
    <div className="space-y-3 select-none w-full">
      {/* Top Header & Navigation Bar */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
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

          <button
            onClick={() => {
              setSaveTitle(`${activeLesson.title} project`);
              setShowSaveDialog(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition flex-shrink-0"
            title="Save this circuit and code to My Projects"
          >
            <Save className="w-3.5 h-3.5 text-blueprint-teal" />
            <span className="hidden sm:inline">Save</span>
          </button>
          {saveStatus && (
            <span className="text-[11px] font-mono font-bold text-emerald-600">{saveStatus}</span>
          )}
        </div>

        {/* Center: Dedicated Mode Switcher Tabs */}
        <div className="flex items-center justify-center p-1 rounded-xl bg-blueprint-creamDark/80 dark:bg-blueprint-nightBg/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder self-center flex-wrap gap-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab('circuit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'circuit'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Full Circuit Workbench - Arduino Uno & Breadboard"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>🔌 Circuit</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'code'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Dedicated Arduino Code Editor (sketch.ino) & Serial Monitor"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>💻 sketch.ino</span>
          </button>

          <button
            onClick={() => setActiveTab('check')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'check'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Circuit & Code Verification Dashboard"
          >
            {isShortCircuit ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            ) : isAllPassed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>📋 Circuit Check</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'check'
                  ? 'bg-white/20 text-white'
                  : isAllPassed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {passCount}/{totalChecks}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'split'
                ? 'bg-blueprint-teal text-white shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
            title="Side-by-side Canvas and Code Editor Studio"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>🔀 Split</span>
          </button>
        </div>

        {/* Right: Simulation Run/Stop Primary Button */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0">
          {isRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono font-bold text-xs shadow-md transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={() => startSimulation()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-mono font-bold text-xs shadow-md shadow-blueprint-teal/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SIMULATION</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content Viewport */}

      {/* TAB 1: 🔌 Dedicated Circuit Workbench (Default) */}
      {activeTab === 'circuit' && (
        <div className="rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/80 dark:bg-blueprint-nightCard/80 backdrop-blur-md h-[640px] flex relative">
          {/* Left: Collapsible Components Palette */}
          {isPaletteOpen && (
            <div className="flex flex-shrink-0 animate-in slide-in-from-left-2 duration-200">
              <ComponentPalette
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
              />
            </div>
          )}

          {/* Center: Full-width Circuit Canvas */}
          <div className="flex-1 min-w-0 h-full relative">
            <CircuitCanvas />

            {/* Bottom-right quick jump pills to sketch.ino and Circuit Check */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
              {!isPaletteOpen && (
                <button
                  onClick={() => setIsPaletteOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition"
                  title="Open Components Palette"
                >
                  <Layers className="w-3.5 h-3.5 text-blueprint-teal" />
                  <span>+ Parts</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('check')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md transition ${
                  isShortCircuit
                    ? 'bg-red-500 text-white animate-pulse'
                    : isAllPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal'
                }`}
                title="View full Circuit Verification Dashboard"
              >
                {isAllPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Check: {passCount}/{totalChecks} Passed →</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-md text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition"
                title="Open Arduino sketch.ino code editor"
              >
                <Code2 className="w-3.5 h-3.5 text-blueprint-teal" />
                <span>sketch.ino →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 💻 Dedicated Code Editor & Serial Monitor (sketch.ino) */}
      {activeTab === 'code' && (
        <div className="rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-[#1E1E1E] h-[640px] flex flex-col">
          {/* Editor Header Navigation Bar */}
          <div className="px-4 py-2 bg-[#252526] border-b border-[#333333] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blueprint-teal" />
                <span>sketch.ino</span>
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                Arduino Uno (ATmega328P @ 16MHz)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('circuit')}
                className="px-3 py-1 rounded-lg bg-blueprint-teal/15 hover:bg-blueprint-teal text-blueprint-teal hover:text-white text-xs font-mono font-bold transition flex items-center gap-1"
              >
                <span>🔌 Back to Circuit</span>
              </button>
              <button
                onClick={() => setActiveTab('check')}
                className="px-3 py-1 rounded-lg bg-[#333333] hover:bg-[#444444] text-gray-200 text-xs font-mono font-bold transition flex items-center gap-1"
              >
                <span>📋 Circuit Check ({passCount}/{totalChecks})</span>
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <CodeEditor />
          </div>

          {/* Collapsible Serial Monitor */}
          <div className="border-t border-[#333333] flex flex-col flex-shrink-0 bg-[#1E1E1E]">
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

              <button className="text-gray-400 hover:text-gray-200 p-0.5">
                {isSerialMonitorOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {isSerialMonitorOpen && (
              <div className="h-44 sm:h-52 overflow-hidden">
                <SerialMonitor />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 📋 Dedicated Circuit & Code Verification Dashboard */}
      {activeTab === 'check' && (
        <div className="rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md min-h-[640px] flex flex-col p-4 sm:p-6">
          <CircuitCheckPanel
            isFullPage={true}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        </div>
      )}

      {/* TAB 4: 🔀 Split Studio (Canvas on Left, Code on Right) */}
      {activeTab === 'split' && (
        <div
          ref={splitContainerRef}
          className="rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/80 dark:bg-blueprint-nightCard/80 backdrop-blur-md h-[640px] flex flex-col lg:flex-row relative"
        >
          {/* Left: Canvas Studio */}
          <div
            style={{ width: `${canvasWidthPercent}%` }}
            className="flex min-w-0 max-lg:!w-full h-full border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder relative"
          >
            <CircuitCanvas />
          </div>

          {/* Draggable Resizer Handle */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className={`hidden lg:flex w-2 items-center justify-center bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 hover:bg-blueprint-teal/40 cursor-col-resize transition-colors select-none flex-shrink-0 ${
              isResizing ? 'bg-blueprint-teal text-white' : 'text-gray-400'
            }`}
            title="Drag to resize columns"
          >
            <GripVertical className="w-3 h-3 opacity-60" />
          </div>

          {/* Right: Code Studio */}
          <div
            style={{ width: `${100 - canvasWidthPercent}%` }}
            className="flex flex-col min-w-0 max-lg:!w-full h-full bg-[#1E1E1E]"
          >
            <div className="flex-1 min-h-0 relative overflow-hidden">
              <CodeEditor />
            </div>

            <div className="border-t border-[#333333] flex flex-col flex-shrink-0 bg-[#1E1E1E]">
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

                <button className="text-gray-400 hover:text-gray-200 p-0.5">
                  {isSerialMonitorOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

              {isSerialMonitorOpen && (
                <div className="h-44 sm:h-52 overflow-hidden">
                  <SerialMonitor />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-blueprint-navy dark:text-white">Save to My Projects</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Give this circuit a name so you can open it later from the Projects page.
            </p>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark dark:bg-blueprint-nightBg text-sm text-blueprint-navy dark:text-white focus:outline-none focus:border-blueprint-teal"
              placeholder="Project name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 rounded-xl bg-blueprint-teal text-white text-xs font-mono font-bold"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

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

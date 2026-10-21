import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  ShieldAlert,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useUIStore } from '../../store/useUIStore';
import { useProgressStore } from '../../store/useProgressStore';
import { LESSONS } from '../../data/lessons';
import { detectCodeFix, applyCodeFix } from '../../lib/circuit/codeFixer';

interface CircuitCheckPanelProps {
  isDocked?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CircuitCheckPanel: React.FC<CircuitCheckPanelProps> = ({
  isDocked = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(true);

  const {
    checklist,
    isShortCircuit,
    selectComponent,
    selectWire,
    activeCode,
    setActiveCode
  } = useSimulatorStore();

  const { activeLessonId } = useUIStore();
  const { completedLessons, completeLesson } = useProgressStore();

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId);
  const isLessonCompleted = activeLesson ? completedLessons.includes(activeLesson.id) : false;

  const totalChecks = checklist.length;
  const passCount = checklist.filter((item) => item.status === 'pass').length;
  const failCount = checklist.filter((item) => item.status === 'fail').length;
  const isAllPassed = totalChecks > 0 && failCount === 0 && !isShortCircuit;

  const handleItemClick = (item: (typeof checklist)[0]) => {
    if (item.componentId) {
      selectComponent(item.componentId);
    }
    if (item.wireId) {
      selectWire(item.wireId);
    }
  };

  const handleCompleteLesson = () => {
    if (activeLesson && isAllPassed && !isLessonCompleted) {
      completeLesson(activeLesson.id, activeLesson.xpReward);
    }
  };

  const handleApplyFix = (missingLine: string) => {
    const fixedCode = applyCodeFix(activeCode, missingLine);
    setActiveCode(fixedCode);
  };

  // If docked and collapsed on desktop, render a slim interactive sidebar tab
  if (isDocked && isCollapsed) {
    return (
      <div
        onClick={onToggleCollapse}
        className="w-10 h-full flex flex-col items-center justify-between py-3.5 bg-white/90 dark:bg-blueprint-nightCard/90 border-l border-blueprint-creamBorder dark:border-blueprint-nightBorder cursor-pointer hover:bg-blueprint-teal/10 transition group select-none"
        title="Expand Circuit Check Panel"
      >
        <button
          aria-label="Expand Circuit Check Panel"
          className="text-gray-400 group-hover:text-blueprint-teal transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isShortCircuit
                ? 'bg-red-500 animate-pulse'
                : isAllPassed
                ? 'bg-emerald-500'
                : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span
            className="text-[10px] font-mono font-black text-blueprint-navy dark:text-gray-200 tracking-wider uppercase whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Circuit Check ({passCount}/{totalChecks})
          </span>
        </div>

        <span className="text-[9px] font-mono font-bold text-gray-400">
          {Math.round((passCount / Math.max(1, totalChecks)) * 100)}%
        </span>
      </div>
    );
  }

  const containerClasses = isDocked
    ? 'w-72 sm:w-80 h-full flex flex-col bg-white/95 dark:bg-blueprint-nightCard/95 border-l border-blueprint-creamBorder dark:border-blueprint-nightBorder select-none shadow-sm'
    : 'w-full flex flex-col bg-white/95 dark:bg-blueprint-nightCard/95 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder select-none';

  return (
    <div className={containerClasses}>
      {/* Header Bar */}
      <div
        onClick={() => {
          if (isDocked && onToggleCollapse) {
            onToggleCollapse();
          } else {
            setInternalExpanded(!internalExpanded);
          }
        }}
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:bg-blueprint-teal/5 transition flex-shrink-0"
      >
        <div className="flex items-center gap-2 min-w-0">
          {isShortCircuit ? (
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
          ) : isAllPassed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
          <span className="text-xs font-mono font-black text-blueprint-navy dark:text-white uppercase tracking-wider truncate">
            Circuit Check
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              isShortCircuit
                ? 'bg-red-500 text-white'
                : isAllPassed
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isShortCircuit
              ? 'SHORT CIRCUIT'
              : `${passCount}/${totalChecks} PASSED`}
          </span>
        </div>

        <button
          aria-label="Toggle Circuit Check Panel"
          className="text-gray-400 hover:text-blueprint-navy dark:hover:text-white p-1 rounded-lg flex-shrink-0 ml-1"
        >
          {isDocked ? (
            <ChevronRight className="w-4 h-4" />
          ) : internalExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Panel Scrollable Body */}
      {(isDocked || internalExpanded) && (
        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
          {/* Active Lesson Header Badge */}
          {activeLesson && (
            <div className="p-2 rounded-xl bg-blueprint-creamDark/50 dark:bg-blueprint-nightBg/50 border border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blueprint-teal truncate">
                Lesson #{String(activeLesson.number).padStart(2, '0')}: {activeLesson.title}
              </span>
              {isLessonCompleted && (
                <span className="text-[9px] font-mono font-bold text-emerald-500 flex items-center gap-1 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>
          )}

          {/* Short Circuit Critical Alert */}
          {isShortCircuit && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>5V directly connected to GND!</span>
              </div>
              <p className="text-[11px] mt-1 opacity-90 leading-tight">
                Disconnect the direct connection between 5V power and Ground to protect the microcontroller core.
              </p>
            </div>
          )}

          {/* Checklist Items */}
          {totalChecks === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 font-mono">
              No active components on canvas. Place parts from the palette to begin wiring.
            </div>
          ) : (
            <div className="space-y-1.5">
              {checklist.map((item) => {
                const isPass = item.status === 'pass';
                const isFail = item.status === 'fail';
                const fixInfo = isFail ? detectCodeFix(item, activeCode) : { fixable: false };

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isPass
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                        : isFail
                        ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200'
                        : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isPass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : isFail ? (
                        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold font-mono text-[11px] leading-tight">
                          {item.label}
                        </p>
                        <p className="text-[10px] opacity-85 mt-0.5 font-sans leading-snug">
                          {item.details}
                        </p>
                      </div>
                    </div>

                    {/* Automatic Fix-It Help */}
                    {fixInfo.fixable && fixInfo.missingLine && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2.5 pt-2 border-t border-red-200 dark:border-red-800/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-300">
                            Missing in setup():
                          </span>
                          <button
                            onClick={() => handleApplyFix(fixInfo.missingLine!)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-[10px] font-mono font-bold shadow-xs transition"
                            title={`Insert ${fixInfo.missingLine} inside void setup()`}
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Fix it for me</span>
                          </button>
                        </div>
                        {fixInfo.explanation && (
                          <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight font-sans">
                            {fixInfo.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lesson Verification & Mark as Complete */}
          {activeLesson && (
            <div className="pt-2 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder">
              <button
                onClick={handleCompleteLesson}
                disabled={!isAllPassed || isLessonCompleted}
                className={`w-full py-2 px-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm ${
                  isLessonCompleted
                    ? 'bg-emerald-500 text-white cursor-default'
                    : isAllPassed
                    ? 'bg-blueprint-teal hover:bg-blueprint-tealHover text-white shadow-blueprint-teal/30 cursor-pointer animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                }`}
                title={
                  isLessonCompleted
                    ? 'Lesson already completed'
                    : isAllPassed
                    ? `Mark Lesson as complete and earn +${activeLesson.xpReward} XP!`
                    : 'Fix all wiring & code errors to enable completion'
                }
              >
                {isLessonCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lesson Completed</span>
                  </>
                ) : isAllPassed ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Mark as Complete (+{activeLesson.xpReward} XP)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Mark as Complete (Fix {failCount} {failCount === 1 ? 'Error' : 'Errors'})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

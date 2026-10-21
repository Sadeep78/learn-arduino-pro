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
  Sparkles,
  X
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useUIStore } from '../../store/useUIStore';
import { useProgressStore } from '../../store/useProgressStore';
import { LESSONS } from '../../data/lessons';
import { detectCodeFix, applyCodeFix } from '../../lib/circuit/codeFixer';

interface CircuitCheckPanelProps {
  isDocked?: boolean;
  isCollapsed?: boolean;
  isFullPage?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  onNavigate?: (tab: 'circuit' | 'code') => void;
  className?: string;
}

export const CircuitCheckPanel: React.FC<CircuitCheckPanelProps> = ({
  isDocked = false,
  isCollapsed = false,
  isFullPage = false,
  onToggleCollapse,
  onClose,
  onNavigate,
  className = ''
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

  // If rendered as dedicated full-page view
  if (isFullPage) {
    return (
      <div className={`w-full max-w-4xl mx-auto py-4 px-3 sm:px-6 space-y-4 select-none ${className}`}>
        {/* Full-Page Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider">
                CIRCUIT CHECK & VERIFICATION
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isShortCircuit
                    ? 'bg-red-500 text-white animate-pulse'
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
            <h2 className="text-base sm:text-lg font-bold text-blueprint-navy dark:text-white mt-1">
              {activeLesson ? `Lesson #${String(activeLesson.number).padStart(2, '0')}: ${activeLesson.title}` : 'Circuit Validation'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Live checks test that wires, resistors, power lines, and Arduino sketch code are wired correctly.
            </p>
          </div>

          {onNavigate && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate('circuit')}
                className="px-3.5 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
              >
                🔌 Back to Circuit
              </button>
              <button
                onClick={() => onNavigate('code')}
                className="px-3.5 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal text-xs font-mono font-bold transition"
              >
                💻 Edit sketch.ino
              </button>
            </div>
          )}
        </div>

        {/* Short Circuit Critical Alert */}
        {isShortCircuit && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200 text-sm space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse flex-shrink-0" />
              <span>5V directly connected to GND! Short Circuit Detected!</span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed pl-7">
              Disconnect the direct connection between 5V power and Ground. Always route through a resistor and component load to protect the microcontroller.
            </p>
          </div>
        )}

        {/* Checklist Cards List */}
        <div className="space-y-2.5">
          {checklist.map((item) => {
            const isPass = item.status === 'pass';
            const isFail = item.status === 'fail';
            const fixInfo = isFail ? detectCodeFix(item, activeCode) : { fixable: false };

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isPass
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                    : isFail
                    ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200 shadow-sm'
                    : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isPass ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : isFail ? (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold font-mono text-xs sm:text-sm">
                        {item.label}
                      </p>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isPass
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isPass ? 'PASSED' : 'ACTION REQUIRED'}
                      </span>
                    </div>

                    <p className="text-xs opacity-85 mt-1 font-sans leading-relaxed">
                      {item.details}
                    </p>

                    {/* Automatic Fix-It Assistant */}
                    {fixInfo.fixable && fixInfo.missingLine && (
                      <div className="mt-3 p-3 rounded-xl bg-white/80 dark:bg-blueprint-nightBg/80 border border-red-200 dark:border-red-800/50 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                            Missing in setup():
                          </span>
                          <button
                            onClick={() => handleApplyFix(fixInfo.missingLine!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
                            title={`Insert ${fixInfo.missingLine} inside void setup()`}
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Fix it for me</span>
                          </button>
                        </div>
                        {fixInfo.explanation && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                            {fixInfo.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mark as Complete Footer */}
        {activeLesson && (
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-blueprint-nightCard/95 border border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-blueprint-navy dark:text-white">
                Lesson Completion Status
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {isLessonCompleted
                  ? 'Congratulations! You have earned the XP for this lesson.'
                  : isAllPassed
                  ? 'All circuit connections and sketch code are verified! Click to complete.'
                  : `Please resolve the remaining ${failCount} item(s) to finish.`}
              </p>
            </div>

            <button
              onClick={handleCompleteLesson}
              disabled={!isAllPassed || isLessonCompleted}
              className={`py-2 px-4 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                isLessonCompleted
                  ? 'bg-emerald-500 text-white cursor-default'
                  : isAllPassed
                  ? 'bg-blueprint-teal hover:bg-blueprint-tealHover text-white shadow-blueprint-teal/30 cursor-pointer animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              {isLessonCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </>
              ) : isAllPassed ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>Mark as Complete (+{activeLesson.xpReward} XP)</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Incomplete</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  const containerClasses = `${
    isDocked
      ? 'w-72 sm:w-80 h-full flex flex-col bg-white/95 dark:bg-blueprint-nightCard/95 border-l border-blueprint-creamBorder dark:border-blueprint-nightBorder select-none shadow-sm'
      : 'w-full flex flex-col bg-white/95 dark:bg-blueprint-nightCard/95 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder select-none'
  } ${className}`;

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

        <div className="flex items-center gap-1">
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close Circuit Check Panel"
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            aria-label="Toggle Circuit Check Panel"
            className="text-gray-400 hover:text-blueprint-navy dark:hover:text-white p-1 rounded-lg flex-shrink-0"
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

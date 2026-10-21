import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  ShieldAlert,
  Cpu,
  Layers
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useUIStore } from '../../store/useUIStore';
import { useProgressStore } from '../../store/useProgressStore';
import { LESSONS } from '../../data/lessons';

export const CircuitCheckPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const {
    checklist,
    isShortCircuit,
    selectComponent,
    selectWire,
    circuit
  } = useSimulatorStore();

  const { activeLessonId, setActiveNav } = useUIStore();
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

  return (
    <div className="absolute top-16 right-3 z-30 max-w-sm w-80 sm:w-88 select-none pointer-events-auto">
      <div className="bg-white/95 dark:bg-blueprint-nightCard/95 backdrop-blur-md rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:bg-blueprint-teal/5 transition"
        >
          <div className="flex items-center gap-2">
            {isShortCircuit ? (
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            ) : isAllPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-xs font-mono font-black text-blueprint-navy dark:text-white uppercase tracking-wider">
              Circuit Check
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
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
            className="text-gray-400 hover:text-blueprint-navy dark:hover:text-white p-1 rounded-lg"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-3 space-y-3 max-h-[380px] overflow-y-auto">
            {/* Short Circuit Critical Alert */}
            {isShortCircuit && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>5V directly connected to GND!</span>
                </div>
                <p className="text-[11px] mt-1 opacity-90">
                  Disconnect the direct short-circuit between the 5V power line and Ground to protect the microcontroller.
                </p>
              </div>
            )}

            {/* Checklist Items */}
            {totalChecks === 0 ? (
              <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                No active components on canvas. Place components from the palette to begin wiring.
              </div>
            ) : (
              <div className="space-y-1.5">
                {checklist.map((item) => {
                  const isPass = item.status === 'pass';
                  const isFail = item.status === 'fail';

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-all hover:translate-x-0.5 ${
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
                          <p className="font-bold font-mono text-[11px] leading-tight truncate">
                            {item.label}
                          </p>
                          <p className="text-[10px] opacity-85 mt-0.5 font-sans leading-snug">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lesson Verification & Mark as Complete */}
            {activeLesson && (
              <div className="pt-2 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 truncate">
                    Lesson #{String(activeLesson.number).padStart(2, '0')}: {activeLesson.title}
                  </span>
                  {isLessonCompleted && (
                    <span className="text-[9px] font-mono font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>

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
                      : 'Fix all wiring errors to enable completion'
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
    </div>
  );
};

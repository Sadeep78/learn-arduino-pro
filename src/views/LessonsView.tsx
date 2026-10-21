import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Zap,
  Play,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { useUIStore } from '../store/useUIStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const LessonsView: React.FC = () => {
  const { activeLessonId, setActiveLessonId, setActiveNav, setIsQuizOpen, setIsCertificateOpen } = useUIStore();
  const { completedLessons } = useProgressStore();
  const { loadCircuit } = useSimulatorStore();

  const lesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];
  const isCompleted = completedLessons.includes(lesson.id);

  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const handleLaunchInSimulator = () => {
    loadCircuit(lesson.initialCircuit, lesson.codeSnippet);
    setActiveNav('simulator');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Lesson Title, Category, Stats, and Actions */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-black text-blueprint-teal">
              LESSON #{String(lesson.number).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blueprint-creamDark dark:bg-blueprint-nightBg text-blueprint-navyMuted dark:text-gray-300">
              {lesson.categoryLabel}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-blueprint-navy dark:text-white">
            {lesson.title}
          </h2>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Action Buttons: Simulator & Quiz */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleLaunchInSimulator}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-md shadow-blueprint-teal/20 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open in Simulator</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-bold shadow-md transition"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Take Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Lesson Guide (7 cols) + Right Code & Checkpoints (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Theory, Hardware, Schematic */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary & Theory Card */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>THEORY & WORKING PRINCIPLES</span>
            </h3>
            <p className="text-xs text-blueprint-navy dark:text-gray-200 leading-relaxed font-sans">
              {lesson.summary}
            </p>

            {/* Learning Goals */}
            <div className="pt-2">
              <h4 className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Key Learning Outcomes
              </h4>
              <div className="space-y-1.5">
                {lesson.learningGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blueprint-navy dark:text-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blueprint-teal flex-shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hardware Components Needed */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>REQUIRED HARDWARE COMPONENTS</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.hardwareParts.map((part, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-medium text-blueprint-navy dark:text-gray-200"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>

          {/* Wiring Guide */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>SCHEMATIC & WIRING INSTRUCTIONS</span>
            </h3>
            <p className="text-xs text-blueprint-navy dark:text-gray-200 leading-relaxed font-sans">
              {lesson.schematicDescription}
            </p>
          </div>
        </div>

        {/* Right Column: Code Snippet & Objectives */}
        <div className="lg:col-span-5 space-y-6">
          {/* Objectives Checkpoints */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>LESSON OBJECTIVES</span>
            </h3>
            <div className="space-y-2">
              {lesson.checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="p-3 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-blueprint-tealLight dark:bg-blueprint-teal/20 text-blueprint-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono text-blueprint-navy dark:text-white">
                      {cp.titleKey}
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {cp.descriptionKey}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Starter Sketch Preview */}
          <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl space-y-3 text-gray-200 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-300">starter_sketch.ino</span>
              <button
                onClick={() => navigator.clipboard.writeText(lesson.codeSnippet)}
                className="text-[10px] text-blueprint-teal hover:underline"
              >
                Copy Code
              </button>
            </div>
            <pre className="max-h-80 overflow-y-auto leading-relaxed text-emerald-400">
              <code>{lesson.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom Lesson Navigation */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-blueprint-nightCard/60 border border-blueprint-creamBorder dark:border-blueprint-nightBorder">
        {prevLesson ? (
          <button
            onClick={() => setActiveLessonId(prevLesson.id)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: {prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            onClick={() => setActiveLessonId(nextLesson.id)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-blueprint-teal hover:text-blueprint-tealHover transition"
          >
            <span>Next: {nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsCertificateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs shadow-md transition"
          >
            <Award className="w-4 h-4" />
            <span>Claim Your Certificate!</span>
          </button>
        )}
      </div>
    </div>
  );
};

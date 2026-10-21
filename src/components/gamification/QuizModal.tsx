import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useProgressStore } from '../../store/useProgressStore';
import { LESSONS } from '../../data/lessons';

export const QuizModal: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, activeLessonId } = useUIStore();
  const { addXP, recordQuizScore, completeLesson } = useProgressStore();

  const lesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];
  const questions = lesson.quiz;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isQuizOpen) return null;

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      addXP(50);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      recordQuizScore(lesson.id, score + (selectedOpt === currentQ.correctIndex ? 1 : 0));
      completeLesson(lesson.id, lesson.xpReward);
    }
  };

  const handleClose = () => {
    setIsQuizOpen(false);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-blueprint-cream dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-blueprint-creamDark dark:bg-blueprint-nightBg border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blueprint-teal fill-blueprint-teal" />
            <h3 className="text-sm font-extrabold font-mono text-blueprint-navy dark:text-white uppercase tracking-wider">
              {lesson.title} — Quiz Check
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-4">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-blueprint-teal font-bold">+50 XP per correct answer</span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-blueprint-navy dark:text-white leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-blueprint-nightBg text-blueprint-navy dark:text-gray-200 hover:border-blueprint-teal';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200';
                    } else {
                      btnStyle = 'border-gray-200 dark:border-gray-800 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isAnswered && (
                <div className="p-3.5 rounded-xl bg-blueprint-tealLight dark:bg-blueprint-teal/15 border border-blueprint-teal/30 text-xs text-blueprint-navy dark:text-gray-200 space-y-1 animate-in fade-in duration-200">
                  <div className="font-bold font-mono text-blueprint-teal uppercase">
                    Explanation
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Question Button */}
              {isAnswered && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold transition shadow-md"
                  >
                    <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Celebration Screen */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-blueprint-navy dark:text-white">
                  Quiz Completed!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  You scored {score} of {questions.length} questions correctly.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-sm shadow-sm">
                <Zap className="w-4 h-4 fill-current" />
                <span>+{lesson.xpReward} XP Awarded!</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-mono font-bold text-xs shadow-md transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

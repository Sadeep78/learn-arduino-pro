import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, PlaySquare, Video, ArrowRight, X, Sparkles } from 'lucide-react';
import { BoardScene } from '../components/3d/BoardScene';
import { RightPanel } from '../components/layout/RightPanel';
import { LessonCarousel } from '../components/lessons/LessonCarousel';
import { useUIStore } from '../store/useUIStore';
import { LESSONS } from '../data/lessons';

export const HomeView: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveNav, setActiveLessonId } = useUIStore();
  const [showGuide, setShowGuide] = useState(
    () => localStorage.getItem('arduino_pro_hide_guide') !== 'true'
  );

  const startFirstLesson = () => {
    setActiveLessonId(LESSONS[0].id);
    setActiveNav('lessons');
  };

  const dismissGuide = () => {
    localStorage.setItem('arduino_pro_hide_guide', 'true');
    setShowGuide(false);
  };

  return (
    <div className="space-y-6">
      {showGuide && (
        <section className="relative overflow-hidden rounded-2xl border border-blueprint-teal/30 bg-white/90 dark:bg-blueprint-nightCard/90 shadow-blueprint p-5 sm:p-6">
          <button
            onClick={dismissGuide}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-blueprint-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            aria-label={t('home.dismissGuide', 'Hide this guide')}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-8">
            <Sparkles className="w-5 h-5 text-blueprint-teal" />
            <h1 className="text-lg sm:text-xl font-black text-blueprint-navy dark:text-white">
              {t('home.welcomeTitle', 'Welcome — learn Arduino in 3 simple steps')}
            </h1>
          </div>
          <p className="text-sm text-blueprint-navyMuted dark:text-gray-300 max-w-3xl leading-relaxed">
            {t(
              'home.welcomeBody',
              'No extra software. No physical board needed. Follow a lesson, try it in the simulator, or watch a video. The Tutor button at the top can answer questions anytime.'
            )}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={startFirstLesson}
              className="flex items-start gap-3 p-4 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark/70 dark:bg-blueprint-nightBg/70 hover:border-blueprint-teal text-left transition group"
            >
              <span className="w-8 h-8 rounded-lg bg-blueprint-teal text-white flex items-center justify-center font-mono font-bold flex-shrink-0">
                1
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal">
                  <BookOpen className="w-4 h-4" />
                  {t('home.stepLesson', 'Start Lesson 1')}
                </span>
                <span className="block text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1">
                  {t('home.stepLessonHint', 'Meet the Arduino Uno board')}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto text-blueprint-teal opacity-0 group-hover:opacity-100 transition self-center" />
            </button>

            <button
              onClick={() => setActiveNav('simulator')}
              className="flex items-start gap-3 p-4 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark/70 dark:bg-blueprint-nightBg/70 hover:border-blueprint-teal text-left transition group"
            >
              <span className="w-8 h-8 rounded-lg bg-blueprint-teal text-white flex items-center justify-center font-mono font-bold flex-shrink-0">
                2
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal">
                  <PlaySquare className="w-4 h-4" />
                  {t('home.stepSim', 'Open the Simulator')}
                </span>
                <span className="block text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1">
                  {t('home.stepSimHint', 'Wire parts, write code, press Run')}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto text-blueprint-teal opacity-0 group-hover:opacity-100 transition self-center" />
            </button>

            <button
              onClick={() => setActiveNav('videos')}
              className="flex items-start gap-3 p-4 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark/70 dark:bg-blueprint-nightBg/70 hover:border-blueprint-teal text-left transition group"
            >
              <span className="w-8 h-8 rounded-lg bg-blueprint-teal text-white flex items-center justify-center font-mono font-bold flex-shrink-0">
                3
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal">
                  <Video className="w-4 h-4" />
                  {t('home.stepVideo', 'Watch a video')}
                </span>
                <span className="block text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1">
                  {t('home.stepVideoHint', 'Then open the matching circuit')}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto text-blueprint-teal opacity-0 group-hover:opacity-100 transition self-center" />
            </button>
          </div>
        </section>
      )}

      {/* 3D Uno Viewer (Left) + Right Information & Pinout Tabs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[520px]">
        {/* Left: 3D Interactive Isometric Board Explorer (7 cols on desktop) */}
        <div className="lg:col-span-7 h-[460px] sm:h-[520px] w-full">
          <BoardScene />
        </div>

        {/* Right: Technical Inspector Tabs (5 cols on desktop) */}
        <div className="lg:col-span-5 h-[460px] sm:h-[520px] w-full">
          <RightPanel />
        </div>
      </div>

      {/* Bottom: 11 Curriculum Lessons Carousel */}
      <div>
        <LessonCarousel />
      </div>
    </div>
  );
};

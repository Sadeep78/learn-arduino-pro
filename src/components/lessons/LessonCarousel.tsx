import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  Play,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { LESSONS } from '../../data/lessons';
import { useProgressStore } from '../../store/useProgressStore';
import { useUIStore } from '../../store/useUIStore';

export const LessonCarousel: React.FC = () => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const { completedLessons } = useProgressStore();
  const { activeLessonId, setActiveLessonId, setActiveNav } = useUIStore();

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveNav('lessons');
  };

  return (
    <div className="w-full bg-blueprint-cream/80 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-2xl shadow-blueprint p-4 select-none">
      {/* Carousel Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blueprint-teal" />
          <h3 className="text-sm font-extrabold font-mono text-blueprint-navy dark:text-white tracking-wide uppercase">
            {t('lessons.title', 'Start with these lessons')}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal font-mono font-bold border border-blueprint-teal/30">
            {t('lessons.badge', '11 Interactive Lessons')}
          </span>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition shadow-xs"
            title="Scroll Left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition shadow-xs"
            title="Scroll Right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div
        ref={carouselRef}
        className="flex items-stretch gap-3.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
      >
        {LESSONS.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = activeLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson.id)}
              className={`min-w-[270px] max-w-[270px] p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 ${
                isCurrent
                  ? 'bg-white dark:bg-blueprint-nightBg border-blueprint-teal ring-2 ring-blueprint-teal/30 shadow-blueprint-hover'
                  : 'bg-white/80 dark:bg-blueprint-nightBg/70 border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal/50 shadow-sm'
              }`}
            >
              <div>
                {/* Card Top: Number badge + Category + Completed status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black text-blueprint-teal tracking-tighter">
                    #{String(lesson.number).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blueprint-creamDark dark:bg-blueprint-nightCard text-blueprint-navyMuted dark:text-gray-300">
                      {lesson.categoryLabel}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal transition-colors line-clamp-1">
                  {lesson.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              {/* Card Bottom: Metadata and Launch button */}
              <div className="mt-4 pt-3 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blueprint-teal" />
                    {lesson.estimatedMinutes}m
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <Zap className="w-3 h-3 fill-current" />
                    +{lesson.xpReward} XP
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLesson(lesson.id);
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blueprint-teal text-white shadow-xs'
                      : 'bg-blueprint-creamDark dark:bg-blueprint-nightCard text-blueprint-navy dark:text-gray-200 group-hover:bg-blueprint-teal group-hover:text-white'
                  }`}
                  aria-label="Launch lesson"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Video,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Info
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { LESSONS } from '../data/lessons';
import {
  ARDUINO_BEGINNER_VIDEO,
  VideoChapter,
  CHAPTERS_RAW
} from '../data/videos';
import { VideoPlayer, VideoPlayerRef, formatTime } from '../components/video/VideoPlayer';

export const VideosView: React.FC = () => {
  const { setActiveNav, setActiveLessonId } = useUIStore();
  const { loadCircuit } = useSimulatorStore();

  const video = ARDUINO_BEGINNER_VIDEO;
  const chapters = video.chapters;

  const playerRef = useRef<VideoPlayerRef | null>(null);
  const chapterItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeChapter, setActiveChapter] = useState<VideoChapter>(chapters[0] || {
    time: 0,
    title: 'Full video',
    summary: 'Chapters not added yet'
  });
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto-scroll active chapter into view
  useEffect(() => {
    if (activeChapterIndex >= 0 && chapterItemRefs.current[activeChapterIndex]) {
      chapterItemRefs.current[activeChapterIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeChapterIndex]);

  const handleTimeChange = useCallback((curr: number, dur: number) => {
    setCurrentTime(curr);
    setDuration(dur);
  }, []);

  const handleActiveChapterChange = useCallback((chapter: VideoChapter, index: number) => {
    setActiveChapter(chapter);
    setActiveChapterIndex(index);
  }, []);

  const handleSelectChapter = useCallback((chapter: VideoChapter, index: number) => {
    setActiveChapter(chapter);
    setActiveChapterIndex(index);
    if (playerRef.current) {
      playerRef.current.seekTo(chapter.time);
    }
  }, []);

  // Find linked lesson if active chapter has lessonId
  const linkedLesson = activeChapter.lessonId
    ? LESSONS.find((l) => l.id === activeChapter.lessonId)
    : undefined;

  const handleOpenStepInSimulator = () => {
    if (!linkedLesson) return;

    // 1. Pause video
    if (playerRef.current) {
      playerRef.current.pause();
    }

    // 2. Load lesson circuit and code into simulator store
    loadCircuit(linkedLesson.initialCircuit, linkedLesson.codeSnippet);
    setActiveLessonId(linkedLesson.id);

    // 3. Navigate to Simulator view
    setActiveNav('simulator');
  };

  const isPlaceholderChapters = chapters.length === 1 && chapters[0].title === 'Full video';

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blueprint-teal" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              {video.title}
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Learn Arduino fundamentals with freeCodeCamp.org's comprehensive masterclass, synchronized chapters, and live circuit simulator integration.
          </p>
        </div>

        <a
          href={video.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:border-blueprint-teal transition"
          aria-label="Open video on YouTube in a new tab"
        >
          <span>Watch on YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 text-blueprint-teal" />
        </a>
      </div>

      {/* Main Grid: Video Player Column (7 cols) + Chapters Timeline (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Real YouTube Video Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <VideoPlayer
              youtubeId={video.youtubeId}
              watchUrl={video.watchUrl}
              chapters={chapters}
              onTimeChange={handleTimeChange}
              onActiveChapterChange={handleActiveChapterChange}
              playerRef={playerRef}
            />

            {/* Video Footer Bar with Real Time and Channel Credit */}
            <div className="flex items-center justify-between px-2 text-xs font-mono text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blueprint-teal" />
                <span className="font-bold text-blueprint-navy dark:text-gray-200">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  (Space: play/pause · ←/→: ±5s · 1-9: jump)
                </span>
              </div>

              <div className="text-[11px]">
                <span>Video by </span>
                <a
                  href="https://www.freecodecamp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blueprint-teal hover:underline"
                >
                  freeCodeCamp.org
                </a>
              </div>
            </div>
          </div>

          {/* Active Chapter Details & Simulator Launcher Card */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blueprint-teal uppercase tracking-wider block mb-1">
                  CURRENT TOPIC ({formatTime(activeChapter.time)})
                </span>
                <h3 className="text-base font-bold text-blueprint-navy dark:text-white">
                  {activeChapter.title}
                </h3>
              </div>

              {/* Show Open in Simulator button ONLY if linked to a lesson */}
              {linkedLesson && (
                <button
                  onClick={handleOpenStepInSimulator}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-md shadow-blueprint-teal/20 transition flex-shrink-0"
                  aria-label={`Open ${linkedLesson.title} step in Simulator`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open this step in Simulator</span>
                </button>
              )}
            </div>

            {/* Summary or Chapter Title */}
            <p className="text-xs text-blueprint-navy dark:text-gray-200 leading-relaxed font-sans">
              {activeChapter.summary || activeChapter.title}
            </p>

            {/* If linked to a lesson, show a helpful preview badge */}
            {linkedLesson && (
              <div className="pt-2 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex items-center gap-2 text-xs font-mono text-blueprint-teal">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Linked to Curriculum: <strong>{linkedLesson.title}</strong> (Lesson #{linkedLesson.number})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Scrollable Chapters Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider">
              COURSE CHAPTERS ({chapters.length})
            </h3>
            {isPlaceholderChapters && (
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                Chapters not added yet
              </span>
            )}
          </div>

          {/* Scrollable Chapter List */}
          <div
            className="space-y-2 max-h-[560px] overflow-y-auto pr-1"
            role="region"
            aria-label="Course Chapters List"
          >
            {chapters.map((chap, idx) => {
              const isActive = activeChapterIndex === idx;
              const hasLinkedLesson = Boolean(chap.lessonId);

              return (
                <div
                  key={`${chap.time}-${idx}`}
                  ref={(el) => (chapterItemRefs.current[idx] = el)}
                  onClick={() => handleSelectChapter(chap, idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isActive
                      ? 'bg-white dark:bg-blueprint-nightBg border-blueprint-teal ring-2 ring-blueprint-teal/30 shadow-md'
                      : 'bg-white/70 dark:bg-blueprint-nightCard/70 border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal/50'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Jump to chapter: ${chap.title} at ${formatTime(chap.time)}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectChapter(chap, idx);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-blueprint-teal text-white'
                            : 'bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal'
                        }`}
                      >
                        {formatTime(chap.time)}
                      </span>

                      {idx < 9 && (
                        <span className="text-[9px] font-mono text-gray-400">
                          (Key {idx + 1})
                        </span>
                      )}
                    </div>

                    {hasLinkedLesson && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Sim Ready
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-xs font-bold transition-colors ${
                      isActive
                        ? 'text-blueprint-teal'
                        : 'text-blueprint-navy dark:text-white group-hover:text-blueprint-teal'
                    }`}
                  >
                    {chap.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

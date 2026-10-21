import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Volume2,
  Clock,
  Sparkles
} from 'lucide-react';
import { VideoChapter } from '../../data/videos';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let apiLoadingPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  if (!apiLoadingPromise) {
    apiLoadingPromise = new Promise((resolve) => {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        resolve();
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube-nocookie.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    });
  }
  return apiLoadingPromise;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const sStr = s.toString().padStart(2, '0');
  if (h > 0) {
    const mStr = m.toString().padStart(2, '0');
    return `${h}:${mStr}:${sStr}`;
  }
  return `${m.toString().padStart(2, '0')}:${sStr}`;
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
  pause: () => void;
  play: () => void;
}

interface VideoPlayerProps {
  youtubeId: string;
  watchUrl: string;
  chapters: VideoChapter[];
  onTimeChange?: (currentTime: number, duration: number) => void;
  onActiveChapterChange?: (chapter: VideoChapter, index: number) => void;
  playerRef?: React.MutableRefObject<VideoPlayerRef | null>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  watchUrl,
  chapters,
  onTimeChange,
  onActiveChapterChange,
  playerRef
}) => {
  const containerId = useRef(`yt-player-${Math.random().toString(36).slice(2, 9)}`);
  const ytPlayerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resumeTime, setResumeTime] = useState<number | null>(null);

  const storageKey = `arduino_pro_video_pos_${youtubeId}`;

  // Check saved position in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 5) {
          setResumeTime(parsed);
        }
      }
    } catch (_) {}
  }, [storageKey]);

  // Find active chapter based on time
  const getActiveChapter = useCallback(
    (time: number) => {
      if (!chapters || chapters.length === 0) return { chapter: null, index: -1 };
      let activeIdx = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (time >= chapters[i].time) {
          activeIdx = i;
        } else {
          break;
        }
      }
      return { chapter: chapters[activeIdx], index: activeIdx };
    },
    [chapters]
  );

  // Expose player methods via playerRef
  useEffect(() => {
    if (!playerRef) return;
    playerRef.current = {
      seekTo: (seconds: number) => {
        if (ytPlayerRef.current?.seekTo) {
          ytPlayerRef.current.seekTo(seconds, true);
          ytPlayerRef.current.playVideo();
        }
      },
      pause: () => {
        if (ytPlayerRef.current?.pauseVideo) {
          ytPlayerRef.current.pauseVideo();
        }
      },
      play: () => {
        if (ytPlayerRef.current?.playVideo) {
          ytPlayerRef.current.playVideo();
        }
      }
    };
    return () => {
      playerRef.current = null;
    };
  }, [playerRef]);

  // Initialize YouTube IFrame Player
  useEffect(() => {
    let isCancelled = false;
    let pollInterval: any = null;

    setIsLoading(true);
    setHasError(false);

    loadYouTubeAPI()
      .then(() => {
        if (isCancelled) return;

        try {
          ytPlayerRef.current = new window.YT.Player(containerId.current, {
            videoId: youtubeId,
            host: 'https://www.youtube-nocookie.com',
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event: any) => {
                if (isCancelled) return;
                setIsLoading(false);
                const dur = event.target.getDuration() || 0;
                setDuration(dur);
                onTimeChange?.(0, dur);

                const { chapter, index } = getActiveChapter(0);
                if (chapter) onActiveChapterChange?.(chapter, index);
              },
              onStateChange: (event: any) => {
                if (isCancelled) return;
                const state = event.data;
                // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
                if (state === 1) {
                  setIsPlaying(true);
                  if (!pollInterval) {
                    pollInterval = setInterval(updateProgress, 500);
                  }
                } else {
                  setIsPlaying(false);
                  if (pollInterval) {
                    clearInterval(pollInterval);
                    pollInterval = null;
                  }
                  // Save current position when paused
                  if (ytPlayerRef.current?.getCurrentTime) {
                    const now = ytPlayerRef.current.getCurrentTime();
                    try {
                      localStorage.setItem(storageKey, String(now));
                    } catch (_) {}
                  }
                }
              },
              onError: (event: any) => {
                if (isCancelled) return;
                setIsLoading(false);
                setHasError(true);
                const code = event.data;
                if (code === 101 || code === 150) {
                  setErrorMessage('The video owner has restricted embedding on external sites.');
                } else if (code === 100) {
                  setErrorMessage('The requested video was not found or is private.');
                } else {
                  setErrorMessage('Failed to load video player (check network or adblocker).');
                }
              }
            }
          });
        } catch (e: any) {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Could not initialize YouTube Player.');
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Failed to load YouTube IFrame API script.');
        }
      });

    const updateProgress = () => {
      if (!ytPlayerRef.current?.getCurrentTime) return;
      const curr = ytPlayerRef.current.getCurrentTime() || 0;
      const dur = ytPlayerRef.current.getDuration() || duration;

      setCurrentTime(curr);
      setDuration(dur);
      onTimeChange?.(curr, dur);

      // Save to localStorage every few seconds
      try {
        localStorage.setItem(storageKey, String(curr));
      } catch (_) {}

      // Update active chapter
      const { chapter, index } = getActiveChapter(curr);
      if (chapter) {
        onActiveChapterChange?.(chapter, index);
      }
    };

    return () => {
      isCancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
      }
    };
  }, [youtubeId, getActiveChapter, onTimeChange, onActiveChapterChange, storageKey]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!ytPlayerRef.current) return;

      // Space = Play / Pause
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo?.();
        } else {
          ytPlayerRef.current.playVideo?.();
        }
      }

      // Left Arrow = Seek -5s
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const curr = ytPlayerRef.current.getCurrentTime?.() || 0;
        ytPlayerRef.current.seekTo?.(Math.max(0, curr - 5), true);
      }

      // Right Arrow = Seek +5s
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        const curr = ytPlayerRef.current.getCurrentTime?.() || 0;
        const dur = ytPlayerRef.current.getDuration?.() || Infinity;
        ytPlayerRef.current.seekTo?.(Math.min(dur, curr + 5), true);
      }

      // Number keys 1-9 = Jump to chapter index 0-8
      if (/^[1-9]$/.test(e.key)) {
        const chapterIdx = parseInt(e.key, 10) - 1;
        if (chapters && chapters[chapterIdx]) {
          e.preventDefault();
          ytPlayerRef.current.seekTo?.(chapters[chapterIdx].time, true);
          ytPlayerRef.current.playVideo?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, chapters]);

  const handleResume = () => {
    if (resumeTime !== null && ytPlayerRef.current?.seekTo) {
      ytPlayerRef.current.seekTo(resumeTime, true);
      ytPlayerRef.current.playVideo?.();
      setResumeTime(null);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-black border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Skeleton Loading State */}
      {isLoading && (
        <div
          className="absolute inset-0 z-20 bg-gray-950 flex flex-col items-center justify-center p-6 space-y-3 animate-pulse"
          role="status"
          aria-label="Loading YouTube Player"
        >
          <div className="w-14 h-14 rounded-full bg-blueprint-teal/20 border-2 border-blueprint-teal flex items-center justify-center">
            <Play className="w-6 h-6 text-blueprint-teal ml-0.5" />
          </div>
          <span className="text-xs font-mono text-gray-400">Loading YouTube Player...</span>
        </div>
      )}

      {/* Friendly Error State */}
      {hasError && (
        <div
          className="absolute inset-0 z-30 bg-gray-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4"
          role="alert"
        >
          <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 border border-red-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="max-w-md">
            <h4 className="text-sm font-bold font-mono text-white">Video Unavailable in Embed</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{errorMessage}</p>
          </div>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-md transition"
            aria-label="Watch video directly on YouTube in a new tab"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Resume from previous time notice */}
      {resumeTime !== null && !isLoading && !hasError && (
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between px-3 py-2 rounded-xl bg-blueprint-navy/90 backdrop-blur-md border border-blueprint-teal/40 text-xs font-mono text-white shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blueprint-teal" />
            <span>Resume from {formatTime(resumeTime)}?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResume}
              className="px-2.5 py-1 rounded-lg bg-blueprint-teal text-white font-bold hover:bg-blueprint-tealHover transition"
              aria-label={`Resume video from ${formatTime(resumeTime)}`}
            >
              Resume
            </button>
            <button
              onClick={() => setResumeTime(null)}
              className="p-1 text-gray-400 hover:text-white"
              aria-label="Dismiss resume prompt"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* YouTube IFrame Container */}
      <div className="w-full h-full">
        <div id={containerId.current} className="w-full h-full" />
      </div>
    </div>
  );
};

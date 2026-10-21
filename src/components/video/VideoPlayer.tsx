import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  AlertTriangle,
  Clock,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { VideoChapter } from '../../data/videos';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

// Singleton API Loader state
let apiLoadingPromise: Promise<void> | null = null;
const readyCallbacks: (() => void)[] = [];

/**
 * Robust YouTube IFrame API Loader (loads https://www.youtube.com/iframe_api once)
 */
export function loadYouTubeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  // 1. If YT & YT.Player already exist, resolve immediately
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  // 2. If already loading, return existing singleton promise
  if (apiLoadingPromise) {
    return apiLoadingPromise;
  }

  apiLoadingPromise = new Promise((resolve, reject) => {
    readyCallbacks.push(resolve);

    const prevHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevHandler === 'function') {
        try {
          prevHandler();
        } catch (e) {
          console.warn('Previous onYouTubeIframeAPIReady threw an error:', e);
        }
      }
      readyCallbacks.forEach((cb) => {
        try {
          cb();
        } catch (_) {}
      });
      readyCallbacks.length = 0;
    };

    // Check if script element already exists in DOM
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = (err) => {
        console.warn('Failed to load YouTube iframe_api script from https://www.youtube.com/iframe_api:', err);
        apiLoadingPromise = null;
        reject(err);
      };
      document.head.appendChild(tag);
    }
  });

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const pollIntervalRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
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

  // Keep stable refs to volatile callbacks so useEffect does not tear down the player on time ticks
  const onTimeChangeRef = useRef(onTimeChange);
  const onActiveChapterChangeRef = useRef(onActiveChapterChange);
  const getActiveChapterRef = useRef(getActiveChapter);

  useEffect(() => {
    onTimeChangeRef.current = onTimeChange;
    onActiveChapterChangeRef.current = onActiveChapterChange;
    getActiveChapterRef.current = getActiveChapter;
  });

  // Expose player methods via playerRef
  useEffect(() => {
    if (!playerRef) return;
    playerRef.current = {
      seekTo: (seconds: number) => {
        if (ytPlayerRef.current?.seekTo) {
          ytPlayerRef.current.seekTo(seconds, true);
          ytPlayerRef.current.playVideo?.();
        } else if (isFallbackMode) {
          console.warn('Seeking disabled: player is running in fallback <iframe> embed mode.');
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
  }, [playerRef, isFallbackMode]);

  // Main YouTube Player lifecycle (Safe under React StrictMode)
  useEffect(() => {
    let isMounted = true;
    let fallbackTimer: any = null;

    setIsLoading(true);
    setIsReady(false);
    setIsFallbackMode(false);
    setHasError(false);

    // 8-second timeout: if onReady has not fired, fall back to plain iframe
    fallbackTimer = setTimeout(() => {
      if (isMounted && !ytPlayerRef.current?.getPlayerState) {
        console.warn('YouTube Player onReady timed out after 8 seconds. Activating plain iframe fallback.');
        setIsLoading(false);
        setIsFallbackMode(true);
      }
    }, 8000);

    loadYouTubeAPI()
      .then(() => {
        if (!isMounted) return;

        if (!wrapperRef.current) {
          console.warn('VideoPlayer: wrapperRef is null, cannot mount player');
          return;
        }

        // Clean wrapper content and append a fresh child container for YouTube to replace
        wrapperRef.current.innerHTML = '';
        const mountDiv = document.createElement('div');
        mountDiv.style.width = '100%';
        mountDiv.style.height = '100%';
        wrapperRef.current.appendChild(mountDiv);

        try {
          ytPlayerRef.current = new window.YT.Player(mountDiv, {
            videoId: youtubeId,
            host: 'https://www.youtube.com',
            playerVars: {
              enablejsapi: 1,
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event: any) => {
                if (!isMounted) return;
                clearTimeout(fallbackTimer);
                setIsReady(true);
                setIsLoading(false);

                const dur = event.target?.getDuration?.() || 0;
                setDuration(dur);
                onTimeChangeRef.current?.(0, dur);

                const { chapter, index } = getActiveChapterRef.current(0);
                if (chapter) onActiveChapterChangeRef.current?.(chapter, index);
              },
              onStateChange: (event: any) => {
                if (!isMounted) return;
                const state = event.data;

                // 1 = PLAYING
                if (state === 1) {
                  setIsPlaying(true);
                  if (!pollIntervalRef.current) {
                    pollIntervalRef.current = setInterval(() => {
                      if (!isMounted || !ytPlayerRef.current?.getCurrentTime) return;
                      const curr = ytPlayerRef.current.getCurrentTime() || 0;
                      const dur = ytPlayerRef.current.getDuration?.() || duration;

                      setCurrentTime(curr);
                      setDuration(dur);
                      onTimeChangeRef.current?.(curr, dur);

                      try {
                        localStorage.setItem(storageKey, String(curr));
                      } catch (_) {}

                      const { chapter, index } = getActiveChapterRef.current(curr);
                      if (chapter) {
                        onActiveChapterChangeRef.current?.(chapter, index);
                      }
                    }, 500);
                  }
                } else {
                  setIsPlaying(false);
                  if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                  }

                  // Record position on pause / buffering
                  if (ytPlayerRef.current?.getCurrentTime) {
                    try {
                      const now = ytPlayerRef.current.getCurrentTime();
                      localStorage.setItem(storageKey, String(now));
                    } catch (_) {}
                  }
                }
              },
              onError: (event: any) => {
                if (!isMounted) return;
                clearTimeout(fallbackTimer);
                setIsLoading(false);
                const code = event.data;
                console.warn(`YouTube Player error event triggered with code ${code}`);

                if (code === 101 || code === 150) {
                  setErrorMessage('The video owner has restricted embedding on external sites.');
                  setHasError(true);
                } else if (code === 100) {
                  setErrorMessage('The requested video was not found or is private.');
                  setHasError(true);
                } else {
                  // For other errors, trigger the plain iframe fallback
                  console.warn('Falling back to plain <iframe> embed due to player error.');
                  setIsFallbackMode(true);
                }
              }
            }
          });
        } catch (err) {
          console.warn('Exception during new YT.Player initialization:', err);
          if (isMounted) {
            clearTimeout(fallbackTimer);
            setIsLoading(false);
            setIsFallbackMode(true);
          }
        }
      })
      .catch((err) => {
        console.warn('loadYouTubeAPI rejected:', err);
        if (isMounted) {
          clearTimeout(fallbackTimer);
          setIsLoading(false);
          setIsFallbackMode(true);
        }
      });

    return () => {
      isMounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying YouTube player on unmount:', e);
        }
        ytPlayerRef.current = null;
      }
    };
  }, [youtubeId, storageKey]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Space = Play / Pause
      if (e.code === 'Space') {
        e.preventDefault();
        if (ytPlayerRef.current?.getPlayerState) {
          if (isPlaying) {
            ytPlayerRef.current.pauseVideo?.();
          } else {
            ytPlayerRef.current.playVideo?.();
          }
        }
      }

      // Left Arrow = Seek -5s
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (ytPlayerRef.current?.getCurrentTime) {
          const curr = ytPlayerRef.current.getCurrentTime() || 0;
          ytPlayerRef.current.seekTo?.(Math.max(0, curr - 5), true);
        }
      }

      // Right Arrow = Seek +5s
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (ytPlayerRef.current?.getCurrentTime) {
          const curr = ytPlayerRef.current.getCurrentTime() || 0;
          const dur = ytPlayerRef.current.getDuration?.() || Infinity;
          ytPlayerRef.current.seekTo?.(Math.min(dur, curr + 5), true);
        }
      }

      // Number keys 1-9 = Jump to chapter index 0-8
      if (/^[1-9]$/.test(e.key)) {
        const chapterIdx = parseInt(e.key, 10) - 1;
        if (chapters && chapters[chapterIdx]) {
          e.preventDefault();
          if (ytPlayerRef.current?.seekTo) {
            ytPlayerRef.current.seekTo(chapters[chapterIdx].time, true);
            ytPlayerRef.current.playVideo?.();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, chapters]);

  const handleResume = () => {
    if (resumeTime !== null) {
      if (ytPlayerRef.current?.seekTo) {
        ytPlayerRef.current.seekTo(resumeTime, true);
        ytPlayerRef.current.playVideo?.();
      } else {
        window.open(`${watchUrl}?t=${Math.floor(resumeTime)}`, '_blank', 'noopener,noreferrer');
      }
      setResumeTime(null);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-black border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* 1. Loading Skeleton */}
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

      {/* 2. Critical Error State (Restricted embedding or video not found) */}
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

      {/* 3. Plain <iframe> Fallback Embed Mode */}
      {isFallbackMode && (
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
            title="Arduino Course for Beginners"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />

          {/* Fallback Notice Banner */}
          <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between px-3 py-1.5 rounded-xl bg-blueprint-navy/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono shadow-lg">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[11px]">
                Advanced controls unavailable (chapter seeking disabled in fallback mode)
              </span>
            </div>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition text-[11px] flex-shrink-0"
              aria-label="Watch on YouTube"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 4. Resume Position Notification */}
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

      {/* 5. Main Player Mount Container (Hidden in fallback mode) */}
      <div
        ref={wrapperRef}
        className={`w-full h-full ${isFallbackMode ? 'hidden' : 'block'}`}
      />
    </div>
  );
};

export interface VideoChapter {
  time: number; // in seconds
  title: string;
  lessonId?: string;
  summary: string;
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
  watchUrl: string;
  chapters: VideoChapter[];
}

export const CHAPTERS_RAW = `
https://www.youtube.com/watch?v=zJ-LqeX_fLU
`;

/**
 * Match chapter title to existing lesson ID by keywords
 */
export function matchLessonId(title: string): string | undefined {
  const lower = title.toLowerCase();

  // Lesson 1: Meet the Board
  if (lower.includes('parts of arduino uno') || lower.includes('technical specifications') || lower.includes('meet the board')) {
    return 'lesson-1';
  }
  // Lesson 2: Blink an LED
  if (lower.includes('digitalwrite and delay') || lower.includes('digitalwrite') || lower.includes('pinmode') || lower.includes('blink an led')) {
    return 'lesson-2';
  }
  // Lesson 3: Push a Button
  if (lower.includes('digitalread') || lower.includes('input & output') || lower.includes('input and output') || lower.includes('push a button')) {
    return 'lesson-3';
  }
  // Lesson 4: Turn a Knob
  if (lower.includes('analogread') || lower.includes('analog to digital converter') || lower.includes('turn a knob')) {
    return 'lesson-4';
  }
  // Lesson 5: Mix Colours
  if (lower.includes('analogwrite') || lower.includes('pwm') || lower.includes('mix colours') || lower.includes('mix colors')) {
    return 'lesson-5';
  }

  return undefined;
}

/**
 * Parses timestamped chapter text (e.g. "12:34 Title" or "1:02:15 Title") into VideoChapter[]
 */
export function parseChapters(raw: string): VideoChapter[] {
  const lines = raw.split('\n');
  const chapters: VideoChapter[] = [];

  // Regex matching: (HH:)?MM:SS followed by title
  // Example: "12:34 Title", "1:02:15 Parts of Arduino Uno", "00:00 - Intro"
  const lineRegex = /^\s*(?:(?:(\d{1,2}):)?(\d{1,2}):(\d{2}))\s*[-–:]?\s*(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(lineRegex);
    if (match) {
      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const title = match[4].trim() || `Chapter at ${match[0].split(' ')[0]}`;

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const lessonId = matchLessonId(title);

      chapters.push({
        time: totalSeconds,
        title,
        lessonId,
        summary: title
      });
    }
  }

  // If no timestamped lines found (placeholder or URL only), return single default chapter
  if (chapters.length === 0) {
    return [
      {
        time: 0,
        title: 'Full video',
        summary: 'Chapters not added yet'
      }
    ];
  }

  // Ensure chapters are sorted chronologically
  chapters.sort((a, b) => a.time - b.time);
  return chapters;
}

export const ARDUINO_BEGINNER_VIDEO: VideoItem = {
  id: 'arduino-fcc-beginners',
  title: 'Arduino Course for Beginners',
  channel: 'freeCodeCamp.org, by Ashish Bansal',
  youtubeId: 'zJ-LqeX_fLU',
  watchUrl: 'https://youtu.be/zJ-LqeX_fLU',
  chapters: parseChapters(CHAPTERS_RAW)
};

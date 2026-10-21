import { describe, it, expect } from 'vitest';
import { parseChapters, matchLessonId, CHAPTERS_RAW, ARDUINO_BEGINNER_VIDEO } from '../src/data/videos';
import { formatTime } from '../src/components/video/VideoPlayer';

describe('Videos Data & Chapter Parser', () => {
  it('returns single "Full video" chapter when raw text is placeholder without timestamps', () => {
    const chapters = parseChapters('https://www.youtube.com/watch?v=zJ-LqeX_fLU');
    expect(chapters.length).toBe(1);
    expect(chapters[0].title).toBe('Full video');
    expect(chapters[0].time).toBe(0);
    expect(chapters[0].summary).toBe('Chapters not added yet');
    expect(chapters[0].lessonId).toBeUndefined();
  });

  it('correctly parses full course chapters from CHAPTERS_RAW', () => {
    const chapters = parseChapters(CHAPTERS_RAW);
    expect(chapters.length).toBeGreaterThan(50);
    expect(chapters[0].title).toContain('Objective of the course');
  });

  it('correctly parses MM:SS and HH:MM:SS timestamps to seconds', () => {
    const raw = `
      0:00 Course Introduction
      12:34 Technical Specifications
      1:02:15 digitalWrite and delay
      2:15:30 General Electronics Q&A
    `;
    const chapters = parseChapters(raw);
    expect(chapters.length).toBe(4);

    expect(chapters[0].time).toBe(0);
    expect(chapters[0].title).toBe('Course Introduction');

    expect(chapters[1].time).toBe(12 * 60 + 34); // 754
    expect(chapters[1].title).toBe('Technical Specifications');
    expect(chapters[1].lessonId).toBe('lesson-1'); // matches Technical Specifications -> lesson-1

    expect(chapters[2].time).toBe(3600 + 2 * 60 + 15); // 3735
    expect(chapters[2].title).toBe('digitalWrite and delay');
    expect(chapters[2].lessonId).toBe('lesson-2'); // matches digitalWrite and delay -> lesson-2

    expect(chapters[3].time).toBe(2 * 3600 + 15 * 60 + 30); // 8130
    expect(chapters[3].lessonId).toBeUndefined(); // no match
  });

  it('matches lesson keywords accurately', () => {
    expect(matchLessonId('Parts of Arduino Uno')).toBe('lesson-1');
    expect(matchLessonId('pinMode and LED setup')).toBe('lesson-2');
    expect(matchLessonId('digitalRead with Button')).toBe('lesson-3');
    expect(matchLessonId('Analog to Digital Converter')).toBe('lesson-4');
    expect(matchLessonId('analogWrite with PWM')).toBe('lesson-5');
    expect(matchLessonId('Installing the IDE')).toBeUndefined();
  });

  it('formats seconds into readable MM:SS and HH:MM:SS strings', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(754)).toBe('12:34');
    expect(formatTime(3735)).toBe('1:02:15');
    expect(formatTime(-5)).toBe('00:00');
  });

  it('contains valid YouTube video ID and channel info', () => {
    expect(ARDUINO_BEGINNER_VIDEO.youtubeId).toBe('zJ-LqeX_fLU');
    expect(ARDUINO_BEGINNER_VIDEO.watchUrl).toContain('zJ-LqeX_fLU');
    expect(ARDUINO_BEGINNER_VIDEO.channel).toContain('freeCodeCamp.org');
  });
});

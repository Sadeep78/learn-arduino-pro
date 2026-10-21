import { describe, it, expect } from 'vitest';
import { LESSONS } from '../src/data/lessons';
import { COMPONENTS_CATALOG } from '../src/data/componentsCatalog';

describe('Curriculum Lessons Integrity', () => {
  it('contains all 11 beginner lessons with sequential numbering', () => {
    expect(LESSONS.length).toBe(11);
    LESSONS.forEach((lesson, index) => {
      expect(lesson.number).toBe(index + 1);
      expect(lesson.id).toBe(`lesson-${index + 1}`);
      expect(lesson.title).toBeTruthy();
      expect(lesson.codeSnippet).toContain('void setup');
      expect(lesson.codeSnippet).toContain('void loop');
    });
  });

  it('verifies every lesson has checkpoints and quiz questions', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson.checkpoints.length).toBeGreaterThanOrEqual(1);
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);

      lesson.quiz.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation).toBeTruthy();
      });
    });
  });

  it('checks components catalog completeness', () => {
    expect(COMPONENTS_CATALOG.length).toBeGreaterThanOrEqual(10);
    COMPONENTS_CATALOG.forEach((comp) => {
      expect(comp.id).toBeTruthy();
      expect(comp.name).toBeTruthy();
      expect(comp.pinout.length).toBeGreaterThan(0);
      expect(comp.datasheetSummary.operatingVoltage).toBeTruthy();
    });
  });
});

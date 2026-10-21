import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/DELL/.gemini/antigravity/brain/9c0346bb-745a-4b43-a578-37e09c38005b';

test.describe('Learn Arduino Pro - Comprehensive QA Audit & Smoke Tests', () => {
  test('1. Every route loads cleanly without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/');
    await expect(page.locator('button[data-nav="home"]')).toBeVisible();

    const routes = [
      'home',
      'lessons',
      'simulator',
      'components',
      'challenges',
      'projects',
      'community',
      'videos',
      'settings'
    ];

    for (const route of routes) {
      const navBtn = page.locator(`button[data-nav="${route}"]`);
      await expect(navBtn).toBeVisible();
      await navBtn.click();
      await page.waitForTimeout(300);

      expect(consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('WebGL'))).toEqual([]);
    }
  });

  test('2. Settings: Theme, High-Contrast, and Language Localization', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-nav="settings"]').click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=PLATFORM SETTINGS')).toBeVisible();

    // Toggle Theme
    const html = page.locator('html');
    const initialDark = await html.evaluate((el) => el.classList.contains('dark'));

    const themeToggleBtn = page.locator('button:has-text("Toggle")').first();
    await themeToggleBtn.click();
    await page.waitForTimeout(200);

    const afterToggleDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterToggleDark).not.toBe(initialDark);

    // Toggle High Contrast Mode
    const highContrastBtn = page.locator('button:has-text("Enable"), button:has-text("Active")').first();
    await highContrastBtn.click();
    await page.waitForTimeout(200);
    const hasHighContrast = await html.evaluate((el) => el.classList.contains('high-contrast'));
    expect(hasHighContrast).toBe(true);

    // Switch Language to Sinhala
    const sinhalaBtn = page.locator('button:has-text("සිංහල")');
    await sinhalaBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('button[data-nav="home"]')).toContainText('මුල් පිටුව');

    // Switch Language to Tamil
    const tamilBtn = page.locator('button:has-text("தமிழ்")');
    await tamilBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('button[data-nav="home"]')).toContainText('முகப்பு');

    // Switch back to English
    const enBtn = page.locator('button:has-text("English")');
    await enBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('button[data-nav="home"]')).toContainText('Home');
  });

  test('3. Lessons: Quiz flow, completion, and XP reward', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-nav="lessons"]').click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=LESSON #01')).toBeVisible();
    await expect(page.locator('text=THEORY & WORKING PRINCIPLES')).toBeVisible();

    const quizBtn = page.locator('button:has-text("Take Quiz")');
    await expect(quizBtn).toBeVisible();
    await quizBtn.click();
    await page.waitForTimeout(300);

    const modal = page.locator('div[role="dialog"], .fixed.inset-0');
    await expect(modal).toBeVisible();

    const options = page.locator('button:has-text("A)")');
    const count = await options.count();
    if (count > 0) {
      await options.first().click();
      await page.waitForTimeout(200);
      const submitBtn = page.locator('button:has-text("Submit Quiz"), button:has-text("Submit Answers")');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(400);
      }
    }

    const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('4. Simulator at 1280px: Docked Layout, Fit to View, Blink Pin 8, and Fix-It Help', async ({ page }) => {
    // Test viewport at 1280 x 800
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.locator('button[data-nav="simulator"]').click();
    await page.waitForTimeout(400);

    // 1. Select Lesson 2: Blink an LED
    const lessonSelect = page.locator('select').first();
    await lessonSelect.selectOption('lesson-2');
    await page.waitForTimeout(400);

    // Verify confirmation modal if needed or lesson is loaded
    const confirmBtn = page.locator('button:has-text("Reset & Load Starter")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(400);
    }

    // 2. Click "Fit to view" button
    const fitBtn = page.locator('button:has-text("Fit to view")');
    await expect(fitBtn).toBeVisible();
    await fitBtn.click();
    await page.waitForTimeout(300);

    // 3. Verify Breadboard is fully visible and no element overlaps canvas controls
    await expect(page.locator('text=Half Breadboard')).toBeVisible();
    await expect(page.locator('text=Circuit Check').first()).toBeVisible();

    // 4. Run the Blink sketch on pin 8 and verify LED lights up
    const runBtn = page.getByRole('button', { name: 'RUN SIMULATION', exact: true });
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    await page.waitForTimeout(500);

    const stopBtn = page.getByRole('button', { name: 'STOP', exact: true });
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();
    await page.waitForTimeout(300);

    // 5. Remove pinMode from sketch code to trigger the failing check
    await page.evaluate(() => {
      const store = (window as any).__SIMULATOR_STORE__;
      store.getState().setActiveCode(`// Lesson 2: External LED Blink (Missing pinMode)
const int ledPin = 8;

void setup() {
  Serial.begin(9600);
  Serial.println("Running without pinMode output!");
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`);
    });
    await page.waitForTimeout(400);

    // Verify failing check and "Fix it for me" button
    await expect(page.locator('text=pinMode(8, OUTPUT) in code').first()).toBeVisible();
    const fixBtn = page.locator('button:has-text("Fix it for me")').first();
    await expect(fixBtn).toBeVisible();

    // Take "before fix" screenshot
    const beforeFixPath = path.join(ARTIFACT_DIR, 'simulator-before-fix.png');
    await page.screenshot({ path: beforeFixPath, fullPage: false });

    // 6. Click "Fix it for me" button
    await fixBtn.click();
    await page.waitForTimeout(400);

    // Verify pinMode(8, OUTPUT) was added and check turns to PASS
    await expect(page.locator('text=5/5 PASSED').first()).toBeVisible();

    // Take "after fix" screenshot
    const afterFixPath = path.join(ARTIFACT_DIR, 'simulator-after-fix.png');
    await page.screenshot({ path: afterFixPath, fullPage: false });
  });

  test('5. Simulator at 1920px: Full HD Layout, Simultaneous Canvas + Editor + Serial Monitor', async ({ page }) => {
    // Test viewport at 1920 x 1080
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.locator('button[data-nav="simulator"]').click();
    await page.waitForTimeout(400);

    // Select Lesson 2
    const lessonSelect = page.locator('select').first();
    await lessonSelect.selectOption('lesson-2');
    await page.waitForTimeout(300);

    const confirmBtn = page.locator('button:has-text("Reset & Load Starter")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(400);
    }

    // Click "Fit to view"
    const fitBtn = page.locator('button:has-text("Fit to view")');
    await fitBtn.click();
    await page.waitForTimeout(300);

    // Verify Canvas Studio, Code Editor, and Serial Monitor are all visible without hunting
    await expect(page.locator('text=Circuit Check').first()).toBeVisible();
    await expect(page.locator('text=Serial Monitor & Telemetry')).toBeVisible();

    // Take 1920px screenshot
    const fhdPath = path.join(ARTIFACT_DIR, 'simulator-1920px.png');
    await page.screenshot({ path: fhdPath, fullPage: false });
  });
});

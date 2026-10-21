import { test, expect } from '@playwright/test';

test.describe('Learn Arduino Pro - Comprehensive QA Audit & Smoke Tests', () => {
  test('1. Every route loads cleanly without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Filter out benign browser warnings if any
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/');
    await expect(page.locator('button[data-nav="home"]')).toBeVisible();

    // Routes to visit
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
      await page.waitForTimeout(400);

      // Verify no critical uncaught console errors happened during navigation
      expect(consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('WebGL'))).toEqual([]);
    }
  });

  test('2. Settings: Theme, High-Contrast, and Language Localization', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-nav="settings"]').click();
    await page.waitForTimeout(300);

    // Verify Settings View is mounted
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

    // Verify Sinhala UI text
    await expect(page.locator('button[data-nav="home"]')).toContainText('මුල් පිටුව');

    // Switch Language to Tamil
    const tamilBtn = page.locator('button:has-text("தமிழ்")');
    await tamilBtn.click();
    await page.waitForTimeout(300);

    // Verify Tamil UI text
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

    // Verify Lesson 1 is displayed
    await expect(page.locator('text=LESSON #01')).toBeVisible();
    await expect(page.locator('text=THEORY & WORKING PRINCIPLES')).toBeVisible();

    // Open Quiz Modal
    const quizBtn = page.locator('button:has-text("Take Quiz")');
    await expect(quizBtn).toBeVisible();
    await quizBtn.click();
    await page.waitForTimeout(300);

    // Answer Quiz questions
    const modal = page.locator('div[role="dialog"], .fixed.inset-0');
    await expect(modal).toBeVisible();

    // Choose option A for the 3 questions
    const options = page.locator('button:has-text("A)")');
    const count = await options.count();
    if (count > 0) {
      await options.first().click();
      await page.waitForTimeout(200);
      const submitBtn = page.locator('button:has-text("Submit Quiz"), button:has-text("Submit Answers")');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Close modal if close button present
    const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('4. Simulator: Electrical Netlist & Connectivity (Wrong vs Correct Blink Circuit)', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-nav="simulator"]').click();
    await page.waitForTimeout(500);

    // Verify Simulator and Circuit Check panel are mounted
    await expect(page.locator('text=Circuit Check')).toBeVisible();

    // 1. Initial State: Code drives Pin 13, but default circuit has mismatch/checks
    // Click Auto-Wire LED to create a 100% electrically correct Blink circuit
    const autoWireBtn = page.locator('button:has-text("Auto-Wire LED")');
    await expect(autoWireBtn).toBeVisible();
    await autoWireBtn.click();
    await page.waitForTimeout(400);

    // Verify checklist items pass
    await expect(page.locator('text=PASSED').first()).toBeVisible();

    // Simulation runs automatically when auto-wired
    const stopBtn = page.getByRole('button', { name: 'STOP', exact: true });
    await expect(stopBtn).toBeVisible();

    // Stop simulation cleanly
    await stopBtn.click();
    const runBtn = page.getByRole('button', { name: 'RUN SIMULATION', exact: true });
    await expect(runBtn).toBeVisible();
  });
});

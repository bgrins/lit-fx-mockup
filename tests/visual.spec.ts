import { test, expect } from '@playwright/test';

test.describe('Firefox UI Visual Tests', () => {
  test('basic window layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for the Firefox window component to be fully rendered
    await page.waitForSelector('firefox-window');
    
    // Take a screenshot for visual comparison
    await expect(page).toHaveScreenshot('firefox-window-basic.png', {
      fullPage: true,
    });
  });
});
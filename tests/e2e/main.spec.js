import { test, expect } from '@playwright/test';

test.describe('Color Bandit E2E', () => {
  test('page should load and chromancy should be available', async ({
    page,
  }) => {
    // Create a simple HTML page that loads the built library
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <img id="test-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" alt="test">
          <script type="module">
            import { chromancy } from '../../dist/chromancy.js';
            window.chromancy = chromancy;
          </script>
        </body>
      </html>
    `);

    // Wait a moment for module to load
    await page.waitForTimeout(500);

    const banditExists = await page.evaluate(
      () => typeof window.chromancy === 'function'
    );
    expect(banditExists).toBe(true);
  });
});

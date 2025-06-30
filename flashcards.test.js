import flashcards from '../../data/flashcards.json';

// Helper function to check if an element is visible
const isElementVisible = async (selector) => {
  return await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return !element.classList.contains('hidden') && style.display !== 'none' && element.offsetHeight > 0;
  }, selector);
};

describe('Tab Switching Check', () => {
  // using jest-puppeteer global page
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL);
  });

  test('data-tab "flashcards" exists', async () => {
    const exists = await page.$('.tab-item[data-tab="flashcards"]') !== null;
    expect(exists).toBe(true);
  });

  test('Sidebar contains Flashcards', async () => {
    const element = await page.$('.tab-item[data-tab="flashcards"]');
    const text = await element?.evaluate(el => el.textContent);
    expect(text).toContain('Flashcards');
  });

  test('Flashcards section exists', async () => {
    const exists = await page.$('section.content-section#flashcards') !== null;
    expect(exists).toBe(true);
  });

  test('Initial state shows #home content, hides other tabs', async () => {
    const topDisplay = await page.$eval('#home', el => window.getComputedStyle(el).display);
    const converterTabDisplay = await page.$eval('#converter', el => window.getComputedStyle(el).display);
    const flashcardsTabDisplay = await page.$eval('#flashcards', el => window.getComputedStyle(el).display);

    expect(topDisplay).not.toBe('none');
    expect(converterTabDisplay).toBe('none');
    expect(flashcardsTabDisplay).toBe('none');
  });

  test('Clicking Flashcards tab shows its content, hides others', async () => {
    await page.click('.tab-item[data-tab="flashcards"]');

    const topDisplay = await page.$eval('#home', el => window.getComputedStyle(el).display);
    const converterTabDisplay = await page.$eval('#converter', el => window.getComputedStyle(el).display);
    const flashcardsTabDisplay = await page.$eval('#flashcards', el => window.getComputedStyle(el).display);

    expect(topDisplay).toBe('none');
    expect(converterTabDisplay).toBe('none');
    expect(flashcardsTabDisplay).not.toBe('none');
  });
});

describe('Flashcards Display Check', () => {
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL);
    await page.click('.tab-item[data-tab="flashcards"]');
  });

  test('Word list displays correctly', async () => {
    await page.waitForSelector('#flashcards-list');
    const flashcardsItems = await page.$$eval('.flashcard', items => items.map(item => item.textContent));
    expect(flashcardsItems.length).toBeGreaterThan(0);
  });
});

describe('Flashcards Toggle Meaning Check', () => {
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL);
    await page.click('.tab-item[data-tab="flashcards"]');
  });

  test('Word meaning can be displayed', async () => {
    const wordId = flashcards[0].id;
    await page.waitForSelector(`button.flashcard-meaning[data-toggle="${wordId}"]`);

    await page.evaluate((selector) => {
      const btn = document.querySelector(selector);
      if (btn) btn.click();
    }, `button.flashcard-meaning[data-toggle="${wordId}"]`);

    const isVisible = await page.evaluate((id) => {
      const elem = document.querySelector(`div[data-meaning="${id}"]`);
      if (!elem) return false;
      const style = window.getComputedStyle(elem);
      return style && style.display !== 'none';
    }, wordId);

    expect(isVisible).toBe(true);
  });
});


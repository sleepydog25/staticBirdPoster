import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, url = '/?intro=replay') {
  await page.goto(url);
  await expect(page.locator('.poster')).toBeAttached();
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
}

async function scrollScene(page: Page, scene: number) {
  await page.evaluate(value => window.scrollTo(0, document.querySelector<HTMLElement>('.opening-viewport')!.clientHeight * value), scene);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
}

test('scrub, reverse, threat sequence, assembly and exact layout handoff', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  const poster = page.locator('.poster');
  await expect(poster).toHaveAttribute('inert', '');
  const bird = page.locator('[data-traveler="bird1"]');
  const start = await bird.boundingBox();
  await page.screenshot({ path: info.outputPath('01-peaceful.png') });
  await scrollScene(page, .7);
  const flight = await bird.boundingBox();
  expect(flight!.x).toBeGreaterThan(start!.x);
  const paused = await bird.getAttribute('style');
  await page.waitForTimeout(250);
  expect(await bird.getAttribute('style')).toBe(paused);
  await scrollScene(page, 0);
  expect((await bird.boundingBox())!.x).toBeCloseTo(start!.x, 0);

  for (const [id, progress] of [['window', 1.17], ['cat', 1.5], ['poison', 1.83]] as const) {
    await scrollScene(page, progress);
    await expect(page.locator(`[data-caption="${id}"]`)).toHaveCSS('opacity', '1');
    await expect(page.locator(`[data-traveler="${id}"]`)).toBeVisible();
    for (const other of ['window', 'cat', 'poison'].filter(value => value !== id)) {
      await expect(page.locator(`[data-caption="${other}"]`)).toHaveCSS('opacity', '0');
    }
    await noOverflow(page);
    await page.screenshot({ path: info.outputPath(`02-${id}.png`) });
  }
  await scrollScene(page, 2.6);
  await page.screenshot({ path: info.outputPath('03-assembled.png') });
  // Identical image rectangles at swap, including object-fit letterboxing.
  for (const [id, selector] of [['leftGreen', '.hero-leaves-left'], ['leftFlower', '.flower-white-large img'], ['window', '.trap-window img'], ['poison', '.trap-poison img']]) {
    const moving = await page.locator(`[data-traveler="${id}"]`).boundingBox();
    const actual = await page.locator(selector).boundingBox();
    for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(moving![key] - actual![key])).toBeLessThan(1.5);
  }
  await scrollScene(page, 3);
  await expect(poster).not.toHaveAttribute('inert', '');
  await expect(page.locator('.opening-shell')).toHaveClass(/opening-assembled/);
  await expect(page.getByRole('button', { name: '重播介紹' })).toBeVisible();
  await expect(page.locator('.swallow-one')).toHaveCSS('animation-name', 'fly-one');
  const final = await poster.boundingBox();
  expect(Math.abs(final!.y)).toBeLessThan(1.5);
  await page.screenshot({ path: info.outputPath('04-poster.png') });
  await noOverflow(page);
  // Re-enter the opening from the live poster; restore all earlier states.
  await scrollScene(page, 1.5);
  await expect(poster).toHaveAttribute('inert', '');
  await expect(page.locator('[data-caption="cat"]')).toHaveCSS('opacity', '1');
  await scrollScene(page, 3);
  await page.goto('/?intro=off');
  await expect(page.locator('.opening-viewport')).toHaveCount(0);
  const baseline = await poster.boundingBox();
  expect(final!.width).toBeCloseTo(baseline!.width, 0);
  expect(final!.height).toBeCloseTo(baseline!.height, 0);
  expect(errors).toEqual([]);
});

test('skip mid-story, session bypass, replay and keyboard focus', async ({ page }) => {
  await ready(page, '/');
  await scrollScene(page, 1.5);
  await page.getByRole('button', { name: '跳過介紹' }).click();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.poster')).not.toHaveAttribute('inert', '');
  await expect(page.locator('.poster')).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.reload();
  await expect(page.locator('.opening-viewport')).toHaveCount(0);
  await page.getByRole('button', { name: '重播介紹' }).click();
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await expect(page.getByRole('button', { name: '跳過介紹' })).toBeFocused();
  await scrollScene(page, 3);
  await page.getByRole('button', { name: '重播介紹' }).click();
  await expect(page.locator('.poster')).toHaveAttribute('inert', '');
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('reduced motion at load and mid-story removes pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.poster')).not.toHaveAttribute('inert', '');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: '重播介紹' }).click();
  await scrollScene(page, 1.8);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.poster')).not.toHaveAttribute('aria-hidden', 'true');
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('responsive refresh preserves progress and handoff', async ({ page }) => {
  await ready(page);
  await scrollScene(page, 1.5);
  for (const width of [320, 430, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page.locator('[data-caption="cat"]')).toHaveCSS('opacity', '1');
    await noOverflow(page);
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
  }
  await scrollScene(page, 3);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.poster')).not.toHaveAttribute('inert', '');
  await noOverflow(page);
});

test('direct fragment links and blocked session storage remain usable', async ({ page }) => {
  await ready(page, '/#traps-title');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await ready(page, '/');
  await page.getByRole('button', { name: '跳過介紹' }).click();
  await expect(page.locator('.poster')).not.toHaveAttribute('inert', '');
});

test('existing configured links can be hovered and clicked after handoff', async ({ page, context }) => {
  // Exercise ConfigurableLink without changing the user's unconfigured URLs.
  await page.route('**/src/config/links.ts*', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('rescueMap: ""', 'rescueMap: "http://127.0.0.1:5175/?intro=off"') });
  });
  await ready(page);
  await scrollScene(page, 3);
  const link = page.getByRole('link', { name: '台灣野生動物救傷地圖' });
  await expect(link).toHaveAttribute('target', '_blank');
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await expect(link).toHaveCSS('background-color', 'rgb(228, 232, 208)');
  const popupPromise = context.waitForEvent('page');
  await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toContain('intro=off');
  await popup.close();
});

test('native wheel, keyboard or touch input advances the story', async ({ page, context }, info) => {
  await ready(page);
  const start = await page.locator('[data-traveler="bird1"]').boundingBox();
  if (info.project.use.hasTouch) {
    const session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 600 }] });
    for (const y of [550, 480, 400, 320, 220]) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.wheel(0, 220);
    await page.keyboard.press('PageDown');
  }
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await expect.poll(async () => (await page.locator('[data-traveler="bird1"]').boundingBox())!.x).toBeGreaterThan(start!.x);
  await noOverflow(page);
});

const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const siteOrigin = new URL(
  process.env.SITE_URL || "http://localhost:4000/MengfeiLi.github.io/"
).origin;

const routes = [
  "/",
  "/publications/",
  "/publication/2025-experience-based-learning-smes",
  "/talks/",
  "/cv/",
  "/zh/",
  "/publication/2026-distribution-shift-alignment",
  "/talks/2025-07-informs-international-structural-forest",
  "/404.html",
];

for (const route of routes) {
  test(`${route} renders without browser or accessibility errors`, async ({ page }) => {
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("requestfailed", (request) => {
      browserErrors.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    page.on("response", (response) => {
      const status = response.status();
      if (
        status >= 400 &&
        new URL(response.url()).origin === siteOrigin
      ) {
        browserErrors.push(`${response.url()}: HTTP ${status}`);
      }
    });

    await page.goto(`.${route}`, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    expect(browserErrors).toEqual([]);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("theme control updates state and persists the choice", async ({ page }) => {
  await page.goto("./");
  const button = page.getByRole("button", { name: /Switch to .* theme/ });
  const initial = await page.locator("html").getAttribute("data-theme");
  await button.focus();
  await page.keyboard.press("Enter");
  const changed = await page.locator("html").getAttribute("data-theme");
  expect(changed).not.toBe(initial);
  await page.reload();
  if (changed === "dark") {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  } else {
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  }
});

test("responsive layouts avoid horizontal overflow", async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("./");
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    if (viewport.width <= 390) {
      const marketTop = await page
        .locator(".home-profile__market")
        .evaluate((node) => node.getBoundingClientRect().top);
      const portraitTop = await page
        .locator(".home-profile__portrait")
        .evaluate((node) => node.getBoundingClientRect().top);
      expect(marketTop).toBeLessThan(portraitTop);
    }
  }
});

test("mobile overflow navigation is keyboard operable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("./");
  const menu = page.locator(".greedy-nav__toggle");
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});

test("CV language-specific downloads resolve", async ({ page, request }) => {
  await page.goto("./cv/");
  for (const filename of ["Mengfei-Li-CV-English.pdf", "Mengfei-Li-CV.pdf"]) {
    const link = page.locator(`a[download="${filename}"]`);
    await expect(link).toBeVisible();
    const response = await request.get(await link.getAttribute("href"));
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
});

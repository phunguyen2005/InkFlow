import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import source from "../../src/features/library/mock/content-source.json" with { type: "json" };

test("discovery, search URLs, reading, saved state and author journey", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "EXPLORE", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Discover the story" }).click();
  await expect(
    page.getByRole("heading", {
      name: "The Blood Orchard",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save to library", exact: true })
    .click();
  await expect(page.getByText("Saved on this device.").first()).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /Start reading/ }).click();
  await expect(
    page.getByRole("heading", { name: "The Name in the Trees" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reading appearance", exact: true })
    .click();
  await page.getByRole("radio", { name: "Dark", exact: true }).check();
  await page.getByRole("button", { name: "Increase font size" }).click();
  await page.getByRole("button", { name: "Close Reading appearance" }).click();
  await expect(page.locator(".reader-shell")).toHaveClass(/theme-dark/);
  await page.reload();
  await expect(page.locator(".reader-shell")).toHaveClass(/theme-dark/);
  await page.getByRole("link", { name: "Next chapter" }).click();
  await expect(
    page.getByRole("heading", { name: "An Inheritance of Silence" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Next chapter" }).click();
  await expect(
    page.getByRole("heading", { name: "The Door That Remembers" }),
  ).toBeVisible();
  await page.locator(".reader-back").click();
  await page.getByRole("link", { name: /By Mara Voss/ }).click();
  await expect(page.getByRole("heading", { name: "Mara Voss" })).toBeVisible();
  await page.goto("/explore");
  await page.getByRole("textbox", { name: "Search catalog" }).fill("Mara Voss");
  await page
    .locator(".explore-controls")
    .getByRole("button", { name: "Search", exact: true })
    .click();
  await expect(page).toHaveURL(/q=Mara\+Voss/);
  await expect(page.locator(".story-result")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Search catalog" }),
  ).toHaveValue("Mara Voss");
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator(".story-result")).toHaveCount(12);
  await page.goBack();
  await expect(page.locator(".story-result")).toHaveCount(1);
});
test("multi filters, empty results and chapter ownership", async ({ page }) => {
  await page.goto("/explore");
  await page.locator("summary").click();
  await page.getByRole("checkbox", { name: "Romance", exact: true }).check();
  await page.getByRole("checkbox", { name: "Completed", exact: true }).check();
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/genre=romance/);
  await expect(page).toHaveURL(/status=completed/);
  await expect(page.locator(".story-result")).toHaveCount(2);
  await page.getByRole("button", { name: "Remove Romance filter" }).click();
  await expect(page).not.toHaveURL(/genre=romance/);
  await page.goto("/explore?q=no-such-book-ever");
  await expect(
    page.getByRole("heading", { name: "No stories match these filters." }),
  ).toBeVisible();
  const missing = await page.goto(
    "/stories/the-blood-orchard/chapters/not-a-chapter",
  );
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This chapter hasn't been written." }),
  ).toBeVisible();
});
test("reader tolerates broken or unavailable storage", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("inkflow:reader:v1", "{broken");
  });
  await page.goto("/stories/the-blood-orchard/chapters/chapter-1");
  await expect(page.locator(".reader-shell")).toHaveClass(/theme-sepia/);
  await page.evaluate(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
      configurable: true,
    });
  });
  await page
    .getByRole("button", { name: "Reading appearance", exact: true })
    .click();
  await page.getByRole("radio", { name: "White", exact: true }).check();
  await expect(
    page.getByText(
      "Preferences apply for this visit. Device storage is unavailable.",
    ),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".reader-shell")).toHaveClass(/theme-white/);
});
const routes = [
  ["home", "/"],
  ["explore", "/explore"],
  ["story", "/stories/the-blood-orchard"],
  ["reader", "/stories/the-blood-orchard/chapters/chapter-1"],
  ["author", "/authors/mara-voss"],
];
test("five screens at five widths render without overflow or broken images", async ({
  page,
}) => {
  test.setTimeout(300000);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    for (const [name, route] of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main h1").first()).toBeVisible();
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images]
            .filter((img) => img.getBoundingClientRect().top < innerHeight)
            .map((img) => img.decode().catch(() => {})),
        );
      });
      const dimensions = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      expect(dimensions.page, `${name} at ${width}`).toBeLessThanOrEqual(
        dimensions.viewport + 1,
      );
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter(
              (img) =>
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth === 0,
            )
            .map((img) => img.getAttribute("src")),
        );
      expect(broken).toEqual([]);
      await page.screenshot({
        path: `docs/qa/screenshots/${name}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
test("keyboard, dialog focus, reduced motion and accessibility", async ({
  page,
}) => {
  for (const [, route] of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Navigation", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Navigation", exact: true }),
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("all catalog destinations and original artwork exist", async ({
  request,
}) => {
  test.setTimeout(300000);
  for (const story of source.stories) {
    const response = await request.get(`/stories/${story.slug}`);
    expect(response.status(), story.slug).toBe(200);
    const cover = await request.get(`/mock/covers/${story.slug}.webp`);
    expect(cover.status()).toBe(200);
    expect(cover.headers()["content-type"]).toContain("image/webp");
    for (let i = 1; i <= 5; i++) {
      const chapter = await request.get(
        `/stories/${story.slug}/chapters/chapter-${i}`,
      );
      expect(chapter.status(), `${story.slug}/${i}`).toBe(200);
    }
  }
  for (const author of source.authors) {
    expect((await request.get(`/authors/${author.slug}`)).status()).toBe(200);
  }
});

test("hero slider navigation, controls, and layout stability", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause featured stories" }).click();
  const heroRail = page.locator(".hero-rail");
  await expect(heroRail).toBeVisible();

  // Verify counter like "1 / 4" is removed
  await expect(heroRail.locator(".hero-slide-counter")).toHaveCount(0);
  await expect(heroRail.getByText(/1\s*\/\s*4/)).toHaveCount(0);

  // Initial slide title
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText(
    "The Blood Orchard",
  );

  // Record vertical position of Start reading button
  const startReadingBtn = heroRail.getByRole("link", { name: /Start reading/ });
  const initialBox = await startReadingBtn.boundingBox();
  expect(initialBox).not.toBeNull();

  // Advance using Next button
  const nextBtn = page.getByRole("button", { name: "Next featured story" });
  await nextBtn.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText(
    "The Quiet Machine at Dawn",
  );

  // Check vertical stability (Y position should remain stable within 4px)
  const nextBox = await startReadingBtn.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(
    Math.abs((nextBox?.y || 0) - (initialBox?.y || 0)),
  ).toBeLessThanOrEqual(4);

  // Direct segment click
  const thirdSegment = page.getByRole("button", { name: /Show story 3:/ });
  await thirdSegment.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText(
    "A Map for Moonlight",
  );

  // Fourth segment
  const fourthSegment = page.getByRole("button", { name: /Show story 4:/ });
  await fourthSegment.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText(
    "The Lanterns of Briar Row",
  );

  // Previous button
  const prevBtn = page.getByRole("button", { name: "Previous featured story" });
  await prevBtn.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText(
    "A Map for Moonlight",
  );
});

test("hero advances only after the progress segment fills", async ({ page }) => {
  await page.goto("/");
  await page.mouse.move(0, 0);

  const progress = await page.evaluate(
    () =>
      new Promise<{ fill: number; track: number }>((resolve) => {
        const fill = document.querySelector<HTMLElement>(
          ".hero-segment.active .hero-segment-fill",
        );
        if (!fill) throw new Error("Active hero progress segment missing");
        fill.addEventListener(
          "animationend",
          () =>
            resolve({
              fill: fill.getBoundingClientRect().width,
              track: fill.parentElement!.getBoundingClientRect().width,
            }),
          { once: true },
        );
      }),
  );

  expect(progress.fill).toBeCloseTo(progress.track, 1);
  await expect(page.locator(".hero-rail h2")).toHaveText(
    "The Quiet Machine at Dawn",
  );
});

test("carousel remains paused while focused after the pointer leaves", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator(".hero");
  await hero.getByRole("link", { name: "Discover the story" }).focus();
  await hero.hover();
  await page.mouse.move(0, 0);
  await expect(hero).toHaveClass(/is-paused/);
  await page.waitForTimeout(6500);
  await expect(hero.getByRole("heading", { level: 2 })).toHaveText(
    "The Blood Orchard",
  );
  await page.getByRole("button", { name: "Pause featured stories" }).click();
  await page.locator(".skip-link").focus();
  await page.mouse.move(0, 0);
  await expect(hero).toHaveClass(/is-paused/);
  await page.getByRole("button", { name: "Play featured stories" }).click();
  await page.locator(".skip-link").focus();
  await page.mouse.move(0, 0);
  await expect(hero).not.toHaveClass(/is-paused/);
});

test("reader flushes pending progress on route exit and resumes the paragraph", async ({
  page,
}) => {
  await page.goto("/stories/the-blood-orchard/chapters/chapter-1");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.evaluate(() =>
        localStorage.getItem("inkflow:progress:v1:story-001"),
      ),
    )
    .not.toBeNull();
  await page
    .locator('[data-paragraph="4"]')
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "instant", block: "start" }),
    );
  // Wait for measurement, but leave before the 350ms storage debounce.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const backButton = await page.locator(".reader-back").boundingBox();
  if (!backButton) throw new Error("Reader navigation must remain visible while scrolling");
  await page.mouse.click(backButton.x + backButton.width / 2, backButton.y + backButton.height / 2);
  await expect(
    page.getByRole("heading", { name: "The Blood Orchard", level: 1 }),
  ).toBeVisible();
  const bookmark = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("inkflow:progress:v1:story-001") ?? "null"),
  );
  expect(bookmark.chapterSlug).toBe("chapter-1");
  expect(bookmark.paragraph).toBeGreaterThanOrEqual(3);
  await page.getByRole("link", { name: "Continue reading" }).click();
  await expect
    .poll(() =>
      page
        .locator(`[data-paragraph="${bookmark.paragraph}"]`)
        .evaluate((element) =>
          Math.abs(element.getBoundingClientRect().top - 90),
        ),
    )
    .toBeLessThan(40);
});

test("resume links only target chapters available in the current story", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "inkflow:progress:v1:story-001",
      JSON.stringify({ chapterSlug: "chapter-9", paragraph: 0 }),
    ),
  );
  await page.goto("/stories/the-blood-orchard");
  await expect(
    page.getByRole("link", { name: "Continue reading" }),
  ).toHaveCount(0);
});

test("reader progress indicator is hidden by default and toggleable in settings", async ({
  page,
}) => {
  await page.goto("/stories/the-blood-orchard/chapters/chapter-1");
  await page.evaluate(() => document.fonts.ready);

  // Hidden by default
  await expect(page.locator(".reader-percent")).toHaveCount(0);
  await expect(page.locator(".reader-progress")).toHaveCount(0);

  // Open settings
  await page
    .getByRole("button", { name: "Reading appearance", exact: true })
    .click();
  const toggle = page.getByRole("switch", { name: "Show reading progress" });
  await expect(toggle).not.toBeChecked();

  // Enable progress
  await toggle.check();
  await page.getByRole("button", { name: "Close Reading appearance" }).click();

  await expect(page.locator(".reader-progress")).toBeVisible();
  await expect(page.locator(".reader-percent")).toBeVisible();

  // Reload and verify persistence
  await page.reload();
  await expect(page.locator(".reader-progress")).toBeVisible();
  await expect(page.locator(".reader-percent")).toBeVisible();
});

test("story detail displays continue where you left off and chapter list progress", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "inkflow:progress:v1:story-001",
      JSON.stringify({
        storyId: "story-001",
        chapterId: "chapter-003",
        chapterSlug: "chapter-3",
        chapterRevisionId: "chapter-003-rev1",
        blockId: "block-chapter-003-2",
        paragraph: 2,
        offsetRatio: 0.35,
        percent: 35,
        completedChapterSlugs: ["chapter-1", "chapter-2"],
        updatedAt: new Date().toISOString(),
        lastReadAt: new Date().toISOString(),
      }),
    );
  });

  await page.goto("/stories/the-blood-orchard");

  // Verify prominent resume section
  await expect(page.getByText("Continue where you left off")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Continue reading" }),
  ).toBeVisible();

  // Verify chapter list indicators
  const chapterSection = page.locator(".chapter-section");
  await expect(
    chapterSection.locator(".chapter-status-pill.is-completed"),
  ).toHaveCount(2);
  await expect(
    chapterSection.locator(".chapter-status-pill.is-reading"),
  ).toHaveCount(1);
});

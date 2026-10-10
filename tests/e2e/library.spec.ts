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
    page.getByRole("heading", { name: "The Blood Orchard", exact: true, level: 1 }),
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
  await page.locator(".explore-controls").getByRole("button", { name: "Search", exact: true }).click();
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
      await expect(page.locator("h1")).toBeVisible();
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

test("hero slider navigation, controls, and layout stability", async ({ page }) => {
  await page.goto("/");
  const heroRail = page.locator(".hero-rail");
  await expect(heroRail).toBeVisible();

  // Verify counter like "1 / 4" is removed
  await expect(heroRail.locator(".hero-slide-counter")).toHaveCount(0);
  await expect(heroRail.getByText(/1\s*\/\s*4/)).toHaveCount(0);

  // Initial slide title
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText("The Blood Orchard");

  // Record vertical position of Start reading button
  const startReadingBtn = heroRail.getByRole("link", { name: /Start reading/ });
  const initialBox = await startReadingBtn.boundingBox();
  expect(initialBox).not.toBeNull();

  // Advance using Next button
  const nextBtn = page.getByRole("button", { name: "Next featured story" });
  await nextBtn.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText("The Quiet Machine at Dawn");

  // Check vertical stability (Y position should remain stable within 4px)
  const nextBox = await startReadingBtn.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(Math.abs((nextBox?.y || 0) - (initialBox?.y || 0))).toBeLessThanOrEqual(4);

  // Direct segment click
  const thirdSegment = page.getByRole("button", { name: /Show story 3:/ });
  await thirdSegment.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText("A Map for Moonlight");

  // Fourth segment
  const fourthSegment = page.getByRole("button", { name: /Show story 4:/ });
  await fourthSegment.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText("The Lanterns of Briar Row");

  // Previous button
  const prevBtn = page.getByRole("button", { name: "Previous featured story" });
  await prevBtn.click();
  await expect(heroRail.getByRole("heading", { level: 2 })).toHaveText("A Map for Moonlight");
});

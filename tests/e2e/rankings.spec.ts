import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("InkFlow Public Library Rankings Page (/rankings)", () => {
  test("1. Core Rendering: header, demo badge, Top 3 centerpiece, rows 4..20, and explainer", async ({
    page,
  }) => {
    await page.goto("/rankings");
    await page.evaluate(() => document.fonts.ready);

    // Document title
    await expect(page).toHaveTitle(/Rankings/);

    // Heading and demo honesty pill/disclaimer
    const heading = page.getByRole("heading", { name: "RANKINGS.", level: 1 });
    await expect(heading).toBeVisible();

    const demoPill = page.getByRole("status").filter({ hasText: "Demo chart" });
    await expect(demoPill).toBeVisible();

    await expect(
      page.getByText("Editorial demo ordering – not live reader activity."),
    ).toBeVisible();

    // Chart tabs container
    const chartTabsNav = page.getByRole("navigation", {
      name: "Ranking charts",
    });
    await expect(chartTabsNav).toBeVisible();
    await expect(
      chartTabsNav.getByRole("link", { name: "Trending" }),
    ).toHaveAttribute("aria-current", "page");

    // Top 3 centerpiece
    const topThreeSection = page.getByRole("region", {
      name: "Top ranked stories",
    });
    await expect(topThreeSection).toBeVisible();

    const topCards = topThreeSection.locator(".top-three-card");
    await expect(topCards).toHaveCount(3);

    // Verify ranks 01, 02, 03 numerals, titles, and authors
    for (let i = 0; i < 3; i++) {
      const card = topCards.nth(i);
      const expectedRank = `0${i + 1}`;
      await expect(card.locator(".top-three-numeral")).toHaveText(expectedRank);

      const titleLink = card.locator(".top-three-title a");
      await expect(titleLink).toBeVisible();
      const titleText = await titleLink.innerText();
      expect(titleText.trim().length).toBeGreaterThan(0);

      const authorLink = card.locator(".top-three-author");
      await expect(authorLink).toBeVisible();
      const authorText = await authorLink.innerText();
      expect(authorText.trim().length).toBeGreaterThan(0);

      // Genre label and metadata
      await expect(card.locator(".top-three-info .eyebrow")).toBeVisible();
      await expect(card.locator(".top-three-meta")).toBeVisible();
    }

    // Remainder rows section: Ranks 4..20 (17 rows for the 20-story catalog)
    const rowsSection = page.getByRole("region", {
      name: "Remaining charted stories",
    });
    await expect(rowsSection).toBeVisible();

    const rows = rowsSection.locator(".ranking-row");
    await expect(rows).toHaveCount(17);

    // Verify row 4 (first row in remaining list)
    const firstRow = rows.first();
    await expect(firstRow.locator(".ranking-row-num")).toHaveText("04");
    await expect(firstRow.locator(".ranking-row-thumb img")).toBeVisible();
    await expect(firstRow.locator(".ranking-row-title a")).toBeVisible();
    await expect(firstRow.locator(".ranking-row-author")).toBeVisible();
    await expect(firstRow.locator(".ranking-row-details .eyebrow")).toBeVisible();
    await expect(firstRow.locator(".ranking-row-status")).toBeVisible();
    await expect(firstRow.locator(".ranking-row-rating")).toBeVisible();

    // Verify last row has rank numeral 20
    const lastRow = rows.last();
    await expect(lastRow.locator(".ranking-row-num")).toHaveText("20");

    // How Rankings Work 3-column explainer block
    const explainerHeading = page.getByRole("heading", {
      name: /Editorial Standards · How Rankings Work/i,
    });
    await expect(explainerHeading).toBeVisible();
    await expect(page.getByText("What this is")).toBeVisible();
    await expect(page.getByText("What it isn't")).toBeVisible();
    await expect(page.getByText("What comes later")).toBeVisible();
  });

  test("2. Filter Navigation & SSR State Synchronization", async ({ page }) => {
    await page.goto("/rankings");

    const chartTabsNav = page.getByRole("navigation", {
      name: "Ranking charts",
    });
    const periodNav = page.getByRole("navigation", { name: "Time period" });
    const genreNav = page.getByRole("navigation", {
      name: "Filter by genre",
    });

    // Initial default state
    await expect(
      chartTabsNav.getByRole("link", { name: "Trending" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      periodNav.getByRole("link", { name: "This week" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      genreNav.getByRole("link", { name: "All genres" }),
    ).toHaveAttribute("aria-current", "page");

    // Step 1: Switch chart tab to "Most Read"
    const mostReadTab = chartTabsNav.getByRole("link", { name: "Most Read" });
    await mostReadTab.click();
    await expect(page).toHaveURL(/\/rankings\?chart=most-read$/);
    await expect(mostReadTab).toHaveAttribute("aria-current", "page");
    await expect(
      chartTabsNav.getByRole("link", { name: "Trending" }),
    ).not.toHaveAttribute("aria-current", "page");

    // Step 2: Switch period link to "This month"
    const monthPeriodLink = periodNav.getByRole("link", { name: "This month" });
    await monthPeriodLink.click();
    await expect(page).toHaveURL(/chart=most-read/);
    await expect(page).toHaveURL(/period=month/);
    await expect(monthPeriodLink).toHaveAttribute("aria-current", "page");

    // Step 3: Switch genre chip to "Fantasy"
    const fantasyChip = genreNav.getByRole("link", {
      name: "Fantasy",
      exact: true,
    });
    await fantasyChip.click();
    await expect(page).toHaveURL(/chart=most-read/);
    await expect(page).toHaveURL(/period=month/);
    await expect(page).toHaveURL(/genre=fantasy/);
    await expect(fantasyChip).toHaveAttribute("aria-current", "page");
    await expect(
      genreNav.getByRole("link", { name: "All genres" }),
    ).not.toHaveAttribute("aria-current", "page");

    // Step 4: Reload page and verify canonical SSR state preservation
    await page.reload();
    await expect(page).toHaveURL(/chart=most-read/);
    await expect(page).toHaveURL(/period=month/);
    await expect(page).toHaveURL(/genre=fantasy/);
    await expect(
      chartTabsNav.getByRole("link", { name: "Most Read" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      periodNav.getByRole("link", { name: "This month" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      genreNav.getByRole("link", { name: "Fantasy", exact: true }),
    ).toHaveAttribute("aria-current", "page");

    // Filtered stories: all displayed items must have genre "Fantasy" and be densely ranked starting at 01
    const firstTopNumeral = page.locator(".top-three-numeral").first();
    await expect(firstTopNumeral).toHaveText("01");

    const genreLabels = await page
      .locator(".rankings-top-three .eyebrow, .ranking-row .eyebrow")
      .allInnerTexts();
    for (const label of genreLabels) {
      expect(label.toLowerCase()).toContain("fantasy");
    }

    // Step 5: Reset genre back to "All genres"
    await genreNav.getByRole("link", { name: "All genres" }).click();
    await expect(page).toHaveURL(/\/rankings\?chart=most-read&period=month$/);
    await expect(
      genreNav.getByRole("link", { name: "All genres" }),
    ).toHaveAttribute("aria-current", "page");

    // Step 6: Return to default chart "Trending" and "This week" -> canonical /rankings (no query params)
    const trendingTab = chartTabsNav.getByRole("link", { name: "Trending" });
    await trendingTab.click();
    await expect(page).toHaveURL(/\/rankings\?period=month$/);
    await expect(trendingTab).toHaveAttribute("aria-current", "page");

    const weekPeriodLink = periodNav.getByRole("link", { name: "This week" });
    await weekPeriodLink.click();
    await expect(page).toHaveURL(/\/rankings$/);
    await expect(weekPeriodLink).toHaveAttribute("aria-current", "page");
  });

  test("3. Interactive Navigation: row navigation, author links, and header integration", async ({
    page,
  }) => {
    // 3A: Row click navigates to story detail
    await page.goto("/rankings");
    const firstRow = page.locator(".ranking-row").first();
    const storyTitle = (
      await firstRow.locator(".ranking-row-title").innerText()
    ).trim();

    await firstRow.locator(".ranking-row-stretched-link").click();
    await expect(page).toHaveURL(/\/stories\//);
    await expect(
      page.getByRole("heading", { level: 1, name: storyTitle }),
    ).toBeVisible();

    // 3B: Author link inside row navigates to author profile
    await page.goto("/rankings");
    const authorLink = page
      .locator(".ranking-row")
      .first()
      .locator(".ranking-row-author");
    const authorName = (await authorLink.innerText()).trim();

    await authorLink.click();
    await expect(page).toHaveURL(/\/authors\//);
    await expect(
      page.getByRole("heading", { level: 1, name: authorName }),
    ).toBeVisible();

    // 3C: Header "Rankings" navigation from homepage ("/")
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const desktopRankingsLink = page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Rankings", exact: true });
    await expect(desktopRankingsLink).toBeVisible();
    await desktopRankingsLink.click();
    await expect(page).toHaveURL(/\/rankings$/);
    await expect(desktopRankingsLink).toHaveAttribute("aria-current", "page");

    // 3D: Header "Rankings" navigation from explore page ("/explore")
    await page.goto("/explore");
    const desktopFromExplore = page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Rankings", exact: true });
    await expect(desktopFromExplore).toBeVisible();
    await desktopFromExplore.click();
    await expect(page).toHaveURL(/\/rankings$/);
    await expect(desktopFromExplore).toHaveAttribute("aria-current", "page");

    // 3E: Mobile menu "Rankings" navigation
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Navigation", exact: true }).click();
    const mobileRankingsLink = page
      .locator(".mobile-nav")
      .getByRole("link", { name: "Rankings", exact: true });
    await expect(mobileRankingsLink).toBeVisible();
    await mobileRankingsLink.click();
    await expect(page).toHaveURL(/\/rankings$/);
  });

  test("4. Keyboard Navigation: sequential tab order and visible focus states", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/rankings");
    await page.evaluate(() => document.fonts.ready);

    // Start focus from the skip-link
    await page.locator(".skip-link").focus();
    await expect(page.locator(".skip-link")).toBeFocused();

    // Tab through header navigation to main
    // Skip link -> Wordmark -> Desktop Nav (Library -> Rankings -> Community -> Studio)
    await page.keyboard.press("Tab"); // Wordmark
    await page.keyboard.press("Tab"); // Library
    await page.keyboard.press("Tab"); // Rankings
    await expect(
      page.locator(".desktop-nav").getByRole("link", { name: "Rankings" }),
    ).toBeFocused();

    // Advance focus into chart tabs
    const trendingTab = page
      .getByRole("navigation", { name: "Ranking charts" })
      .getByRole("link", { name: "Trending" });
    await trendingTab.focus();
    await expect(trendingTab).toBeFocused();

    // Tab to next chart tab
    await page.keyboard.press("Tab");
    const mostReadTab = page
      .getByRole("navigation", { name: "Ranking charts" })
      .getByRole("link", { name: "Most Read" });
    await expect(mostReadTab).toBeFocused();

    // Advance to period nav
    const weekPeriod = page
      .getByRole("navigation", { name: "Time period" })
      .getByRole("link", { name: "This week" });
    await weekPeriod.focus();
    await expect(weekPeriod).toBeFocused();

    // Advance to genre chips
    const allGenresChip = page
      .getByRole("navigation", { name: "Filter by genre" })
      .getByRole("link", { name: "All genres" });
    await allGenresChip.focus();
    await expect(allGenresChip).toBeFocused();

    // Advance into Top 3 cards
    const firstTopCoverLink = page
      .locator(".top-three-card")
      .first()
      .locator(".top-three-cover-link");
    await firstTopCoverLink.focus();
    await expect(firstTopCoverLink).toBeFocused();

    // Tab to title link
    await page.keyboard.press("Tab");
    const firstTopTitleLink = page
      .locator(".top-three-card")
      .first()
      .locator(".top-three-title a");
    await expect(firstTopTitleLink).toBeFocused();

    // Tab to author link
    await page.keyboard.press("Tab");
    const firstTopAuthorLink = page
      .locator(".top-three-card")
      .first()
      .locator(".top-three-author");
    await expect(firstTopAuthorLink).toBeFocused();

    // Focus on first ranking row stretched link
    const firstRowLink = page
      .locator(".ranking-row")
      .first()
      .locator(".ranking-row-stretched-link");
    await firstRowLink.focus();
    await expect(firstRowLink).toBeFocused();

    // Tab to author link inside the first ranking row
    await page.keyboard.press("Tab");
    const firstRowAuthorLink = page
      .locator(".ranking-row")
      .first()
      .locator(".ranking-row-author");
    await expect(firstRowAuthorLink).toBeFocused();

    // Verify focus outline presence on focused interactive element
    const outline = await firstRowAuthorLink.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    // Element has focus; verify outline or active state
    expect(outline.outlineStyle).not.toBe("none");
  });

  test("5. Responsive Layout & Zero Horizontal Overflow across 5 viewports", async ({
    page,
  }) => {
    test.setTimeout(180000);
    const viewports = [1440, 1024, 768, 390, 320];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
      await page.goto("/rankings");
      await page.evaluate(() => document.fonts.ready);
      await expect(
        page.getByRole("heading", { name: "RANKINGS.", level: 1 }),
      ).toBeVisible();

      // Wait for all above-fold images to complete decoding
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images]
            .filter((img) => img.getBoundingClientRect().top < window.innerHeight)
            .map((img) => img.decode().catch(() => {})),
        );
      });

      // Verify zero horizontal scroll overflow
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }));
      expect(
        dimensions.scrollWidth,
        `Horizontal overflow detected at viewport ${width}px: scrollWidth ${dimensions.scrollWidth} > innerWidth ${dimensions.viewportWidth}`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);

      // Verify no broken images on the page
      const brokenImages = await page.locator("img").evaluateAll((imgs) =>
        imgs
          .filter(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth === 0,
          )
          .map((img) => img.getAttribute("src")),
      );
      expect(brokenImages, `Broken images at ${width}px`).toEqual([]);
    }
  });

  test("6. Accessibility: Zero critical or serious Axe-Core violations", async ({
    page,
  }) => {
    // 6A: Audit default rankings page
    await page.goto("/rankings");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { name: "RANKINGS.", level: 1 }),
    ).toBeVisible();

    const defaultResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const defaultViolations = defaultResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => n.target),
    }));
    expect(defaultViolations).toEqual([]);

    // 6B: Audit filtered rankings page
    await page.goto("/rankings?chart=most-read&period=month&genre=fantasy");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { name: "RANKINGS.", level: 1 }),
    ).toBeVisible();

    const filteredResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const filteredViolations = filteredResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => n.target),
    }));
    expect(filteredViolations).toEqual([]);
  });
});

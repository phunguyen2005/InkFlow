import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Challenger 2 — Adversarial Rankings Stress Suite", () => {
  // =========================================================================
  // DIMENSION 1: Extreme Viewports Stress (280px, 320px, 360px, 1920px, 2560px)
  // =========================================================================
  test.describe("1. Extreme Viewports Stress", () => {
    const extremeViewports = [
      { name: "Ultra-narrow (Galaxy Fold)", width: 280, height: 653 },
      { name: "Minimum Mobile (iPhone SE)", width: 320, height: 568 },
      { name: "Compact Mobile (Android)", width: 360, height: 800 },
      { name: "Full HD Desktop", width: 1920, height: 1080 },
      { name: "Ultra-wide Desktop (2K)", width: 2560, height: 1440 },
    ];

    for (const vp of extremeViewports) {
      test(`Viewport ${vp.width}px (${vp.name}): zero horizontal overflow and layout integrity`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/rankings");
        await page.evaluate(() => document.fonts.ready);

        // Heading must be visible
        const heading = page.getByRole("heading", { name: "RANKINGS.", level: 1 });
        await expect(heading).toBeVisible();

        // 1. Strict document-level horizontal overflow check
        const docDimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          innerWidth: window.innerWidth,
        }));

        expect(
          docDimensions.scrollWidth,
          `Document horizontal overflow at ${vp.width}px: scrollWidth ${docDimensions.scrollWidth} > innerWidth ${docDimensions.innerWidth}`
        ).toBeLessThanOrEqual(docDimensions.innerWidth + 1);

        // 2. Check that main container does not overflow viewport
        const mainBounding = await page.locator("main#main").boundingBox();
        expect(mainBounding).not.toBeNull();
        if (mainBounding) {
          expect(mainBounding.width).toBeLessThanOrEqual(vp.width + 1);
        }

        // 3. Wide viewport max-width guard
        if (vp.width >= 1920) {
          const mainComputedWidth = await page.locator("main#main").evaluate((el) => {
            return parseFloat(window.getComputedStyle(el).width);
          });
          // Verify layout is constrained by max-width tokens and doesn't blow out
          expect(mainComputedWidth).toBeLessThanOrEqual(1440);
        }

        // 4. Ultra-narrow flex/grid checks
        if (vp.width <= 360) {
          // Period nav must not cause document overflow
          const periodNavBox = await page.locator(".rankings-period-nav").boundingBox();
          expect(periodNavBox).not.toBeNull();
          if (periodNavBox) {
            expect(periodNavBox.x + periodNavBox.width).toBeLessThanOrEqual(vp.width + 1);
          }

          // Top 3 card lead numeral must be visible and contained
          const leadNumeral = page.locator(".top-three-lead .top-three-numeral");
          await expect(leadNumeral).toBeVisible();

          // Ranking row 4 thumb & details must be visible
          const firstRow = page.locator(".ranking-row").first();
          await expect(firstRow.locator(".ranking-row-thumb")).toBeVisible();
          await expect(firstRow.locator(".ranking-row-details")).toBeVisible();
        }

        // 5. Ensure no images are broken
        const brokenImages = await page.locator("img").evaluateAll((imgs) =>
          imgs
            .filter(
              (img) =>
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth === 0
            )
            .map((img) => img.getAttribute("src"))
        );
        expect(brokenImages, `Broken images at ${vp.width}px`).toEqual([]);
      });
    }
  });

  // =========================================================================
  // DIMENSION 2: Sparse & Empty Genre States (1 story, 2 stories, all charts)
  // =========================================================================
  test.describe("2. Sparse and Empty Genre States", () => {
    test("Single-story genre (Thriller): Top 3 renders exactly 1 card, remainder is empty", async ({
      page,
    }) => {
      await page.goto("/rankings?genre=thriller");
      await page.evaluate(() => document.fonts.ready);

      // Top 3 section must exist with exactly 1 card
      const topCards = page.locator(".rankings-top-three .top-three-card");
      await expect(topCards).toHaveCount(1);

      // Card must be lead card with rank 01
      const leadCard = topCards.first();
      await expect(leadCard).toHaveClass(/top-three-lead/);
      await expect(leadCard.locator(".top-three-numeral")).toHaveText("01");
      await expect(leadCard.locator(".top-three-title")).toContainText("Black Signal");

      // Remainder rows section must NOT exist
      const remainderSection = page.locator(".rankings-list");
      await expect(remainderSection).toHaveCount(0);

      // Empty state block must NOT be rendered
      await expect(page.locator(".rankings-empty-state")).toHaveCount(0);

      // Check overflow on single-story layout across mobile & desktop
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        const docScroll = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(docScroll).toBeLessThanOrEqual(width + 1);
      }
    });

    test("Single-story genre (Slice of Life): Top 3 renders exactly 1 card", async ({
      page,
    }) => {
      await page.goto("/rankings?genre=slice-of-life");
      await page.evaluate(() => document.fonts.ready);

      const topCards = page.locator(".rankings-top-three .top-three-card");
      await expect(topCards).toHaveCount(1);
      await expect(topCards.first().locator(".top-three-numeral")).toHaveText("01");
      await expect(topCards.first().locator(".top-three-title")).toContainText("The Lanterns of Briar Row");
      await expect(page.locator(".rankings-list")).toHaveCount(0);
    });

    test("Two-story genre (LitRPG): Top 3 renders exactly 2 cards, remainder is empty", async ({
      page,
    }) => {
      await page.goto("/rankings?genre=litrpg");
      await page.evaluate(() => document.fonts.ready);

      const topCards = page.locator(".rankings-top-three .top-three-card");
      await expect(topCards).toHaveCount(2);

      // First is lead 01, second is sub 02
      await expect(topCards.nth(0)).toHaveClass(/top-three-lead/);
      await expect(topCards.nth(0).locator(".top-three-numeral")).toHaveText("01");
      await expect(topCards.nth(1)).toHaveClass(/top-three-sub/);
      await expect(topCards.nth(1).locator(".top-three-numeral")).toHaveText("02");

      // Remainder rows section must NOT exist
      await expect(page.locator(".rankings-list")).toHaveCount(0);
      await expect(page.locator(".rankings-empty-state")).toHaveCount(0);
    });

    test("Two-story genre (Sci-Fi): Top 3 renders exactly 2 cards, remainder is empty", async ({
      page,
    }) => {
      await page.goto("/rankings?genre=sci-fi");
      await page.evaluate(() => document.fonts.ready);

      const topCards = page.locator(".rankings-top-three .top-three-card");
      await expect(topCards).toHaveCount(2);
      await expect(topCards.nth(0).locator(".top-three-numeral")).toHaveText("01");
      await expect(topCards.nth(1).locator(".top-three-numeral")).toHaveText("02");
      await expect(page.locator(".rankings-list")).toHaveCount(0);
    });

    test("Sparse genre across different charts and periods (stability check)", async ({
      page,
    }) => {
      const combinations = [
        "/rankings?chart=trending&period=month&genre=thriller",
        "/rankings?chart=most-read&period=all-time&genre=thriller",
        "/rankings?chart=new-rising&period=week&genre=litrpg",
        "/rankings?chart=new-rising&period=month&genre=sci-fi",
      ];

      for (const url of combinations) {
        await page.goto(url);
        await expect(page.getByRole("heading", { name: "RANKINGS.", level: 1 })).toBeVisible();
        const topCards = page.locator(".rankings-top-three .top-three-card");
        const count = await topCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(2);
        await expect(page.locator(".rankings-list")).toHaveCount(0);
      }
    });

    test("Invalid genre parameter gracefully falls back to All Genres without crash", async ({
      page,
    }) => {
      await page.goto("/rankings?genre=nonexistent-alien-fiction");
      await expect(page.getByRole("heading", { name: "RANKINGS.", level: 1 })).toBeVisible();

      // Should fall back to all genres (20 stories: 3 top + 17 remainder)
      const topCards = page.locator(".rankings-top-three .top-three-card");
      await expect(topCards).toHaveCount(3);
      const rows = page.locator(".ranking-row");
      await expect(rows).toHaveCount(17);

      // Genre chip for All genres should be active
      const allGenresChip = page
        .getByRole("navigation", { name: "Filter by genre" })
        .getByRole("link", { name: "All genres" });
      await expect(allGenresChip).toHaveAttribute("aria-current", "page");
    });
  });

  // =========================================================================
  // DIMENSION 3: Keyboard Accessibility & Tab Sequence
  // =========================================================================
  test.describe("3. Keyboard Accessibility & Tab Sequence", () => {
    test("Full keyboard tab sequence forward & backward without focus traps", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto("/rankings");
      await page.evaluate(() => document.fonts.ready);

      // Start at skip link
      const skipLink = page.locator(".skip-link");
      await skipLink.focus();
      await expect(skipLink).toBeFocused();

      // Sequence tracking
      const focusedTags: string[] = [];
      for (let i = 0; i < 35; i++) {
        await page.keyboard.press("Tab");
        const tag = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return "none";
          return `${el.tagName.toLowerCase()}${el.className ? `.${el.className.split(" ")[0]}` : ""}`;
        });
        focusedTags.push(tag);
      }

      // Verify focus moved through links and buttons
      expect(focusedTags.length).toBe(35);
      // Ensure we hit chart tabs, period links, genre chips, top three cards, ranking rows
      expect(focusedTags.some((t) => t.includes("chart-tab"))).toBe(true);
      expect(focusedTags.some((t) => t.includes("period-link"))).toBe(true);
      expect(focusedTags.some((t) => t.includes("genre-chip"))).toBe(true);
      expect(focusedTags.some((t) => t.includes("top-three"))).toBe(true);
      expect(focusedTags.some((t) => t.includes("ranking-row"))).toBe(true);

      // Shift+Tab backward navigation works
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    });

    test("Visible focus indicator presence on focused elements", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto("/rankings");

      const testSelectors = [
        ".chart-tabs a",
        ".period-link",
        ".genre-chip",
        ".top-three-title a",
        ".top-three-author",
        ".ranking-row-stretched-link",
        ".ranking-row-author",
      ];

      for (const sel of testSelectors) {
        const el = page.locator(sel).first();
        await el.focus();
        await expect(el).toBeFocused();

        const styles = await el.evaluate((node) => {
          const s = window.getComputedStyle(node);
          return {
            outlineStyle: s.outlineStyle,
            outlineWidth: s.outlineWidth,
            boxShadow: s.boxShadow,
          };
        });

        // Must have an outline or a box-shadow focus ring
        const hasOutline = styles.outlineStyle !== "none" && styles.outlineWidth !== "0px";
        const hasBoxShadow = styles.boxShadow !== "none" && styles.boxShadow !== "";
        expect(
          hasOutline || hasBoxShadow,
          `Element ${sel} lacks a visible focus indicator`
        ).toBe(true);
      }
    });

    test("Strict ARIA semantics and aria-current uniqueness", async ({ page }) => {
      await page.goto("/rankings?chart=trending&period=week");

      // Exactly ONE chart tab has aria-current="page"
      const currentTabs = page.locator('.chart-tab[aria-current="page"]');
      await expect(currentTabs).toHaveCount(1);
      await expect(currentTabs).toHaveText("Trending");

      // Exactly ONE period link has aria-current="page"
      const currentPeriods = page.locator('.period-link[aria-current="page"]');
      await expect(currentPeriods).toHaveCount(1);
      await expect(currentPeriods).toHaveText("This week");

      // Exactly ONE genre chip has aria-current="page"
      const currentGenres = page.locator('.genre-chip[aria-current="page"]');
      await expect(currentGenres).toHaveCount(1);
      await expect(currentGenres).toHaveText("All genres");

      // Demo pill has role="status"
      const demoPill = page.locator(".rankings-demo-pill");
      await expect(demoPill).toHaveAttribute("role", "status");

      // Heading hierarchy check
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
      await expect(page.locator("h1")).toHaveText("RANKINGS.");
    });
  });

  // =========================================================================
  // DIMENSION 4: Header Navigation Integration (Desktop & Mobile)
  // =========================================================================
  test.describe("4. Header Navigation Integration", () => {
    test("Desktop navigation displays active Rankings link on /rankings and navigates across routes", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });

      // On /rankings, desktop Rankings link must have aria-current="page"
      await page.goto("/rankings");
      const desktopRankingsLink = page
        .locator(".desktop-nav")
        .getByRole("link", { name: "Rankings", exact: true });
      await expect(desktopRankingsLink).toHaveAttribute("aria-current", "page");

      // Library link must NOT have aria-current="page"
      const desktopLibraryLink = page
        .locator(".desktop-nav")
        .getByRole("link", { name: "Library", exact: true });
      await expect(desktopLibraryLink).not.toHaveAttribute("aria-current", "page");

      // Click Library -> navigates to /
      await desktopLibraryLink.click();
      await expect(page).toHaveURL(/\/$/);
      await expect(desktopLibraryLink).toHaveAttribute("aria-current", "page");
      await expect(desktopRankingsLink).not.toHaveAttribute("aria-current", "page");

      // Click Rankings from / -> navigates back to /rankings
      await desktopRankingsLink.click();
      await expect(page).toHaveURL(/\/rankings$/);
      await expect(desktopRankingsLink).toHaveAttribute("aria-current", "page");
    });

    test("Mobile navigation dialog opens, contains Rankings link with active state, and navigates", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to /rankings at mobile viewport
      await page.goto("/rankings");

      // Open mobile menu
      const menuTrigger = page.getByRole("button", { name: "Navigation", exact: true });
      await expect(menuTrigger).toBeVisible();
      await menuTrigger.click();

      // Mobile nav dialog must appear
      const mobileNav = page.locator(".mobile-nav");
      await expect(mobileNav).toBeVisible();

      // Rankings link inside mobile nav must have aria-current="page"
      const mobileRankingsLink = mobileNav.getByRole("link", { name: "Rankings", exact: true });
      await expect(mobileRankingsLink).toBeVisible();
      await expect(mobileRankingsLink).toHaveAttribute("aria-current", "page");

      // Library link must NOT have aria-current
      const mobileLibraryLink = mobileNav.getByRole("link", { name: "Library", exact: true });
      await expect(mobileLibraryLink).not.toHaveAttribute("aria-current", "page");

      // Navigate to Library from mobile menu
      await mobileLibraryLink.click();
      await expect(page).toHaveURL(/\/$/);

      // Re-open mobile menu from homepage
      await menuTrigger.click();
      await expect(mobileRankingsLink).toBeVisible();
      await expect(mobileRankingsLink).not.toHaveAttribute("aria-current", "page");

      // Click Rankings from mobile menu -> navigates back to /rankings
      await mobileRankingsLink.click();
      await expect(page).toHaveURL(/\/rankings$/);
    });
  });

  // =========================================================================
  // DIMENSION 5: Full Axe Accessibility Verification under Sparse & Extreme Conditions
  // =========================================================================
  test.describe("5. Axe Accessibility under Adversarial States", () => {
    test("Axe audit on single-story genre (/rankings?genre=thriller)", async ({ page }) => {
      await page.goto("/rankings?genre=thriller");
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
      }));
      expect(violations).toEqual([]);
    });

    test("Axe audit at mobile viewport (320px)", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto("/rankings");
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
      }));
      expect(violations).toEqual([]);
    });
  });
});

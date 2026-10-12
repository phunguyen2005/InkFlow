import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("InkFlow Public Library Community Feature", () => {
  test("1. Community Homepage (/community): Hero, tabs, featured discussion, weekly prompt, and cards", async ({
    page,
  }) => {
    await page.goto("/community");
    await page.evaluate(() => document.fonts.ready);

    // Document title
    await expect(page).toHaveTitle(/Community · InkFlow/);

    // 1a. Hero display and artwork
    const heroHeading = page.getByRole("heading", {
      name: "BEYOND THE PAGE.",
      level: 1,
    });
    await expect(heroHeading).toBeVisible();

    const heroImg = page.locator(".community-hero-art img");
    await expect(heroImg).toBeVisible();
    const heroLoaded = await heroImg.evaluate(
      (img) =>
        (img as HTMLImageElement).complete &&
        (img as HTMLImageElement).naturalWidth > 0,
    );
    expect(heroLoaded).toBe(true);
    const heroSrc = await heroImg.getAttribute("src");
    expect(heroSrc).toContain("community-hero.webp");

    // 1b. Category filter tabs navigation and URL sync
    const nav = page.getByRole("navigation", {
      name: "Community categories",
    });
    await expect(nav).toBeVisible();

    const allTab = nav.getByRole("link", { name: "All", exact: true });
    const discussionsTab = nav.getByRole("link", {
      name: "Discussions",
      exact: true,
    });
    const reviewsTab = nav.getByRole("link", {
      name: "Reviews",
      exact: true,
    });

    // Default "All" is active
    await expect(allTab).toHaveAttribute("aria-current", "page");
    await expect(allTab).toHaveClass(/active/);

    // Switch to Discussions tab
    await discussionsTab.click();
    await expect(page).toHaveURL(/tab=discussions/);
    await expect(discussionsTab).toHaveAttribute("aria-current", "page");
    await expect(discussionsTab).toHaveClass(/active/);
    await expect(allTab).not.toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("heading", { name: "Discussions", level: 2 }),
    ).toBeVisible();

    // Switch to Reviews tab
    await reviewsTab.click();
    await expect(page).toHaveURL(/tab=reviews/);
    await expect(reviewsTab).toHaveAttribute("aria-current", "page");
    await expect(reviewsTab).toHaveClass(/active/);
    await expect(
      page.getByRole("heading", { name: "Reader Reviews", level: 2 }),
    ).toBeVisible();

    // Switch back to All tab
    await allTab.click();
    await expect(page).toHaveURL(/\/community$/);
    await expect(allTab).toHaveAttribute("aria-current", "page");

    // 1c. Featured discussion card with cover art
    const featuredCard = page.locator(".featured-discussion");
    await expect(featuredCard).toBeVisible();
    const featuredCoverImg = featuredCard.locator(".featured-cover img");
    await expect(featuredCoverImg).toBeVisible();
    const featuredCoverLoaded = await featuredCoverImg.evaluate(
      (img) =>
        (img as HTMLImageElement).complete &&
        (img as HTMLImageElement).naturalWidth > 0,
    );
    expect(featuredCoverLoaded).toBe(true);

    const featuredTitleLink = featuredCard.locator(".featured-title a");
    await expect(featuredTitleLink).toBeVisible();
    await expect(featuredCard.locator(".featured-author")).toBeVisible();
    await expect(featuredCard.locator(".featured-replies")).toBeVisible();

    // 1d. Weekly editorial prompt ("Question of the Week")
    const promptSection = page.locator(".weekly-prompt");
    await expect(promptSection).toBeVisible();
    await expect(promptSection.getByText("Question of the Week")).toBeVisible();
    await expect(
      promptSection.locator(".weekly-prompt-question"),
    ).toBeVisible();
    await expect(
      promptSection.locator(".weekly-prompt-description"),
    ).toBeVisible();

    // 1e. Latest typography-led discussion cards
    const latestSection = page.locator(".latest-conversations");
    await expect(latestSection).toBeVisible();
    const discussionCards = latestSection.locator(".discussion-card");
    const count = await discussionCards.count();
    expect(count).toBeGreaterThan(0);

    const firstCard = discussionCards.first();
    await expect(firstCard.locator(".category-badge")).toBeVisible();
    await expect(firstCard.locator(".discussion-card-replies")).toBeVisible();
    await expect(firstCard.locator(".discussion-card-title a")).toBeVisible();
    await expect(firstCard.locator(".discussion-card-excerpt")).toBeVisible();
    await expect(firstCard.locator(".discussion-card-author")).toBeVisible();

    // 1f. Community perspective CTA banner
    const ctaSection = page.locator(".community-cta");
    await expect(ctaSection).toBeVisible();
    await expect(
      ctaSection.getByRole("heading", {
        name: "Your perspective belongs here.",
      }),
    ).toBeVisible();

    // 1g. Clicking discussion card navigates to detail view
    const targetTitle = (
      await firstCard.locator(".discussion-card-title a").innerText()
    ).trim();
    await firstCard.locator(".discussion-card-title a").click();
    await expect(page).toHaveURL(/\/community\/discussions\//);
    await expect(page.locator("h1.discussion-title")).toContainText(targetTitle);
  });

  test("2. Discussion Detail & Chapter Spoiler Management (/community/discussions/[discussionSlug])", async ({
    page,
  }) => {
    await page.goto(
      "/community/discussions/was-returning-ever-a-choice",
    );
    await page.evaluate(() => document.fonts.ready);

    // 2a. Breadcrumb navigation
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb).toBeVisible();
    const communityLink = breadcrumb.getByRole("link", {
      name: "Community",
      exact: true,
    });
    await expect(communityLink).toBeVisible();
    await expect(communityLink).toHaveAttribute("href", "/community");

    const storyBreadcrumbLink = breadcrumb.getByRole("link", {
      name: "The Blood Orchard",
      exact: true,
    });
    await expect(storyBreadcrumbLink).toBeVisible();
    await expect(storyBreadcrumbLink).toHaveAttribute(
      "href",
      "/stories/the-blood-orchard",
    );

    // 2b. Story reference bar
    const storyBar = page.locator(".story-reference-bar");
    await expect(storyBar).toBeVisible();
    const storyBarTitleLink = storyBar.locator(".story-reference-title");
    await expect(storyBarTitleLink).toHaveAttribute(
      "href",
      "/stories/the-blood-orchard",
    );
    const storyBarChapterLink = storyBar.locator(".story-reference-link");
    await expect(storyBarChapterLink).toHaveAttribute(
      "href",
      /\/stories\/the-blood-orchard\/chapters\/chapter-3/,
    );

    // 2c. Chapter-scoped spoiler gate conceals discussion body
    const spoilerGate = page.locator(".spoiler-gate");
    await expect(spoilerGate).toBeVisible();
    await expect(
      page.getByText(/This discussion contains Chapter 3 spoilers for/i),
    ).toBeVisible();

    const revealBtn = page.getByRole("button", {
      name: "Reveal discussion",
      exact: true,
    });
    await expect(revealBtn).toBeVisible();

    // Body markdown is not rendered while spoiler is concealed
    await expect(page.locator(".discussion-body")).toHaveCount(0);

    // 2d. Clicking "Reveal discussion" reveals content, announces status, and shifts focus
    await revealBtn.click();
    await expect(revealBtn).toHaveCount(0);
    const discussionBody = page.locator(".discussion-body");
    await expect(discussionBody).toBeVisible();

    // Polite live status announcement
    const announcement = page
      .locator('[role="status"]')
      .filter({ hasText: "Discussion revealed" });
    await expect(announcement).toBeAttached();

    // Verify unblurred banner is present
    await expect(page.locator(".spoiler-unblurred-banner")).toBeVisible();

    // 2e. One-level replies render with author and timestamp
    const repliesSection = page.locator(".discussion-replies");
    await expect(repliesSection).toBeVisible();
    await expect(
      repliesSection.getByRole("heading", { name: /Replies \(\d+\)/ }),
    ).toBeVisible();

    const replyBlocks = repliesSection.locator(".reply-block");
    const repliesCount = await replyBlocks.count();
    expect(repliesCount).toBeGreaterThan(0);

    const firstReply = replyBlocks.first();
    await expect(firstReply.locator(".reply-author")).toBeVisible();
    await expect(firstReply.locator("time")).toBeVisible();
    await expect(firstReply.locator(".reply-body")).toBeVisible();

    // 2f. Mock report action stub functions with status feedback
    const reportBtn = page.getByRole("button", {
      name: "Report this discussion",
    });
    await expect(reportBtn).toBeVisible();
    await reportBtn.click();

    const reportFeedback = page.locator(".report-feedback");
    await expect(reportFeedback).toBeVisible();
    await expect(reportFeedback).toContainText(
      "Report submitted for review (mock)",
    );

    // 2g. Honest demo disclaimer
    const mockNotice = page.locator(".community-mock-notice");
    await expect(mockNotice).toBeVisible();
    await expect(mockNotice).toContainText("Mock editorial content");
  });

  test("3. Story Detail Integration (/stories/the-blood-orchard): Conversations section and link", async ({
    page,
  }) => {
    await page.goto("/stories/the-blood-orchard");
    await page.evaluate(() => document.fonts.ready);

    // 3a. Conversations section is visible
    const section = page.locator(".story-discussions-section");
    await expect(section).toBeVisible();
    await expect(
      section.getByRole("heading", { name: "Conversations", level: 2 }),
    ).toBeVisible();

    // 3b. Verify DOM order: between .story-body-grid and .story-shelf
    const isPositionedCorrectly = await page.evaluate(() => {
      const grid = document.querySelector(".story-body-grid");
      const discussions = document.querySelector(".story-discussions-section");
      const shelf = document.querySelector(".story-shelf");
      if (!grid || !discussions || !shelf) return false;
      const afterGrid =
        (grid.compareDocumentPosition(discussions) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
        0;
      const beforeShelf =
        (discussions.compareDocumentPosition(shelf) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
        0;
      return afterGrid && beforeShelf;
    });
    expect(isPositionedCorrectly).toBe(true);

    // 3c. Displays story-specific discussion cards
    const cards = section.locator(".discussion-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // 3d. "View all" link navigates to story-filtered community page
    const viewAllLink = section.getByRole("link", { name: /View all/i });
    await expect(viewAllLink).toBeVisible();
    await expect(viewAllLink).toHaveAttribute(
      "href",
      "/community?story=the-blood-orchard",
    );

    await viewAllLink.click();
    await expect(page).toHaveURL(/\/community\?story=the-blood-orchard$/);
    await expect(
      page.getByRole("heading", {
        name: "Conversations · The Blood Orchard",
        level: 2,
      }),
    ).toBeVisible();
  });

  test("4. Header & Footer Navigation: Active Community link and no Coming Soon dialog", async ({
    page,
  }) => {
    await page.goto("/community");
    await page.evaluate(() => document.fonts.ready);

    // 4a. Desktop SiteHeader renders Community link with aria-current="page"
    const desktopNav = page.locator(".desktop-nav");
    const headerCommunityLink = desktopNav.getByRole("link", {
      name: "Community",
      exact: true,
    });
    await expect(headerCommunityLink).toBeVisible();
    await expect(headerCommunityLink).toHaveAttribute("aria-current", "page");

    // 4b. Coming Soon modal dialog and badge are completely removed
    await expect(
      page.getByRole("dialog", { name: /Coming Soon/i }),
    ).toHaveCount(0);
    await expect(page.getByText("Coming Soon")).toHaveCount(0);

    // 4c. SiteFooter contains Community link under Discover nav
    const footerDiscoverNav = page
      .locator(".site-footer nav")
      .filter({ hasText: "Discover" });
    const footerCommunityLink = footerDiscoverNav.getByRole("link", {
      name: "Community",
      exact: true,
    });
    await expect(footerCommunityLink).toBeVisible();
    await expect(footerCommunityLink).toHaveAttribute("href", "/community");
  });

  test("5. Cross-Platform Responsiveness & Image Integrity across 5 viewports", async ({
    page,
  }) => {
    test.setTimeout(300000);
    const routes = [
      ["community-home", "/community"],
      [
        "community-discussion",
        "/community/discussions/was-returning-ever-a-choice",
      ],
      ["story-detail", "/stories/the-blood-orchard"],
    ];

    const viewports = [1440, 1024, 768, 390, 320];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
      for (const [name, route] of routes) {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("main h1").first()).toBeVisible();

        // Wait for above-the-fold images to decode
        await page.evaluate(async () => {
          await Promise.all(
            [...document.images]
              .filter((img) => img.getBoundingClientRect().top < innerHeight)
              .map((img) => img.decode().catch(() => {})),
          );
        });

        // 5a. Horizontal overflow check: scrollWidth <= innerWidth + 1
        const dimensions = await page.evaluate(() => ({
          page: document.documentElement.scrollWidth,
          viewport: innerWidth,
        }));
        expect(
          dimensions.page,
          `Horizontal overflow detected on ${name} at ${width}px: page=${dimensions.page}, viewport=${dimensions.viewport}`,
        ).toBeLessThanOrEqual(dimensions.viewport + 1);

        // 5b. Broken image check: all completed images must have naturalWidth > 0
        const brokenImages = await page.locator("img").evaluateAll((imgs) =>
          imgs
            .filter(
              (img) =>
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth === 0,
            )
            .map((img) => img.getAttribute("src")),
        );
        expect(
          brokenImages,
          `Broken images found on ${name} at ${width}px`,
        ).toEqual([]);
      }
    }
  });

  test("6. Axe-core Accessibility Audit across Community routes (zero violations)", async ({
    page,
  }) => {
    const routes = [
      "/community",
      "/community/discussions/was-returning-ever-a-choice",
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const auditResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const violations = auditResults.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      }));

      expect(
        violations,
        `Axe violations on ${route}: ${JSON.stringify(violations, null, 2)}`,
      ).toEqual([]);
    }

    // Also audit revealed spoiler state on discussion detail page
    await page.goto("/community/discussions/was-returning-ever-a-choice");
    await page.evaluate(() => document.fonts.ready);
    const revealBtn = page.getByRole("button", {
      name: "Reveal discussion",
      exact: true,
    });
    if (await revealBtn.isVisible()) {
      await revealBtn.click();
      await page.waitForTimeout(100);

      const postRevealAudit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const postRevealViolations = postRevealAudit.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      }));

      expect(
        postRevealViolations,
        `Axe violations after revealing spoiler: ${JSON.stringify(postRevealViolations, null, 2)}`,
      ).toEqual([]);
    }
  });
});

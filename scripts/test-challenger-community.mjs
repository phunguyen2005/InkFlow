import { chromium } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";

async function runEmpiricalStressTests() {
  console.log("=== EMPIRICAL STRESS TEST SUITE: INKFLOW COMMUNITY ===");
  console.log(`Target URL: ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    viewports: [],
    keyboardNav: [],
    spoilerFlow: {},
    cplAnalysis: {},
    edgeCases: [],
  };

  try {
    // -------------------------------------------------------------
    // 1. VIEWPORT EXTREMES & HORIZONTAL OVERFLOW (6 viewports)
    // -------------------------------------------------------------
    console.log("\n[1] Testing Viewport Extremes (320, 360, 390, 768, 1024, 1440)...");
    const testViewports = [320, 360, 390, 768, 1024, 1440];
    const routesToTest = [
      "/community",
      "/community/discussions/was-returning-ever-a-choice",
      "/stories/the-blood-orchard",
    ];

    for (const vp of testViewports) {
      await page.setViewportSize({ width: vp, height: vp < 600 ? 800 : 900 });
      for (const route of routesToTest) {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);

        const overflowData = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

          // Find specific offending elements if overflow exists
          const offending = [];
          if (hasHorizontalOverflow) {
            const allElements = document.querySelectorAll("*");
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > innerWidth + 1) {
                offending.push({
                  tag: el.tagName,
                  className: el.className,
                  right: rect.right,
                  width: rect.width,
                });
              }
            }
          }

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            offending: offending.slice(0, 5),
          };
        });

        results.viewports.push({
          viewport: vp,
          route,
          ...overflowData,
        });

        if (overflowData.hasHorizontalOverflow) {
          console.error(`  FAIL: Overflow on ${route} at ${vp}px: scrollWidth=${overflowData.scrollWidth}, innerWidth=${overflowData.innerWidth}`);
        } else {
          console.log(`  PASS: ${route} at ${vp}px (scrollWidth=${overflowData.scrollWidth}, innerWidth=${overflowData.innerWidth})`);
        }
      }
    }

    // -------------------------------------------------------------
    // 2. SPOILER REVEAL FOCUS SHIFT & ARIA-LIVE BEHAVIOR
    // -------------------------------------------------------------
    console.log("\n[2] Testing Spoiler Reveal Focus Shift & ARIA-Live Behavior...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/community/discussions/was-returning-ever-a-choice`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const spoilerInitialState = await page.evaluate(() => {
      const gate = document.querySelector(".spoiler-gate");
      const body = document.querySelector(".discussion-body");
      return {
        gateVisible: !!gate,
        bodyPresent: !!body,
      };
    });

    console.log(`  Initial state: Gate visible=${spoilerInitialState.gateVisible}, Body present=${spoilerInitialState.bodyPresent}`);

    const revealBtn = page.getByRole("button", { name: "Reveal discussion", exact: true });
    await revealBtn.focus();
    
    // Check initial focus
    const focusedBeforeClick = await page.evaluate(() => {
      const el = document.activeElement;
      return { tag: el?.tagName, text: el?.textContent?.trim() };
    });
    console.log(`  Focused before click: <${focusedBeforeClick.tag}> "${focusedBeforeClick.text}"`);

    // Click reveal button
    await revealBtn.click();

    // Wait for the 50ms programmatic focus shift in spoiler-overlay.tsx
    await page.waitForTimeout(150);

    const postRevealFocus = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        className: el?.className,
        tabIndex: el?.getAttribute("tabindex"),
        id: el?.id,
        isContentRef: el?.hasAttribute("tabindex") && el?.getAttribute("tabindex") === "-1",
        outline: window.getComputedStyle(el).outline,
      };
    });

    console.log(`  Post-reveal activeElement: <${postRevealFocus.tag}> class="${postRevealFocus.className}" tabIndex=${postRevealFocus.tabIndex} (isContentRef=${postRevealFocus.isContentRef})`);

    // Check ARIA-Live announcement
    const liveAnnouncement = await page.evaluate(() => {
      const statusEl = document.querySelector('[role="status"]');
      const liveEl = document.querySelector('[aria-live]');
      return {
        hasRoleStatus: !!statusEl,
        statusText: statusEl?.textContent?.trim(),
        hasAriaLive: !!liveEl,
        ariaLiveValue: liveEl?.getAttribute("aria-live"),
        ariaAtomic: liveEl?.getAttribute("aria-atomic") || statusEl?.getAttribute("aria-atomic"),
      };
    });

    console.log(`  Live Announcement: role="status"=${liveAnnouncement.hasRoleStatus} text="${liveAnnouncement.statusText}" hasAriaLive=${liveAnnouncement.hasAriaLive}`);

    // Test Tab key progression from the newly focused container
    await page.keyboard.press("Tab");
    const nextFocusedAfterTab = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        className: el?.className,
        text: el?.textContent?.trim().slice(0, 40),
        href: el?.getAttribute("href"),
      };
    });

    console.log(`  Next focused element on Tab: <${nextFocusedAfterTab.tag}> class="${nextFocusedAfterTab.className}" text="${nextFocusedAfterTab.text}"`);

    // Test Re-hide button
    const hideBtn = page.getByRole("button", { name: /Hide spoilers/i });
    const hideBtnExists = await hideBtn.isVisible();
    console.log(`  Hide spoilers button visible: ${hideBtnExists}`);
    if (hideBtnExists) {
      await hideBtn.click();
      await page.waitForTimeout(100);
      const rehiddenGate = await page.locator(".spoiler-gate").isVisible();
      console.log(`  Re-hide action restored spoiler gate: ${rehiddenGate}`);
    }

    results.spoilerFlow = {
      spoilerInitialState,
      postRevealFocus,
      liveAnnouncement,
      nextFocusedAfterTab,
      hideBtnExists,
    };

    // -------------------------------------------------------------
    // 3. TAB KEY NAVIGATION FLOW & FOCUS RINGS
    // -------------------------------------------------------------
    console.log("\n[3] Testing Tab Key Navigation Flow & Focus Rings on /community...");
    await page.goto(`${BASE_URL}/community`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Start from body
    await page.evaluate(() => document.body.focus());

    const tabSequence = [];
    const maxTabs = 35;

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");
      const elData = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          className: el.className,
          text: (el.textContent || "").trim().slice(0, 50),
          href: el.getAttribute("href"),
          role: el.getAttribute("role"),
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          outlineColor: style.outlineColor,
          outlineOffset: style.outlineOffset,
        };
      });

      if (!elData) break;
      tabSequence.push(elData);
    }

    console.log(`  Recorded ${tabSequence.length} tab steps on /community:`);
    let inkFlowFocusCount = 0;
    tabSequence.forEach((step, idx) => {
      const isInkFlow = step.outlineColor.includes("140") && step.outlineColor.includes("203") && step.outlineColor.includes("208");
      if (isInkFlow) inkFlowFocusCount++;
      if (idx < 12 || idx > tabSequence.length - 4) {
        console.log(`    [#${idx + 1}] <${step.tag}> "${step.text.replace(/\s+/g, ' ')}" -> outline: ${step.outlineWidth} ${step.outlineStyle} ${step.outlineColor}`);
      } else if (idx === 12) {
        console.log(`    ... (${tabSequence.length - 15} more interactive elements) ...`);
      }
    });

    console.log(`  Interactive elements with --ink-flow outline: ${inkFlowFocusCount}/${tabSequence.length}`);
    results.keyboardNav = tabSequence;

    // -------------------------------------------------------------
    // 4. CHARACTERS PER LINE (CPL) & PROSE READABILITY
    // -------------------------------------------------------------
    console.log("\n[4] Testing Characters Per Line (CPL) & Prose Readability...");
    await page.goto(`${BASE_URL}/community/discussions/was-returning-ever-a-choice`, { waitUntil: "networkidle" });
    const reveal = page.getByRole("button", { name: "Reveal discussion", exact: true });
    if (await reveal.isVisible()) await reveal.click();
    await page.waitForTimeout(100);

    const cplData = await page.evaluate(() => {
      const proseContainer = document.querySelector(".discussion-body");
      const paragraphs = Array.from(document.querySelectorAll(".discussion-body p"));
      if (!proseContainer || paragraphs.length === 0) return null;

      const style = window.getComputedStyle(proseContainer);
      const containerWidth = proseContainer.getBoundingClientRect().width;
      const fontSize = parseFloat(style.fontSize);

      // Average character width for serif prose is roughly 0.45em - 0.52em
      // Let's compute actual average characters per line
      const paragraphStats = paragraphs.map(p => {
        const text = p.textContent.trim();
        const pWidth = p.getBoundingClientRect().width;
        // Approximate cpl = pWidth / (approx avg char width ~ 0.5 * fontSize)
        const estimatedAvgCharWidth = fontSize * 0.48;
        const estimatedCpl = Math.round(pWidth / estimatedAvgCharWidth);
        return {
          length: text.length,
          widthPx: pWidth,
          estimatedCpl,
        };
      });

      return {
        containerWidthPx: containerWidth,
        fontSizePx: fontSize,
        lineHeight: style.lineHeight,
        paragraphStats,
      };
    });

    console.log(`  Prose container width: ${cplData?.containerWidthPx}px, font size: ${cplData?.fontSizePx}px`);
    console.log(`  Estimated CPL: ${cplData?.paragraphStats[0]?.estimatedCpl} characters/line (Target range: 60-75 cpl)`);
    results.cplAnalysis = cplData;

    // -------------------------------------------------------------
    // 5. EDGE CASES & ADVERSARIAL FAILURE MODES
    // -------------------------------------------------------------
    console.log("\n[5] Testing Edge Cases & Failure Modes...");

    // 5a. Non-spoiler discussion (should render immediately without spoiler gate)
    await page.goto(`${BASE_URL}/community/discussions/what-makes-a-fictional-world-feel-alive`, { waitUntil: "networkidle" });
    const nonSpoilerCheck = await page.evaluate(() => {
      const gate = document.querySelector(".spoiler-gate");
      const body = document.querySelector(".discussion-body");
      return {
        hasGate: !!gate,
        hasBody: !!body,
      };
    });
    console.log(`  5a. Non-spoiler discussion: gate=${nonSpoilerCheck.hasGate}, body=${nonSpoilerCheck.hasBody}`);
    results.edgeCases.push({ case: "non-spoiler", ...nonSpoilerCheck });

    // 5b. Invalid discussion slug (should return 404 cleanly)
    const notFoundRes = await page.goto(`${BASE_URL}/community/discussions/invalid-slug-xyz-12345`);
    console.log(`  5b. Invalid discussion slug status: ${notFoundRes.status()}`);
    results.edgeCases.push({ case: "invalid-slug-404", status: notFoundRes.status() });

    // 5c. Invalid category query parameter
    await page.goto(`${BASE_URL}/community?tab=nonexistent_category`, { waitUntil: "networkidle" });
    const invalidTabHandling = await page.evaluate(() => {
      const cards = document.querySelectorAll(".discussion-card");
      const main = document.querySelector("main");
      return {
        mainVisible: !!main,
        cardCount: cards.length,
      };
    });
    console.log(`  5c. Invalid category query: mainVisible=${invalidTabHandling.mainVisible}, cardCount=${invalidTabHandling.cardCount}`);
    results.edgeCases.push({ case: "invalid-tab-param", ...invalidTabHandling });

    // 5d. Non-existent story filter query
    await page.goto(`${BASE_URL}/community?story=non-existent-story-12345`, { waitUntil: "networkidle" });
    const invalidStoryHandling = await page.evaluate(() => {
      const cards = document.querySelectorAll(".discussion-card");
      const emptyMsg = document.querySelector(".latest-conversations")?.textContent;
      return {
        cardCount: cards.length,
        hasEmptyMessage: emptyMsg?.includes("No discussions found") || emptyMsg?.includes("No"),
      };
    });
    console.log(`  5d. Invalid story filter query: cards=${invalidStoryHandling.cardCount}, hasEmptyMessage=${invalidStoryHandling.hasEmptyMessage}`);
    results.edgeCases.push({ case: "invalid-story-param", ...invalidStoryHandling });

    console.log("\n=== ALL EMPIRICAL CHECKS COMPLETED ===");
  } finally {
    await browser.close();
  }

  return results;
}

runEmpiricalStressTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

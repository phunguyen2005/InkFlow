import { expect, test } from "@playwright/test";

test("local reader profile, saved library, search suggestions and review", async ({
  page,
}) => {
  await page.goto("/sign-up");
  await page.getByLabel("Display name").fill("Avery Reader");
  await page.getByLabel("Email").fill("avery@example.com");
  await page.getByLabel("Password").fill("local-preview-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/library$/);
  await expect(page.getByRole("heading", { name: "My Library" })).toBeVisible();

  await page.goto("/stories/the-blood-orchard");
  await page
    .getByRole("button", { name: "Save to library", exact: true })
    .click();
  await page.getByRole("button", { name: "5 stars" }).click();
  await page
    .getByPlaceholder("What stayed with you?")
    .fill("Atmospheric and sharply paced.");
  await page.getByRole("button", { name: "Save review" }).click();
  await expect(page.getByText("Review saved on this device.")).toBeVisible();

  await page.goto("/library");
  await page.getByRole("tab", { name: "Saved stories" }).click();
  await expect(
    page.getByRole("heading", { name: "The Blood Orchard" }),
  ).toBeVisible();

  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Search stories, authors, or tags" })
    .fill("Mara");
  await expect(
    page.getByRole("option", { name: /The Blood Orchard/ }),
  ).toBeVisible();
});

test("Continue Reading uses persisted chapter progress and a mobile card rail", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const progress = {
      "story-001": {
        chapterSlug: "chapter-2",
        paragraph: 2,
        percent: 37,
        completedChapterSlugs: ["chapter-1"],
        lastReadAt: "2026-10-11T12:00:00.000Z",
      },
      "story-002": {
        chapterSlug: "chapter-1",
        paragraph: 1,
        percent: 18,
        completedChapterSlugs: [],
        lastReadAt: "2026-10-10T12:00:00.000Z",
      },
      "story-003": {
        chapterSlug: "chapter-3",
        paragraph: 0,
        percent: 4,
        completedChapterSlugs: ["chapter-1", "chapter-2"],
        lastReadAt: "2026-10-09T12:00:00.000Z",
      },
    };
    localStorage.setItem(
      "inkflow:account:v2",
      JSON.stringify({
        version: 2,
        profile: null,
        savedStoryIds: [],
        followedStoryIds: [],
        followedAuthorIds: [],
        progress,
        reviews: {},
      }),
    );
    localStorage.setItem(
      "inkflow:progress:v1:story-001",
      JSON.stringify(progress["story-001"]),
    );
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.getByRole("region", { name: "Stories in progress" });
  await expect(
    page.getByRole("heading", { name: "Continue reading" }),
  ).toBeVisible();
  const resume = page.getByRole("link", {
    name: "Resume The Blood Orchard, Chapter 02",
  });
  await expect(resume).toHaveAttribute(
    "href",
    "/stories/the-blood-orchard/chapters/chapter-2?resume=1",
  );
  await expect(
    resume.getByRole("progressbar", {
      name: "The Blood Orchard chapter progress",
    }),
  ).toHaveAttribute("aria-valuenow", "37");
  await expect(page.getByRole("button", { name: "Saved" })).toHaveCount(0);

  const layout = await section.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    firstCardWidth:
      element.querySelector<HTMLElement>(".continue-card")?.offsetWidth ?? 0,
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
  }));
  expect(layout.firstCardWidth).toBeGreaterThan(layout.clientWidth * 0.8);
  expect(layout.firstCardWidth).toBeLessThan(layout.clientWidth);
  expect(layout.scrollWidth).toBeGreaterThan(layout.clientWidth);
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

  await resume.focus();
  await expect(resume).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(
    /\/stories\/the-blood-orchard\/chapters\/chapter-2\?resume=1$/,
  );
  await expect
    .poll(() =>
      page
        .locator('[data-paragraph="2"]')
        .evaluate((element) =>
          Math.abs(element.getBoundingClientRect().top - 90),
        ),
    )
    .toBeLessThan(40);
});

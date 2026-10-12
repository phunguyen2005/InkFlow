import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const root = "/studio/stories/story-blood-orchard";
test("editor preferences persist and mobile panels return focus", async ({
  page,
}) => {
  await page.goto(root + "/chapters/blood-orchard-ch-03");
  await expect(
    page.getByRole("textbox", { name: "Chapter manuscript" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Manuscript appearance" }).click();
  await page.getByLabel("Manuscript theme").selectOption("sepia");
  await page.getByLabel("Manuscript font size").selectOption("22");
  await page.reload();
  await page.getByRole("button", { name: "Manuscript appearance" }).click();
  await expect(page.getByLabel("Manuscript theme")).toHaveValue("sepia");
  await expect(
    page.getByRole("button", { name: "Creative", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Manuscript font size")).toHaveValue("22");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Toggle contextual inspector" })
    .click();
  await expect(
    page.getByRole("button", { name: "Close contextual inspector" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Close contextual inspector" }),
  ).not.toBeVisible();
  await page.goto(root + "/canon");
  await page.getByRole("button", { name: "Elara Voss CHARACTER" }).click();
  await expect(page.getByRole("heading", { name: "Elara Voss" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: "docs/qa/studio/canon-details-390.png" });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Elara Voss" }),
  ).not.toBeVisible();
});
test("Canon replacement preserves history and requires approval", async ({
  page,
}) => {
  await page.goto(root + "/canon");
  await page.getByRole("button", { name: "Ashen Key ARTIFACT" }).click();
  await page.getByLabel("Canon chapter").selectOption("blood-orchard-ch-13");
  await expect(
    page.getByText("Destroyed", { exact: true }).first(),
  ).toBeVisible();
  await page.getByLabel("Canon chapter").selectOption("blood-orchard-ch-03");
  await expect(page.getByText("Intact", { exact: true }).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Propose replacement" })
    .first()
    .click();
  await page.getByRole("textbox", { name: "Proposed value" }).fill("Reforged");
  await page.getByLabel("Effective from").selectOption("blood-orchard-ch-03");
  await page.getByRole("button", { name: "Save proposal" }).click();
  await expect(page.getByText("Intact", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await page.getByRole("button", { name: "Confirm approval" }).click();
  await expect(page.getByText("Reforged", { exact: true })).toBeVisible();
  await page.getByLabel("Canon chapter").selectOption("blood-orchard-ch-01");
  await expect(page.getByText("Intact", { exact: true }).first()).toBeVisible();
});
test("failed storage blocks navigation and retains an exportable draft", async ({
  page,
}) => {
  await page.goto(root + "/chapters/blood-orchard-ch-03");
  const editor = page.getByRole("textbox", { name: "Chapter manuscript" });
  await expect(editor).toBeVisible();
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException("Simulated full storage", "QuotaExceededError");
    };
  });
  await editor.press("Control+End");
  await editor.pressSequentially(" Unsaved but retained.");
  await page.getByRole("button", { name: "Save chapter", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Simulated full storage",
  );
  await page.getByRole("link", { name: "Your stories", exact: true }).click();
  await expect(page).toHaveURL(/chapters/);
  await expect(editor).toContainText("Unsaved but retained.");
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export draft", exact: true })
    .first()
    .click();
  expect((await download).suggestedFilename()).toContain("draft.json");
});
test("concurrent stale tab cannot overwrite manuscript", async ({
  page,
  context,
}) => {
  await page.goto(root + "/chapters/blood-orchard-ch-03");
  await expect(
    page.getByRole("textbox", { name: "Chapter manuscript" }),
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto(root + "/chapters/blood-orchard-ch-03");
  const second = other.getByRole("textbox", { name: "Chapter manuscript" });
  await expect(second).toBeVisible();
  const first = page.getByRole("textbox", { name: "Chapter manuscript" });
  await first.press("Control+End");
  await first.pressSequentially(" First tab wins.");
  await page.getByRole("button", { name: "Save chapter", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await second.press("Control+End");
  await second.pressSequentially(" Older tab draft.");
  await other
    .getByRole("button", { name: "Save chapter", exact: true })
    .click();
  await expect(other.locator("main").getByRole("alert")).toContainText(
    "another tab",
  );
  await expect(second).toContainText("Older tab draft.");
  await page.reload();
  await expect(first).toContainText("First tab wins.");
  await expect(first).not.toContainText("Older tab draft.");
});
test("Studio manuscript persists, Focus preserves editor, review requires a reason", async ({
  page,
}) => {
  await page.goto(root + "/chapters/blood-orchard-ch-03");
  const editor = page.getByRole("textbox", { name: "Chapter manuscript" });
  await expect(editor).toBeVisible();
  await editor.press("Control+End");
  await editor.press("Enter");
  await editor.pressSequentially("A locally saved ending.");
  await page.getByRole("button", { name: "Save chapter", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await page.reload();
  await expect(editor).toContainText("A locally saved ending.");
  await page.getByRole("button", { name: "Focus mode", exact: true }).click();
  await expect(editor).toContainText("A locally saved ending.");
  await page.getByRole("button", { name: "Focus mode", exact: true }).click();
  await page.goto(root + "/review?issue=issue-1");
  await page.getByRole("button", { name: "Dismiss", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Reason", exact: true })
    .fill("Intentional contradiction");
  await page.getByRole("button", { name: "Confirm dismissal" }).click();
  await expect(
    page.getByText("Intentional contradiction", { exact: true }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Intentional contradiction", { exact: true }).first(),
  ).toBeVisible();
});
test("create story and chapter", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: /Create new story/i }).click();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("The Test Manuscript");
  await page.getByRole("button", { name: "Create story", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "The Test Manuscript" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /New chapter/i })
    .first()
    .click();
  await page.getByRole("textbox", { name: /title/i }).fill("First Light");
  await page.getByRole("button", { name: /Create chapter/i }).click();
  await expect(
    page.getByRole("textbox", { name: "Chapter title" }),
  ).toHaveValue("First Light");
});
test("five Studio screens are responsive and accessible", async ({ page }) => {
  fs.mkdirSync("docs/qa/studio", { recursive: true });
  const screens = [
    ["dashboard", "/studio"],
    ["workspace", root],
    ["editor", root + "/chapters/blood-orchard-ch-03"],
    ["canon", root + "/canon"],
    ["review", root + "/review"],
  ];
  for (const width of [1440, 1024, 768, 390, 320])
    for (const [name, url] of screens) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(url);
      await expect(page.locator("[data-studio-root]")).toBeVisible();
      if (name === "editor")
        await expect(
          page.getByRole("textbox", { name: "Chapter manuscript" }),
        ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect
        .poll(() =>
          page
            .locator("img")
            .evaluateAll((images) =>
              images
                .filter((image) => image.getClientRects().length > 0)
                .every(
                  (image) =>
                    (image as HTMLImageElement).complete &&
                    (image as HTMLImageElement).naturalWidth > 0,
                ),
            ),
        )
        .toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await page.screenshot({
        path: `docs/qa/studio/${name}-${width}.png`,
        fullPage: true,
      });
    }
});

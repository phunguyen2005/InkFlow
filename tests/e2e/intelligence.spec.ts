import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const root = "/studio/stories/story-blood-orchard";
const chapterUrl = root + "/chapters/blood-orchard-ch-03";
async function intelligence(page: Page) {
  await page.goto(chapterUrl);
  await page.getByRole("button", { name: "Intelligence", exact: true }).click();
  await expect(page.getByLabel("Message InkFlow")).toBeVisible();
}
async function reference(page: Page) {
  await page
    .getByRole("button", { name: "Update reference", exact: true })
    .click();
  await page.getByRole("button", { name: "Use saved chapters" }).click();
  await expect(
    page.getByRole("button", { name: "Context ready", exact: true }),
  ).toBeVisible();
}
async function plan(page: Page) {
  const reviews = page.getByRole("button", { name: "Review", exact: true });
  const before = await reviews.count();
  await page
    .getByLabel("Message InkFlow")
    .fill("Plan Elara discovering the orchard's secret letter.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(reviews).toHaveCount(before + 1);
  await page
    .getByRole("button", { name: "Review", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "Use beats", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate chapter", exact: true })
    .last()
    .click();
  await expect(
    page.getByText("Chapter draft · pending", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Review", exact: true })
    .last()
    .click();
}
test("idea to outline to manuscript; chat and manual writing remain separate", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: /Create new story/i }).click();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("The Quiet Observatory");
  await page.getByRole("button", { name: "Create story", exact: true }).click();
  await page.getByRole("link", { name: "Develop with AI" }).click();
  fs.mkdirSync("docs/qa/intelligence", { recursive: true });
  await expect(page.getByLabel("Message InkFlow")).toBeVisible();
  await page.screenshot({
    path: "docs/qa/intelligence/story-assistant-1440.png",
    fullPage: true,
  });
  await page
    .getByLabel("Message InkFlow")
    .fill("A scientist discovers a message arriving before it was sent.");
  await page.getByLabel("Message InkFlow").press("Enter");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Use outline" }).click();
  await expect(
    page.getByRole("link", { name: "Creative", exact: true }),
  ).toHaveAttribute("href", /\/chapters\//);
  await page.getByRole("link", { name: "Creative", exact: true }).click();
  await expect(page.getByLabel("Chapter title")).toHaveValue(
    "The First Disturbance",
  );
  await expect(page.getByLabel("Chapter manuscript")).toHaveText("");
  await page.getByRole("button", { name: "Intelligence", exact: true }).click();
  await page
    .getByLabel("Message InkFlow")
    .fill("Plan the first discovery in the observatory.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Use beats" }).click();
  await page.getByRole("button", { name: "Generate chapter" }).click();
  await expect(
    page.getByText("Chapter draft · pending", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Review", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "Use draft" }).click();
  await page.getByRole("button", { name: "Creative", exact: true }).click();
  await expect(page.getByLabel("Chapter manuscript")).toContainText(
    "The next choice",
  );
  await page.reload();
  await expect(page.getByLabel("Chapter manuscript")).toContainText(
    "The next choice",
  );
});
test("append and restore; stopped runs retry, composer and manuscript survive modes", async ({
  page,
}) => {
  await intelligence(page);
  await page.getByRole("button", { name: "Creative", exact: true }).click();
  const editor = page.getByLabel("Chapter manuscript");
  await editor.evaluate((element) => {
    (element as HTMLElement).dataset.instanceMarker = "retained";
  });
  await editor.press("Control+End");
  await editor.pressSequentially(" Manual paragraph before AI.");
  await page.getByRole("button", { name: "Intelligence", exact: true }).click();
  await reference(page);
  await page.getByLabel("Message InkFlow").fill("Plan an interrupted scene.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByRole("button", { name: "Stop generation" }).click();
  await expect(page.getByText(/Generation stopped/)).toBeVisible();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByText("Scene beats · pending", { exact: true }),
  ).toBeVisible();
  await plan(page);
  await page.getByRole("button", { name: "Use draft" }).click();
  await page.getByRole("button", { name: "Append", exact: true }).click();
  await page.getByRole("button", { name: "Creative", exact: true }).click();
  await expect(page.getByLabel("Chapter manuscript")).toContainText(
    "The next choice",
  );
  await page.getByRole("button", { name: "Intelligence", exact: true }).click();
  await page
    .getByRole("button", { name: "Reference context", exact: true })
    .click();
  await page.getByText(/Previous manuscript versions/).click();
  await page.getByRole("button", { name: "Restore this version" }).click();
  await page.getByLabel("Message InkFlow").fill("A prompt to keep for later.");
  await page.getByRole("button", { name: "Creative", exact: true }).click();
  await expect(page.getByLabel("Chapter manuscript")).not.toContainText(
    "The next choice",
  );
  await expect(editor).toContainText("Manual paragraph before AI.");
  await expect(editor).toHaveAttribute("data-instance-marker", "retained");
  await page.getByRole("button", { name: "Intelligence", exact: true }).click();
  await expect(page.getByLabel("Message InkFlow")).toHaveValue(
    "A prompt to keep for later.",
  );
  await page.getByRole("button", { name: "Focus mode", exact: true }).click();
  await expect(page.getByLabel("Message InkFlow")).toBeVisible();
  await page
    .getByRole("button", { name: "Generation options", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Generation options" }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Focus mode", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.getByLabel("Message InkFlow")).toHaveValue(
    "A prompt to keep for later.",
  );
});
test("chat and preview are responsive, accessible and visually captured", async ({
  page,
}) => {
  fs.mkdirSync("docs/qa/intelligence", { recursive: true });
  await intelligence(page);
  await reference(page);
  await plan(page);
  for (const width of [1440, 1024, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(
      page.getByRole("complementary", { name: "Draft preview" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `docs/qa/intelligence/preview-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Close preview" }).click();
    await expect(page.getByLabel("Message InkFlow")).toBeVisible();
    const chatAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      chatAudit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `docs/qa/intelligence/chat-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Open preview" }).click();
  }
});
test("another tab does not cancel a running chat; refresh recovers an interrupted request", async ({
  page,
  context,
}) => {
  await intelligence(page);
  await reference(page);
  await page
    .getByLabel("Message InkFlow")
    .fill("Plan a scene. " + "A deliberate unanswered question. ".repeat(100));
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByRole("button", { name: "Stop generation" }),
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto(chapterUrl);
  await expect(other.getByLabel("Message InkFlow")).toBeVisible();
  await expect(
    page.getByText("Scene beats · pending", { exact: true }),
  ).toBeVisible();
  await expect(
    other.getByText("Scene beats · pending", { exact: true }),
  ).toBeVisible();
  await other.close();
  await page
    .getByLabel("Message InkFlow")
    .fill(
      "Plan another scene. " + "A deliberate unanswered question. ".repeat(100),
    );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByRole("button", { name: "Stop generation" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(/This request was interrupted/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Stop generation" }),
  ).not.toBeVisible();
});

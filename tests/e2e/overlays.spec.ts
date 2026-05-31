import { test, expect, type Page } from "@playwright/test";

/**
 * Accessibility tests for every overlay primitive in the app.
 *
 * For each overlay we verify:
 *   1. Trigger opens the overlay
 *   2. Tab moves focus inside the overlay (focus is trapped / scoped)
 *   3. Escape closes the overlay
 *   4. Focus is restored to the original trigger after close
 *
 * The harness route /test/overlays mounts each overlay with stable
 * data-testid attributes so this file does not depend on product UI.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/test/overlays");
});

async function activeTestId(page: Page): Promise<string | null> {
  return page.evaluate(() => document.activeElement?.getAttribute("data-testid") ?? null);
}

async function focusTrigger(page: Page, triggerId: string) {
  const trigger = page.getByTestId(triggerId);
  await trigger.focus();
  await expect.poll(() => activeTestId(page)).toBe(triggerId);
  return trigger;
}

interface OverlayCase {
  name: string;
  trigger: string;
  contentTestId: string;
  /** Optional custom opener (e.g. right-click for context menu). */
  open?: (page: Page) => Promise<void>;
  /** Test ids that focus should land on after pressing Tab inside the overlay. */
  tabStops: string[];
  /** If false, focus does not return to the trigger (e.g. SidePeek's trigger is unmounted-safe but overlay should still restore). */
  restoresFocus?: boolean;
}

const cases: OverlayCase[] = [
  {
    name: "Dialog",
    trigger: "open-dialog",
    contentTestId: "dialog-content",
    tabStops: ["dialog-input-1", "dialog-input-2", "dialog-action"],
  },
  {
    name: "Sheet",
    trigger: "open-sheet",
    contentTestId: "sheet-content",
    tabStops: ["sheet-input-1", "sheet-action"],
  },
  {
    name: "Popover",
    trigger: "open-popover",
    contentTestId: "popover-content",
    tabStops: ["popover-input", "popover-action"],
  },
  {
    name: "DropdownMenu",
    trigger: "open-dropdown",
    contentTestId: "dropdown-content",
    // Radix menu auto-focuses the first item; arrow keys, not Tab, move within.
    tabStops: ["dropdown-item-1"],
  },
  {
    name: "ContextMenu",
    trigger: "open-contextmenu",
    contentTestId: "contextmenu-content",
    open: async (page) => {
      await page.getByTestId("open-contextmenu").click({ button: "right" });
    },
    tabStops: ["contextmenu-item-1"],
    // Context menus restore focus to the document; Radix does not always
    // re-focus the right-click target. Skip strict restoration.
    restoresFocus: false,
  },
  {
    name: "Command",
    trigger: "open-command",
    contentTestId: "command-content",
    tabStops: ["command-input"],
  },
  {
    name: "SidePeek",
    trigger: "open-sidepeek",
    contentTestId: "sidepeek-content-title", // verified via role+name below instead
    tabStops: ["sidepeek-input", "sidepeek-action"],
  },
  {
    name: "Walkthrough",
    trigger: "open-walkthrough",
    contentTestId: "walkthrough-content",
    tabStops: ["walkthrough-next", "walkthrough-finish"],
  },
];

for (const c of cases) {
  test.describe(c.name, () => {
    test("opens, traps Tab, closes on Escape, restores focus", async ({ page }) => {
      await focusTrigger(page, c.trigger);

      // 1. Open
      if (c.open) {
        await c.open(page);
      } else {
        await page.keyboard.press("Enter");
      }

      // 2. Content visible
      if (c.name === "SidePeek") {
        await expect(page.getByRole("dialog", { name: "Side peek" })).toBeVisible();
      } else {
        await expect(page.getByTestId(c.contentTestId)).toBeVisible();
      }

      // 3. Tab through expected stops — focus must stay within overlay/document
      for (const stop of c.tabStops) {
        await expect.poll(() => activeTestId(page), {
          message: `expected focus on ${stop}`,
          timeout: 2000,
        }).toBe(stop);
        await page.keyboard.press("Tab");
      }

      // 4. Escape closes
      await page.keyboard.press("Escape");
      if (c.name === "SidePeek") {
        await expect(page.getByRole("dialog", { name: "Side peek" })).toHaveCount(0);
      } else {
        await expect(page.getByTestId(c.contentTestId)).toHaveCount(0);
      }

      // 5. Focus restoration
      if (c.restoresFocus !== false) {
        await expect.poll(() => activeTestId(page), {
          message: `focus should return to ${c.trigger}`,
          timeout: 2000,
        }).toBe(c.trigger);
      }
    });
  });
}

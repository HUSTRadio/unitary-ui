import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * HIG-AUD-019 运行验收（WCAG 2.3.3）：`prefers-reduced-motion: reduce` 下浮层不得播放入场
 * 动画，且功能不受影响。
 *
 * 为什么必须看 `animation-name` 而不是时长：全局兜底（`index.css` 的
 * `animation-duration: 0.01ms !important`）只压时长、不改 animation-name，因此
 * `animation-name: none` 才能区分「组件级 motion-reduce:animate-none」与「只靠兜底」。
 * 组件级类名契约见 `tests/reduced-motion-coverage.test.ts`。
 */
const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

async function openRoute(page: Page, route: string, theme: Theme) {
  // 必须用显式 emulateMedia：本项目配置下 `test.use({ reducedMotion })` 实测不生效
  // （探针里读 `matchMedia("(prefers-reduced-motion: reduce)").matches` 为 false，
  // 会让本文件的断言在「无模拟」下假失败）。
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((value) => {
    window.localStorage.setItem("geist-theme-preference", value);
    window.localStorage.setItem("geist-docs-language", "en-US");
  }, theme);
  await page.goto(route);
  await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
}

/** 断言命中的每个元素都关掉了动画（`animation: none` → animation-name: none）。 */
async function expectNoAnimation(locator: Locator, label: string) {
  const names = await locator.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).animationName),
  );
  expect(names.length, `${label}: no element matched`).toBeGreaterThan(0);
  expect(names, `${label} must not animate under reduced motion`).toEqual(
    names.map(() => "none"),
  );
}

/**
 * 取序列化色值的 alpha：兼容 `oklab(0.96 0 0 / 0.8)`、`rgba(0, 0, 0, 0.4)`、
 * `rgb(0 0 0 / 40%)` 三种序列化（`/` 后有空格、百分比形式的 alpha 都要能解析）。
 */
function colorAlpha(serialized: string) {
  const raw = Number(serialized.match(/(?:\/|,)\s*([\d.]+)%?\)\s*$/)?.[1] ?? NaN);
  return raw > 1 ? raw / 100 : raw;
}

for (const theme of THEMES) {
  test(`modal: no entry animation, scrim keeps its own alpha (${theme})`, async ({ page }) => {
    await openRoute(page, "/#/components/modal", theme);

    await page.getByRole("button", { name: "Open Modal", exact: true }).first().click();
    const content = page.locator('[data-slot="modal-content"]').first();
    const overlay = page.locator('div.fixed.inset-0[data-state="open"]').first();
    await expect(content).toBeVisible();
    await expect(overlay).toBeVisible();

    await expectNoAnimation(overlay, "modal overlay");
    await expectNoAnimation(content, "modal content");

    // HIG-AUD-010：遮罩暗度必须写在颜色里。元素 opacity-* 方案会把 Content 子节点
    // 一起降透明（真实的「半透明卡片」回归），故同时锁住元素 opacity = 1 与色值 alpha ≈ 0.8。
    const scrim = await overlay.evaluate((node) => {
      const style = getComputedStyle(node);
      return { opacity: style.opacity, background: style.backgroundColor };
    });
    expect(scrim.opacity).toBe("1");
    expect(colorAlpha(scrim.background)).toBeCloseTo(0.8, 2);

    // 功能不受影响：Escape 仍能关闭（Radix 在无动画时直接卸载）
    await page.keyboard.press("Escape");
    await expect(content).not.toBeVisible();
  });

  test(`quick actions: scrim + menu skip animation, Escape still tears the scrim down (${theme})`, async ({
    page,
  }) => {
    await openRoute(page, "/#/components/context-menu", theme);

    const card = page.getByRole("button", { name: "Notes", exact: true });
    await card.scrollIntoViewIfNeeded();
    await card.click({ button: "right" });

    const scrim = page.locator('[data-slot="context-menu-quick-actions-overlay"]');
    await expect(scrim).toBeVisible();
    await expectNoAnimation(scrim, "quick actions scrim");
    await expectNoAnimation(page.locator('[role="menu"]').first(), "quick actions menu");

    await page.keyboard.press("Escape");
    await expect(scrim).toHaveCount(0);
  });

  test(`bottom sheet: panel skips animation and still closes (${theme})`, async ({ page }) => {
    await openRoute(page, "/#/components/activity-view", theme);

    await page.getByRole("button", { name: "Share", exact: true }).first().click();
    const panel = page.locator('[data-slot="bottom-sheet"]');
    await expect(panel).toBeVisible();
    await expectNoAnimation(panel, "bottom sheet panel");

    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
  });

  test(`command menu: stylesheet fallback also yields animation-name none (${theme})`, async ({
    page,
  }) => {
    await openRoute(page, "/#/components", theme);

    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox");
    await expect(input).toBeVisible();

    await expectNoAnimation(page.locator(".command-menu-overlay").first(), "command overlay");
    await expectNoAnimation(page.locator(".command-menu-scale").first(), "command panel");

    // 功能不受影响：仍可键入过滤（关闭路径由 command-search.spec.ts 覆盖）
    await input.fill("modal");
    await expect(page.getByRole("option").first()).toBeVisible();
  });
}

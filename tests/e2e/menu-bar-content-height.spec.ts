import { expect, test, type Page } from "@playwright/test";

/**
 * MenuBar 长菜单高度约束回归（HIG-AUD-038）。
 *
 * 缺陷形态：`MENU_BAR_SURFACE` 曾无任何 max-h 约束，长菜单溢出视口下沿
 * （2026-09-18 增补台账 §5A 实测：390×844 注入 40 项后菜单底边 y=2005、
 * 溢出 1161px、`maxHeight: none`、容器内不可滚动），且 Radix Menubar
 * 打开时锁 body 滚动 → 尾部菜单项既不可滚也不可点。
 *
 * 修复：MenuBarContent / MenuBarSubContent 分别消费 Radix 暴露的
 * available-height CSS 变量（与 `menu.tsx` 的 dropdown-menu 变量同族做法；
 * 顶级与子菜单的变量名不同，故不进共享常量）。
 *
 * 验收场景（台账口径）：320×700 视口打开 20 项菜单，完整可见、内部可
 * 滚动、尾部菜单项可达。合成项通过克隆真实菜单项 DOM 注入——高度约束
 * 是纯 CSS 行为，注入节点即可测；原生尾部项保留 React 事件绑定，
 * 用于验证「可达且可点击」。
 *
 * 注意：Radix Menubar 的顶级触发器 role 是 `menuitem`（ARIA menubar
 * 模式，非 button），页面快照已确认。
 */

test.use({ viewport: { width: 320, height: 700 } });

// Radix MenubarTrigger 的 role 是 menuitem（ARIA menubar 模式），不是 button；
// 站内路由为 hash 形式（/#/components/menu-bar）。
test.setTimeout(3 * 60_000);

async function openMenuBarDemo(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("geist-docs-language", "en-US");
    window.localStorage.setItem("geist-theme-preference", "light");
  });
  await page.goto("/#/components/menu-bar");
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

/** 克隆真实菜单项注入 count 个合成项，插到容器最前（原生尾部项保持在末尾）。 */
async function injectSyntheticItems(node: HTMLElement, count: number) {
  const item = node.querySelector('[data-slot="menu-bar-item"]');
  if (!(item instanceof HTMLElement)) {
    throw new Error("no menu-bar-item available to clone");
  }
  const synthetic = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const clone = item.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-injected", "true");
    clone.textContent = `Synthetic ${i + 1}`;
    synthetic.appendChild(clone);
  }
  node.prepend(synthetic);
}

async function openFileMenu(page: Page) {
  const fileTrigger = page.getByRole("menubar").getByRole("menuitem", { name: "File" });
  await fileTrigger.scrollIntoViewIfNeeded();
  await fileTrigger.click();
  const content = page.locator('[data-slot="menu-bar-content"]');
  await expect(content).toBeVisible();
  // 等 open 动画（zoom-in-95 transform）结束，避免其影响 getBoundingClientRect
  await page.waitForTimeout(400);
  return content;
}

test("long top-level menus are height-constrained, scrollable, and the tail stays reachable", async ({
  page,
}) => {
  await openMenuBarDemo(page);
  const content = await openFileMenu(page);

  await content.evaluate(injectSyntheticItems, 20);

  const viewportHeight = page.viewportSize()!.height;

  // 1) 高度约束生效：Radix available-height 变量被消费（若变量缺失则 computed = "none"）
  const metrics = await content.evaluate((node) => ({
    maxHeight: getComputedStyle(node).maxHeight,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
    bottom: node.getBoundingClientRect().bottom,
  }));
  expect(metrics.maxHeight).not.toBe("none");
  expect(Number.parseInt(metrics.maxHeight, 10)).toBeGreaterThan(0);

  // 2) 菜单整体不溢出视口下沿（缺陷形态：无约束时底边 y=2005、溢出 1161px）
  expect(metrics.bottom).toBeLessThanOrEqual(viewportHeight);

  // 3) 内容超出约束高度 → 容器内部可滚动（overflow-y-auto 生效）
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  // 4) 滚到底后，尾部原生项（Export 子菜单触发器）可见且可点击
  await content.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  const exportTrigger = content.getByText("Export");
  await expect(exportTrigger).toBeVisible();
  await exportTrigger.click();
  await expect(page.locator('[data-slot="menu-bar-sub-content"]')).toBeVisible();
});

test("submenus are height-constrained as well", async ({ page }) => {
  await openMenuBarDemo(page);
  const content = await openFileMenu(page);

  await content.getByText("Export").click();
  const subContent = page.locator('[data-slot="menu-bar-sub-content"]');
  await expect(subContent).toBeVisible();
  await page.waitForTimeout(400);

  await subContent.evaluate(injectSyntheticItems, 20);

  const viewportHeight = page.viewportSize()!.height;
  const metrics = await subContent.evaluate((node) => ({
    maxHeight: getComputedStyle(node).maxHeight,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
    top: node.getBoundingClientRect().top,
    bottom: node.getBoundingClientRect().bottom,
    popperVar: getComputedStyle(node).getPropertyValue("--radix-popper-available-height").trim(),
  }));
  // 诊断：子菜单的约束源是 popper 原生变量（Radix menubar 不生成 sub 命名空间变量）
  console.log(
    `[menu-bar-038] sub maxHeight=${metrics.maxHeight} popperVar="${metrics.popperVar}" top=${metrics.top.toFixed(0)} bottom=${metrics.bottom.toFixed(0)} viewport=${viewportHeight}`,
  );

  expect(metrics.maxHeight).not.toBe("none");
  expect(metrics.bottom).toBeLessThanOrEqual(viewportHeight);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

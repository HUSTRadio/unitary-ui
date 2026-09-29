import { expect, test, type Page } from "@playwright/test";

/**
 * 导航排版同源（用户实测 2026-09-29，次级宽屏 900 vs 宽屏 1280）：
 * 侧栏与「折叠成抽屉」是同一份导航数据的两种形态，内部排版必须来自同一契约
 * （src/components/ui/nav-layout.ts）——内缩、药丸左缘、标签列、层次对齐、
 * 分组节奏、行高、标题折叠指示与滚动条槽位全部对齐。
 *
 * 断言按「相对外壳左缘的偏移」比较（不写死像素），几何数值只在此处做一次实测兜底。
 */
const PAD = 2;

interface Selectors {
  /** 唯一 scroll owner：侧栏是 aside，抽屉是 menu-nav（内容内缩与滚动条槽位都在它身上） */
  scrollOwner: string;
  /** 分组容器：承载分组节奏（gap）与条目/标题 */
  groupContainer: string;
  /** 外壳：偏移量的参照原点（侧栏 aside / 抽屉面板） */
  shell: string;
  item: string;
  heading: string;
}

interface Metrics {
  contentInset: string;
  groupGap: string;
  scrollbarWidth: number;
  headingLabelOffsetFromShell: number | null;
  itemPillOffsetFromShell: number | null;
  itemLabelOffsetFromShell: number | null;
  pillToHeadingLabelDelta: number | null;
  itemHeights: number[];
  itemPadding: string | null;
  headingHeights: number[];
  headingHasChevron: boolean;
  headingRole: string | null;
  interGroupSpacing: number | null;
  /** 折叠内容盒底边相对最后一条目底边的余量（不得虚高，见下方回归说明） */
  contentBottomGap: number | null;
  activeIndicatorColor: string | null;
}

function measure(page: Page, selectors: Selectors): Promise<Metrics> {
  return page.evaluate((s) => {
    const round = (v: number) => Math.round(v * 100) / 100;
    const scrollOwner = document.querySelector<HTMLElement>(s.scrollOwner)!;
    const container = document.querySelector<HTMLElement>(s.groupContainer)!;
    const shell = scrollOwner.closest<HTMLElement>(s.shell) ?? scrollOwner;

    const items = Array.from(container.querySelectorAll<HTMLElement>(s.item));
    const headings = Array.from(container.querySelectorAll<HTMLElement>(s.heading));
    const marker = container.querySelector<HTMLElement>(
      '[data-slot="sidebar-nav-indicator"], [data-slot="menu-item-indicator"]',
    );
    const groups = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-slot="sidebar-nav-group"], [data-slot="menu-group"]',
      ),
    );
    const firstGroup = groups.find((group) => group.querySelector(s.item));
    const groupItems = firstGroup
      ? Array.from(firstGroup.querySelectorAll<HTMLElement>(s.item))
      : [];
    const firstItem = items[0];
    const lastItem = groupItems[groupItems.length - 1] ?? null;
    const content =
      firstGroup?.querySelector<HTMLElement>(
        '[data-slot="sidebar-nav-content"], [data-slot="menu-group-content"]',
      ) ?? null;
    const style = getComputedStyle(scrollOwner);
    const shellX = shell.getBoundingClientRect().x;

    return {
      contentInset: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
      groupGap: getComputedStyle(container).gap,
      scrollbarWidth: round(scrollOwner.getBoundingClientRect().width - scrollOwner.clientWidth),
      headingLabelOffsetFromShell: headings[0]
        ? round(headings[0].querySelector("span")!.getBoundingClientRect().x - shellX)
        : null,
      itemPillOffsetFromShell: firstItem
        ? round(firstItem.getBoundingClientRect().x - shellX)
        : null,
      itemLabelOffsetFromShell: firstItem
        ? round(firstItem.querySelector("span.truncate")!.getBoundingClientRect().x - shellX)
        : null,
      pillToHeadingLabelDelta:
        firstItem && headings[0]
          ? round(
              firstItem.getBoundingClientRect().x -
                headings[0].querySelector("span")!.getBoundingClientRect().x,
            )
          : null,
      itemHeights: [
        ...new Set(items.slice(0, 12).map((i) => round(i.getBoundingClientRect().height))),
      ],
      itemPadding: firstItem ? getComputedStyle(firstItem).padding : null,
      headingHeights: [...new Set(headings.map((h) => round(h.getBoundingClientRect().height)))],
      headingHasChevron: !!headings[0]?.getAttribute("data-icon"),
      headingRole: headings[0]?.getAttribute("role") ?? null,
      interGroupSpacing:
        headings[1] && groupItems.length > 0
          ? round(
              headings[1].getBoundingClientRect().top -
                groupItems[groupItems.length - 1].getBoundingClientRect().bottom,
            )
          : null,
      contentBottomGap:
        content && lastItem
          ? round(
              content.getBoundingClientRect().bottom - lastItem.getBoundingClientRect().bottom,
            )
          : null,
      activeIndicatorColor: marker ? getComputedStyle(marker).backgroundColor : null,
    };
  }, selectors);
}

test("次级宽屏抽屉与宽屏侧栏的导航排版同源", async ({ page }) => {
  // 宽屏（≥lg）：常驻侧栏
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/#/components/link");
  await page.waitForSelector('[data-slot="docs-sidebar"] [data-slot="sidebar-nav-item"]');
  await page.waitForTimeout(400);
  const sidebar = await measure(page, {
    scrollOwner: '[data-slot="docs-sidebar"]',
    groupContainer: '[data-slot="sidebar-nav"]',
    shell: '[data-slot="docs-sidebar"]',
    item: '[data-slot="sidebar-nav-item"]',
    heading: '[data-slot="sidebar-nav-heading"]',
  });
  await page
    .locator('[data-slot="docs-sidebar"]')
    .screenshot({ path: ".scratch/nav-parity/sidebar.png" });

  // 次级宽屏（md–lg）：同一份导航折叠成抽屉（指针场景）
  await page.setViewportSize({ width: 900, height: 900 });
  await page.waitForTimeout(300);
  await page.locator('[data-slot="hamburger-trigger"]').click();
  await page.waitForSelector('[data-slot="menu-nav"] [data-slot="menu-group"] a');
  await page.waitForTimeout(700);
  const drawer = await measure(page, {
    scrollOwner: '[data-slot="menu-nav"]',
    groupContainer: '[data-slot="menu-list"]',
    shell: '[data-slot="expand-panel"]',
    item: '[data-slot="menu-group"] a',
    heading: '[data-slot="menu-group-heading"]',
  });
  await page
    .locator('[data-slot="expand-panel"]')
    .screenshot({ path: ".scratch/nav-parity/drawer.png" });

  console.log("SIDEBAR\n" + JSON.stringify(sidebar, null, 2));
  console.log("DRAWER\n" + JSON.stringify(drawer, null, 2));

  // 内容内缩与分组节奏：同一组数值
  expect(sidebar.contentInset, "侧栏内容内缩").toBe("16px 24px 16px 24px");
  expect(drawer.contentInset, "抽屉内容内缩").toBe("16px 24px 16px 24px");
  expect(sidebar.groupGap, "侧栏分组节奏").toBe("16px");
  expect(drawer.groupGap, "抽屉分组节奏").toBe("16px");

  // 文字列几何：相对外壳左缘的偏移两处相等（外壳左边界差 1px 由 PAD 吸收）
  for (const key of [
    "headingLabelOffsetFromShell",
    "itemPillOffsetFromShell",
    "itemLabelOffsetFromShell",
    "pillToHeadingLabelDelta",
    "interGroupSpacing",
  ] as const) {
    const a = sidebar[key];
    const b = drawer[key];
    expect(typeof a, `sidebar.${key} 未测到`).toBe("number");
    expect(typeof b, `drawer.${key} 未测到`).toBe("number");
    expect(
      Math.abs((a as number) - (b as number)),
      `${key}: sidebar=${String(a)} drawer=${String(b)}`,
    ).toBeLessThanOrEqual(PAD);
  }
  // 层次对齐：药丸左缘 = 小标题文字左缘
  expect(sidebar.pillToHeadingLabelDelta).toBe(0);
  expect(drawer.pillToHeadingLabelDelta).toBe(0);
  // 折叠内容盒不得虚高（回归：高度若按 scrollHeight 测量，会把逐项浮现动画的
  // transform 造成的可滚动溢出算进来——抽屉分组曾被撑高 8px、分组节奏变 24px）
  expect(sidebar.contentBottomGap).toBe(0);
  expect(drawer.contentBottomGap).toBe(0);

  // 行几何与标题：鼠标环境都是 36px 行 / 32px 标题 + 折叠 chevron
  expect(sidebar.itemHeights).toEqual([36]);
  expect(drawer.itemHeights).toEqual([36]);
  expect(sidebar.itemPadding).toBe("0px 14px");
  expect(drawer.itemPadding).toBe("0px 14px");
  expect(sidebar.headingHeights).toEqual([32]);
  expect(drawer.headingHeights).toEqual([32]);
  expect(sidebar.headingHasChevron).toBe(true);
  expect(drawer.headingHasChevron).toBe(true);
  expect(sidebar.headingRole).toBe("button");
  expect(drawer.headingRole).toBe("button");

  // 选中指示条同色；两侧都预留滚动条稳定槽位（细滚动条 + stable both-edges）
  expect(drawer.activeIndicatorColor).toBe(sidebar.activeIndicatorColor);
  expect(sidebar.scrollbarWidth).toBeGreaterThanOrEqual(16);
  expect(drawer.scrollbarWidth).toBeGreaterThanOrEqual(16);
});

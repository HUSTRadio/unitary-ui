import { mkdirSync, appendFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test, type Page } from "@playwright/test";

import { DOCS_ROUTE_SEQUENCE } from "../../docs/geist/src/data/docs-routes";

/**
 * docs 布局审计 harness（计划任务 11 步骤 4–6）。
 *
 * 对全部 registry route × 6 viewport × 2 theme 采集 LayoutEvidence，
 * 并做计划步骤 5 的确定性断言（证据驱动，Task 12 只修 JSON 命中的 owner）。
 * 原始证据逐条追加到 .scratch/docs-layout-audit.jsonl，结束后合并为
 * .scratch/docs-layout-audit.json（含统计摘要）。
 */

/* ---------------- 固定矩阵 ---------------- */

const VIEWPORTS: ReadonlyArray<{ width: number; height: number }> = [
  { width: 1440, height: 900 },
  { width: 1100, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
];
const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

const ROUTES = DOCS_ROUTE_SEQUENCE.map((route) => route.to);
const STATIC_ROUTES = ROUTES.filter((to) => !to.startsWith("/components/"));
const COMPONENT_ROUTES = ROUTES.filter((to) => to.startsWith("/components/"));

const SCRATCH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.scratch");
const JSONL_PATH = path.join(SCRATCH, "docs-layout-audit.jsonl");
const JSON_PATH = path.join(SCRATCH, "docs-layout-audit.json");
const SHOT_DIR = path.join(SCRATCH, "screenshots");

/* ---------------- 证据模型（计划步骤 4） ---------------- */

interface RectJSON {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ButtonEvidence {
  label: string;
  rect: RectJSON;
}

interface LayoutEvidence {
  route: string;
  theme: Theme;
  viewport: { width: number; height: number };
  rootClientWidth: number;
  rootScrollWidth: number;
  navbar: RectJSON | null;
  main: RectJSON | null;
  sidebar: RectJSON | null;
  sidebarVisible: boolean;
  hamburger: RectJSON | null;
  hamburgerVisible: boolean;
  desktopSearchVisible: boolean;
  topbarBlocks: Record<string, RectJSON | null>;
  mobileTopbarButtons: ButtonEvidence[];
  activeItem: string | null;
  localScrollOwners: Array<{
    selector: string;
    clientWidth: number;
    scrollWidth: number;
    rect: RectJSON;
    insideMain: boolean;
    demoCard: string | null;
    componentScrollPrimitive: "scroller" | "tabs" | "table-root" | "code-block-tabs" | null;
  }>;
  stickyDelta: number | null;
  hasPageInProgress: boolean;
  colorsSample?: Array<{ token: string; displayed: string; computed: string }>;
  materialsCounts?: { surface: number; floating: number; mentionsZIndex: boolean };
  gridStats?: {
    sections: string[];
    gridCount: number;
    guideCount: number;
    crossCount: number;
    responsiveColumns: number | null;
    responsiveRows: number | null;
    clipping: Array<{ section: string; guideCount: number; hiddenEdges: number }>;
  };
}

interface CheckFailure {
  assertion: string;
  route: string;
  viewport: { width: number; height: number };
  theme: Theme;
  selector: string;
  detail: string;
  measured: unknown;
}

/* ---------------- 采集与断言辅助 ---------------- */

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

let navigationSequence = 0;

async function loadDocsRoute(page: Page, route: string) {
  const url = `/?docs-layout-navigation=${++navigationSequence}#${route}`;
  await page.goto(url);
  try {
    // 90s: /components 是最重的路由（注册表索引导入全部组件），Vite dev 冷启动按需转换可超 30s（2026-09-10 实测 flake）
    await page.locator('[data-slot="navbar"]').first().waitFor({
      state: "visible",
      timeout: 90_000,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Docs shell did not become ready for route "${route}" (${url}): ${detail}`);
  }
}

async function gotoRoute(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await loadDocsRoute(page, route);
  await settle(page);
}

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((value) => {
    window.localStorage.setItem("geist-theme-preference", value);
  }, theme);
}

/** 页内一次性采集 LayoutEvidence */
async function collectEvidence(page: Page): Promise<Omit<LayoutEvidence, "route" | "theme">> {
  return page.evaluate(() => {
    const round = (n: number) => Math.round(n * 100) / 100;
    const rectJson = (el: Element | null | undefined): RectJSON | null => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && r.top === 0 && r.left === 0) return null;
      return {
        x: round(r.x),
        y: round(r.y),
        width: round(r.width),
        height: round(r.height),
        top: round(r.top),
        bottom: round(r.bottom),
        left: round(r.left),
        right: round(r.right),
      };
    };
    const isVisible = (el: Element | null | undefined): boolean => {
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const describe = (el: Element): string => {
      const slot = el.getAttribute("data-slot");
      const demo =
        el.getAttribute("data-demo-card") ??
        el.getAttribute("data-demo-container") ??
        el.getAttribute("data-grid-demo");
      const cls = (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".");
      return `${el.tagName.toLowerCase()}${slot ? `[data-slot=${slot}]` : ""}${
        demo ? `[${demo}]` : ""
      }${cls ? `.${cls}` : ""}`;
    };

    const root = document.documentElement;
    const navbar = document.querySelector<HTMLElement>('[data-slot="navbar"]');
    const sidebar = document.querySelector<HTMLElement>('[data-slot="docs-sidebar"]');
    const hamburger = document.querySelector<HTMLElement>('[data-slot="hamburger-trigger"]');
    const main = document.getElementById("main-content");
    const mainRect = main?.getBoundingClientRect();

    const topbarBlocks: Record<string, RectJSON | null> = {
      brand: rectJson(document.querySelector('[data-slot="docs-topbar-brand"]')),
      search: rectJson(document.querySelector('[data-slot="docs-desktop-search"]')),
      actions: rectJson(document.querySelector('[data-slot="docs-topbar-actions"]')),
    };

    // 手机 topbar 可见按钮（触控目标检查用）
    const mobileTopbarButtons: ButtonEvidence[] = [];
    if (window.innerWidth < 768 && navbar) {
      for (const button of Array.from(navbar.querySelectorAll("button"))) {
        if (!isVisible(button)) continue;
        mobileTopbarButtons.push({
          label: button.getAttribute("aria-label") ?? (button.textContent ?? "").trim().slice(0, 24),
          rect: rectJson(button)!,
        });
      }
    }

    // 局部横向滚动 owner：overflowX 非 visible 且内容超宽（±1px 容差）
    const localScrollOwners: LayoutEvidence["localScrollOwners"] = [];
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      if (!(el instanceof HTMLElement)) continue;
      if (!isVisible(el)) continue;
      const cs = getComputedStyle(el);
      // `hidden`/`clip` are truncation owners (for example `.truncate`), not
      // user-scrollable regions. Only audit actual horizontal scroll owners.
      if (cs.overflowX !== "auto" && cs.overflowX !== "scroll") continue;
      if (el.scrollWidth <= el.clientWidth + 1) continue;
      const r = el.getBoundingClientRect();
      const insideMain =
        !!mainRect &&
        r.left >= mainRect.left - 1 &&
        r.right <= mainRect.right + 1 &&
        r.top >= mainRect.top - 1 &&
        r.bottom <= mainRect.bottom + 1;
      const demoCard = el.closest('[data-demo-card]')?.getAttribute("data-demo-card") ?? null;
      const componentSlot = el
        .closest('[data-slot="scroller"], [data-slot="tabs"], [data-slot="table-root"], [data-slot="code-block-tabs"]')
        ?.getAttribute("data-slot");
      const componentScrollPrimitive =
        componentSlot === "scroller" ||
        componentSlot === "tabs" ||
        componentSlot === "table-root" ||
        componentSlot === "code-block-tabs"
          ? componentSlot
          : null;
      localScrollOwners.push({
        selector: describe(el),
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        rect: rectJson(el)!,
        insideMain,
        demoCard,
        componentScrollPrimitive,
      });
    }

    // sticky 校验：仅桌面且页面可滚动时才有意义（sticky 在滚动后同步生效）
    let stickyDelta: number | null = null;
    if (
      window.innerWidth >= 1024 &&
      sidebar &&
      isVisible(sidebar) &&
      document.documentElement.scrollHeight > window.innerHeight + 10
    ) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      const navRect = navbar?.getBoundingClientRect();
      const sideRect = sidebar.getBoundingClientRect();
      if (navRect) stickyDelta = round(sideRect.top - navRect.bottom);
      window.scrollTo(0, 0);
    }

    const activeEl =
      document.querySelector<HTMLElement>('[data-slot="docs-sidebar"] [aria-current="page"]') ??
      document.querySelector<HTMLElement>('[data-slot="expand-panel"] [aria-current="page"]');

    const bodyText = document.body.innerText;

    const evidence: Omit<LayoutEvidence, "route" | "theme"> = {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      rootClientWidth: root.clientWidth,
      rootScrollWidth: root.scrollWidth,
      navbar: rectJson(navbar ?? null),
      main: rectJson(main ?? null),
      sidebar: rectJson(sidebar ?? null),
      sidebarVisible: isVisible(sidebar),
      hamburger: rectJson(hamburger ?? null),
      hamburgerVisible: isVisible(hamburger),
      desktopSearchVisible: isVisible(
        document.querySelector('[data-slot="docs-desktop-search"]'),
      ),
      topbarBlocks,
      mobileTopbarButtons,
      activeItem: activeEl?.textContent?.trim() ?? null,
      localScrollOwners,
      stickyDelta,
      hasPageInProgress:
        bodyText.includes("Page in progress") || bodyText.includes("页面开发中"),
    };

    /* ---- /colors：token-sensitive computed 抽样 ---- */
    if (location.hash.startsWith("#/colors")) {
      const swatches = Array.from(
        document.querySelectorAll<HTMLButtonElement>("[data-color-token]"),
      );
      const picked = [
        swatches[0],
        swatches[Math.floor(swatches.length / 2)],
        swatches[swatches.length - 1],
      ].filter((el): el is HTMLButtonElement => !!el);
      evidence.colorsSample = picked.map((el) => {
        const token = el.getAttribute("data-color-token")!;
        // swatch 结构：<button><span 色块/><span 信息区>step/token/显示值</span></button>
        const displayed = (el.lastElementChild?.lastElementChild?.textContent ?? "").trim();
        const computed = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim();
        return { token, displayed, computed };
      });
    }

    /* ---- /materials：Surface/Floating 分组计数 ---- */
    if (location.hash.startsWith("#/materials")) {
      evidence.materialsCounts = {
        surface: document.querySelectorAll('[data-material-group="surface"] > div > dl').length,
        floating: document.querySelectorAll('[data-material-group="floating"] > div > dl').length,
        mentionsZIndex: /z-index/i.test(bodyText),
      };
    }

    /* ---- /grid：真实 Grid DOM 与 guide/clipping 记录 ---- */
    if (location.hash.startsWith("#/grid")) {
      const sections = Array.from(document.querySelectorAll("[data-grid-demo]")).map(
        (el) => el.getAttribute("data-grid-demo")!,
      );
      const responsive = document.querySelector<HTMLElement>(
        '[data-grid-demo="responsive-breakpoints"] [data-slot="grid"]',
      );
      const responsiveStyle = responsive ? getComputedStyle(responsive) : null;
      const clipping = ["responsive-clipping", "specific-clipping"].map((section) => {
        const guides = Array.from(
          document.querySelectorAll<HTMLElement>(
            `[data-grid-demo="${section}"] [data-grid-guides] > *`,
          ),
        );
        return {
          section,
          guideCount: guides.length,
          hiddenEdges: guides.reduce((count, guide) => {
            const style = getComputedStyle(guide);
            return count + Number(style.borderRightWidth === "0px") + Number(style.borderBottomWidth === "0px");
          }, 0),
        };
      });
      evidence.gridStats = {
        sections,
        gridCount: document.querySelectorAll('[data-slot="grid"]').length,
        guideCount: document.querySelectorAll("[data-grid-guides] > *").length,
        crossCount: document.querySelectorAll('[data-slot="grid-cross"]').length,
        responsiveColumns: responsiveStyle
          ? responsiveStyle.gridTemplateColumns.split(" ").filter(Boolean).length
          : null,
        responsiveRows: responsiveStyle
          ? responsiveStyle.gridTemplateRows.split(" ").filter(Boolean).length
          : null,
        clipping,
      };
    }

    return evidence;
  });
}

/** 计划步骤 5 的确定性断言（每组合） */
function runChecks(
  route: string,
  theme: Theme,
  viewport: { width: number; height: number },
  ev: Omit<LayoutEvidence, "route" | "theme">,
): CheckFailure[] {
  const failures: CheckFailure[] = [];
  const fail = (
    assertion: string,
    detail: string,
    measured: unknown = null,
    selector = "document",
  ) => {
    failures.push({ assertion, route, viewport, theme, selector, detail, measured });
  };
  const width = viewport.width;

  // 1. root 零水平溢出（±1px）
  if (ev.rootScrollWidth > ev.rootClientWidth + 1) {
    fail(
      "no-root-horizontal-overflow",
      `documentElement.scrollWidth ${ev.rootScrollWidth} > clientWidth ${ev.rootClientWidth} + 1`,
      { rootScrollWidth: ev.rootScrollWidth, rootClientWidth: ev.rootClientWidth },
      "html",
    );
  }

  // 2/3. sidebar / hamburger / desktop search 断点行为
  if (width >= 1024) {
    if (!ev.sidebarVisible)
      fail("sidebar-visible-desktop", "sidebar 应可见");
    if (ev.hamburgerVisible)
      fail("hamburger-hidden-desktop", "hamburger 应隐藏");
    if (!ev.desktopSearchVisible)
      fail("desktop-search-visible", "desktop search 应可见");
  } else {
    if (ev.sidebarVisible)
      fail("sidebar-hidden-below-lg", "sidebar 应隐藏");
    if (!ev.hamburgerVisible)
      fail("hamburger-visible-below-lg", "hamburger 应可见");
  }

  // 4. topbar 主区块互不交叠且都在 navbar 内
  if (ev.navbar) {
    const nb = ev.navbar;
    const visibleBlocks = Object.entries(ev.topbarBlocks).filter(([, r]) => r !== null) as Array<
      [string, RectJSON]
    >;
    for (const [name, r] of visibleBlocks) {
      if (
        r.left < nb.left - 1 ||
        r.right > nb.right + 1 ||
        r.top < nb.top - 1 ||
        r.bottom > nb.bottom + 1
      ) {
        fail("topbar-block-within-navbar", `topbar 区块 ${name} 超出 navbar 边界`);
      }
    }
    for (let i = 0; i < visibleBlocks.length; i += 1) {
      for (let j = i + 1; j < visibleBlocks.length; j += 1) {
        const [nameA, a] = visibleBlocks[i];
        const [nameB, b] = visibleBlocks[j];
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 1 && overlapY > 1) {
          fail("topbar-blocks-no-overlap", `topbar 区块 ${nameA} 与 ${nameB} 交叠`);
        }
      }
    }
  }

  // 5. 手机（<768）可见 topbar button 触控目标 ≥44px
  if (width < 768) {
    for (const button of ev.mobileTopbarButtons) {
      if (button.rect.width < 43.5 || button.rect.height < 43.5) {
        fail(
          "mobile-touch-target-44",
          `topbar 按钮 "${button.label}" ${button.rect.width}x${button.rect.height} < 44px`,
        );
      }
    }
  }

  // 6. sticky 误差 ≤1px（仅测得的组合）
  if (ev.stickyDelta !== null && Math.abs(ev.stickyDelta) > 1) {
    fail(
      "sidebar-sticky-alignment",
      `sidebar top 与 navbar bottom 误差 ${ev.stickyDelta}px > 1px`,
    );
  }

  // 7. 局部滚动 owner 白名单：pre、显式 docs-local-scroll，以及 canonical scroll primitives。
  // Scroller/Tabs/TableRoot/CodeBlockTabs 的滚动节点本身是被文档展示的组件契约，
  // 无法同时改写其唯一 data-slot。
  for (const owner of ev.localScrollOwners) {
    const allowedTag = owner.selector.startsWith("pre");
    const allowedSlot = owner.selector.includes("data-slot=docs-local-scroll");
    const allowedPrimitive = owner.componentScrollPrimitive !== null;
    if (!allowedTag && !allowedSlot && !allowedPrimitive) {
      fail(
        "local-scroll-owner-whitelist",
        `非白名单局部滚动 owner：${owner.selector} (${owner.clientWidth} → ${owner.scrollWidth})`,
        owner,
        owner.selector,
      );
    } else if (!owner.insideMain) {
      fail(
        "local-scroll-owner-inside-main",
        `局部滚动 owner rect 超出 main content 边界：${owner.selector}`,
        owner.rect,
        owner.selector,
      );
    }
  }

  // 8. 禁止 pageInProgress 文案
  if (ev.hasPageInProgress) {
    fail("no-page-in-progress-copy", "页面出现 pageInProgress 文案");
  }

  // 9a. /colors 显示值 == computed 值（Clipboard 真值在专项测试）
  if (ev.colorsSample) {
    for (const sample of ev.colorsSample) {
      if (sample.displayed !== sample.computed) {
        fail(
          "colors-computed-value-contract",
          `swatch ${sample.token} 显示值 "${sample.displayed}" ≠ computed "${sample.computed}"`,
        );
      }
    }
  }

  // 10. /materials Surface 四项 + Floating 四项，且不把 z-index 声称为 material 属性
  if (ev.materialsCounts) {
    if (ev.materialsCounts.surface !== 4 || ev.materialsCounts.floating !== 4) {
      fail(
        "materials-grouping",
        `Surface=${ev.materialsCounts.surface}/4, Floating=${ev.materialsCounts.floating}/4`,
      );
    }
    if (ev.materialsCounts.mentionsZIndex) {
      fail("materials-no-zindex-claim", "Materials 页面文案声称 z-index 是 material 属性");
    }
  }

  // 11. /grid 真实 Grid DOM + responsive 列数符合 API（sm:1 md:2 lg:3）
  if (ev.gridStats) {
    if (ev.gridStats.gridCount === 0) {
      fail("grid-real-dom", "页面未渲染任何真实 Grid DOM");
    }
    if (ev.gridStats.responsiveColumns !== null) {
      const expected = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
      if (ev.gridStats.responsiveColumns !== expected) {
        fail(
          "grid-responsive-columns",
          `responsive-breakpoints 列数 ${ev.gridStats.responsiveColumns} ≠ 预期 ${expected}`,
          ev.gridStats.responsiveColumns,
          '[data-grid-demo="responsive-breakpoints"] [data-slot="grid"]',
        );
      }
    }
    if (ev.gridStats.responsiveRows === null || ev.gridStats.clipping.some((entry) => entry.guideCount === 0)) {
      fail(
        "grid-row-guide-clipping-evidence",
        "Grid row/guide/clipping 证据不完整",
        ev.gridStats,
        "[data-grid-demo]",
      );
    }
  }

  return failures;
}

/* ---------------- 全量矩阵 ---------------- */

const ALL_FAILURES: CheckFailure[] = [];

/** 每个 page 上一次加载的 route|theme；纯视口切换时无需整页重挂载。 */
const lastLoadedKeys = new WeakMap<Page, string>();

async function auditCombo(
  page: Page,
  route: string,
  theme: Theme,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);
  if (lastLoadedKeys.get(page) !== `${route}|${theme}`) {
    await loadDocsRoute(page, route);
    lastLoadedKeys.set(page, `${route}|${theme}`);
  }
  await settle(page);
  const ev = await collectEvidence(page);
  const evidence: LayoutEvidence = { route, theme, ...ev };
  appendFileSync(JSONL_PATH, `${JSON.stringify(evidence)}\n`);
  const failures = runChecks(route, theme, viewport, ev);
  ALL_FAILURES.push(...failures);
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

test.describe("docs layout audit — evidence lifecycle", () => {
  test.beforeAll(() => {
    mkdirSync(SCRATCH, { recursive: true });
    mkdirSync(SHOT_DIR, { recursive: true });
    if (existsSync(JSONL_PATH)) writeFileSync(JSONL_PATH, "");
  });

test.afterAll(() => {
  const entries: LayoutEvidence[] = [];
  if (existsSync(JSONL_PATH)) {
    for (const line of readFileSync(JSONL_PATH, "utf8").split("\n")) {
      if (line.trim()) entries.push(JSON.parse(line) as LayoutEvidence);
    }
  }
  const byAssertion: Record<string, number> = {};
  for (const f of ALL_FAILURES) byAssertion[f.assertion] = (byAssertion[f.assertion] ?? 0) + 1;
  writeFileSync(
    JSON_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        matrix: { routes: ROUTES.length, viewports: VIEWPORTS.length, themes: THEMES.length },
        totals: {
          combos: entries.length,
          combosWithFailures: new Set(
            ALL_FAILURES.map((f) => `${f.route}|${f.viewport.width}x${f.viewport.height}|${f.theme}`),
          ).size,
          failures: ALL_FAILURES.length,
          byAssertion,
        },
        failures: ALL_FAILURES,
        evidence: entries,
      },
      null,
      2,
    ),
  );
});

test.describe("docs layout audit — full registry matrix", () => {
  for (const theme of THEMES) {
    test.describe(`theme=${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await setTheme(page, theme);
      });

      test(`static routes (${theme})`, async ({ page }) => {
        test.setTimeout(15 * 60_000);
        for (const route of STATIC_ROUTES) {
          for (const viewport of VIEWPORTS) {
            await auditCombo(page, route, theme, viewport);
          }
        }
      });

      for (const [index, group] of chunk(COMPONENT_ROUTES, 8).entries()) {
        test(`component routes chunk ${index + 1}/${Math.ceil(COMPONENT_ROUTES.length / 8)} (${theme})`, async ({ page }) => {
          test.setTimeout(15 * 60_000);
          for (const route of group) {
            for (const viewport of VIEWPORTS) {
              await auditCombo(page, route, theme, viewport);
            }
          }
        });
      }
    });
  }
});

  test("aggregate layout audit gate", () => {
    const lines = ALL_FAILURES.map(
      (failure) =>
        `[${failure.assertion}] ${failure.route} @${failure.viewport.width}x${failure.viewport.height} ${failure.theme}: ${failure.detail}`,
    );
    expect(lines.join("\n")).toBe("");
  });
});

/* ---------------- /colors Clipboard 真值契约 ---------------- */

test.describe("/colors clipboard contract", () => {
  for (const theme of THEMES) {
    test(`clipboard writes computed value (${theme})`, async ({ page }) => {
      await setTheme(page, theme);
      await gotoRoute(page, "/colors", { width: 1440, height: 900 });
      const swatch = page.locator("[data-color-token]").first();
      const token = await swatch.getAttribute("data-color-token");
      expect(token).toBeTruthy();
      await swatch.click();
      const expected = await page.evaluate(
        (name) => getComputedStyle(document.documentElement).getPropertyValue(name!).trim(),
        token,
      );
      const displayed = (await swatch.locator("span").last().innerText()).trim();
      expect(displayed, "swatch 显示值应等于该 token 的 computed value").toBe(expected);
      const clipped = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipped, "Clipboard 写入值应等于该 token 的 computed value").toBe(expected);
    });
  }
});

/* ---------------- 浮层 stacking（计划步骤 5 #12） ---------------- */

test.describe("floating layers above modal overlay", () => {
  test("tooltip / menu / toast 可见且未被遮挡；toast 可在 modal 上方触发", async ({ page }) => {
    test.setTimeout(120_000);
    await setTheme(page, "light");
    const width = 1440;

    /* tooltip：hover 触发，内容可见 */
    await gotoRoute(page, "/components/tooltip", { width, height: 900 });
    await page.getByRole("button", { name: "Bottom" }).first().hover();
    const tooltip = page.getByRole("tooltip").first();
    await expect(tooltip, "tooltip 应在 hover 后可见").toBeVisible();

    /* menu：点击 MenuButton 触发，menu 面板可见 */
    await gotoRoute(page, "/components/menu", { width, height: 900 });
    await page.getByRole("button", { name: "Actions" }).first().click();
    const menuVisible = await page
      .locator('[role="menu"]')
      .first()
      .isVisible()
      .catch(() => false);
    expect(menuVisible, "menu 应在点击后可见").toBe(true);

    /* toast：点击 Show Toast，toast 容器出现条目并可见 */
    await gotoRoute(page, "/components/toast", { width, height: 900 });
    const toastDemo = page.locator('[data-demo-card="Default"]');
    await toastDemo.getByRole("button").first().click();
    const toastItem = page.locator('[data-slot="toasts"] li, [data-slot="toasts"] > div').first();
    await toastItem.waitFor({ state: "visible" });
    expect(await toastItem.isVisible(), "toast 应可见").toBe(true);

    /* modal + toast：toasts-focus-trap 卡片内打开 modal，再从 modal 内触发 toast，
       toast 必须渲染在 modal 遮罩之上（elementFromPoint 命中 toast 自身子树） */
    await gotoRoute(page, "/components/modal", { width, height: 900 });
    const card = page.locator('[data-demo-card="toasts-focus-trap"]');
    await card.getByRole("button").first().click();
    const modalContent = page.locator('[data-slot="modal-content"]');
    await modalContent.waitFor({ state: "visible" });
    await modalContent.getByRole("button").first().click();
    const modalToast = page.locator('[data-slot="toasts"] li, [data-slot="toasts"] > div').first();
    await modalToast.waitFor({ state: "visible" });

    const toastOk = await modalToast.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!(hit && (hit === el || el.contains(hit)));
    });
    if (!toastOk) {
      const diagnostics = await page.evaluate(() => {
        const el = document.querySelector('[data-slot="toasts"] li, [data-slot="toasts"] > div');
        if (!el) return "toast 不在 DOM";
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        const describeEl = (node: Element | null) =>
          node
            ? `${node.tagName.toLowerCase()}${
                node.getAttribute("data-slot")
                  ? `[data-slot=${node.getAttribute("data-slot")}]`
                  : ""
              }`
            : null;
        let ancestor: Element | null = el.parentElement;
        let found: Element | null = null;
        while (ancestor) {
          const s = getComputedStyle(ancestor);
          if (
            s.transform !== "none" ||
            (s.position !== "static" && s.zIndex !== "auto") ||
            Number(s.opacity) < 1 ||
            s.isolation === "isolate"
          ) {
            found = ancestor;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        return JSON.stringify({
          toastRect: r.toJSON(),
          toastZIndex: getComputedStyle(el).zIndex,
          obscuredBy: describeEl(hit),
          nearestStackingAncestor: describeEl(found),
        });
      });
      expect.soft(toastOk, `modal 上方 toast 未通过命中检测：${diagnostics}`).toBe(true);
    }

    // modal 本体可见（未被自身遮罩挡住）
    expect(await modalContent.isVisible(), "modal content 应可见").toBe(true);
    await page.keyboard.press("Escape");
  });
});

/* ---------------- Registry rendering regressions ---------------- */

test.describe("registry-driven component demos", () => {
  test("video keeps a visible default live demo", async ({ page }) => {
    await gotoRoute(page, "/components/video", { width: 1440, height: 900 });

    const card = page.locator('[data-demo-component="video"] [data-demo-card="default"]');
    await expect(card).toBeVisible();
    await expect(card.locator("video")).toBeVisible();
    const box = await card.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test("inventory-only switch examples do not duplicate titled sections", async ({ page }) => {
    await gotoRoute(page, "/components/switch", { width: 1440, height: 900 });

    for (const id of ["disabled", "sizes", "full-width", "tooltip", "icon"]) {
      await expect(page.locator(`[data-demo-card="${id}"]`)).toHaveCount(0);
    }
    for (const id of ["Disabled", "Sizes", "Full width", "Tooltip", "Icon"]) {
      await expect(page.locator(`[data-demo-card="${id}"]`)).toHaveCount(1);
    }
  });
});

/* ---------------- Drawer 行为自动化（计划步骤 6） ---------------- */

test.describe("drawer behaviors at mobile/tablet viewports", () => {
  const drawerViewports = [
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ];

  for (const viewport of drawerViewports) {
    test(`open/current/scroll/Escape/panel-close @${viewport.width}x${viewport.height}`, async ({ page }) => {
      await setTheme(page, "light");

      // 基础行为：aria-expanded、aria-current、Escape 关闭焦点归还
      await gotoRoute(page, "/", viewport);
      const trigger = page.locator('[data-slot="hamburger-trigger"]');
      await expect(trigger).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      const panel = page.locator('[data-slot="expand-panel"]');
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const currentItem = panel.locator('[aria-current="page"]');
      await expect(currentItem).toHaveCount(1);
      await expect(currentItem).toHaveText(/Introduction|介绍/);

      await page.keyboard.press("Escape");
      await expect(panel).not.toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();

      // 长页滚动可见性 + panel-close 关闭
      await gotoRoute(page, "/components/button", viewport);
      await trigger.click();
      await expect(panel).toBeVisible();
      await panel.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await settle(page);
      // 面板动画收敛后仍在视口内且可交互；轮询避免把合法滑入过程误判为最终越界。
      await expect
        .poll(
          () =>
            panel.evaluate((el) => {
              const r = el.getBoundingClientRect();
              return r.top >= -1 && r.left >= -1 && r.bottom <= window.innerHeight + 1 && r.right <= window.innerWidth + 1;
            }),
          { message: "长页滚动后面板动画应收敛并完整落在视口内" },
        )
        .toBe(true);

      const closeButton = page.locator('[data-slot="panel-close"]');
      if ((await closeButton.count()) > 0) {
        await closeButton.first().click();
        await expect(panel).not.toBeVisible();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
      } else {
        await page.keyboard.press("Escape");
        await expect(panel).not.toBeVisible();
      }
    });
  }
});

/* ---------------- 视觉截图证据（计划步骤 4 清单） ---------------- */

test.describe("visual evidence screenshots", () => {
  const shots: Array<[route: string, width: number, themes: Theme[]]> = [
    ...(["/", "/components/device"] as const).flatMap((route) =>
      VIEWPORTS.map(
        (v) => [route, v.width, [...THEMES]] as [string, number, Theme[]],
      ).filter(([, w]) => route === "/" || [1100, 768, 390, 320].includes(w)),
    ),
    ...(
      [
        ["/components/badge", 1440],
        ["/components/badge", 390],
        ["/patterns/app-shell", 1440],
        ["/patterns/app-shell", 320],
      ] as Array<[string, number]>
    ).map(([route, w]) => [route, w, ["light"] as Theme[]] as [string, number, Theme[]]),
    ...(["/colors", "/materials", "/grid"] as const).flatMap((route) =>
      ([1440, 768, 390] as const).map(
        (w) => [route, w, [...THEMES]] as [string, number, Theme[]],
      ),
    ),
  ] as Array<[string, number, Theme[]]>;

  for (const [route, width, shotThemes] of shots) {
    for (const theme of shotThemes) {
      test(`shot ${route} @${width} ${theme}`, async ({ page }) => {
        await setTheme(page, theme);
        const viewport =
          VIEWPORTS.find((v) => v.width === width) ?? { width, height: 900 };
        await gotoRoute(page, route, viewport);
        const file = path.join(
          SHOT_DIR,
          `${route.replace(/\//g, "_")}-${width}-${theme}.png`,
        );
        await page.screenshot({ path: file, fullPage: false });
        expect(existsSync(file)).toBe(true);
      });
    }
  }
});

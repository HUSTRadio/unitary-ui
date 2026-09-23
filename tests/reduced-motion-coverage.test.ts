// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

/**
 * HIG-AUD-019 `prefers-reduced-motion` 覆盖契约（WCAG 2.3.3）。
 *
 * 审计口径：把 `motion-reduce:animate-none` / `motion-reduce:transition-none` 作为**浮层与
 * 过渡组件的默认约定**，并加守护测试；验收 = `emulateMedia({reducedMotion:"reduce"})` 下
 * 逐浮层断言 `animation-name: none` 且功能不受影响（运行侧见 `tests/e2e/reduced-motion.spec.ts`）。
 *
 * 本文件按覆盖方式分桶登记，任何新增浮层都必须落进其中一桶：
 * - A 组件级 tw-animate 浮层：进入/退出动画行自带 `motion-reduce:animate-none`；
 * - B 样式表兜底浮层：动画定义在 `index.css` 工具类内（命令面板），由 reduce 块关掉；
 * - C 审计点名的状态过渡缺口（本轮补齐，回归守卫按收敛后的写法锁住）；
 * - D JS 门控：以 `matchMedia("(prefers-reduced-motion: reduce)")` 直接短路；
 * - E 组件级免动画清单（长期例外）：无进出场动画，依赖全局兜底——兜底声明由本文件锁死，
 *   且这些文件不得偷偷长出 `animate-in` 进出场（要长就必须先加入 A 桶）。
 */
const root = process.cwd();
const read = (relative: string) =>
  readFileSync(path.join(root, relative), "utf8").replace(/\r\n/g, "\n");
const readComponent = (name: string) => {
  try {
    return read(`src/components/ui/${name}.tsx`);
  } catch {
    // 图表族在子目录（src/components/ui/charts/）
    return read(`src/components/ui/charts/${name}.tsx`);
  }
};

/** A. `animate-in` / `animate-out` 消费者（tw-animate 进出场浮层）。 */
const TW_ANIMATE_OVERLAYS = [
  "bottom-sheet",
  "calendar",
  "edit-menu",
  "drawer",
  "destructive-action-modal",
  "context-menu",
  "context-card",
  "combobox",
  "feedback",
  "expand-panel",
  "multi-select",
  "tooltip",
  "modal",
  "menu",
  "toast",
  "menu-bar",
  "sheet",
  "select",
  "responsive-drawer",
  "side-panel",
  "relative-time-card",
] as const;

/** B. 动画在样式表工具类里的浮层（组件类名不含 animate-in）。 */
const CSS_FALLBACK_OVERLAYS = ["command-menu"] as const;

/** C. HIG-AUD-019 点名缺口：收敛后的写法必须仍在（防回退）。 */
const NAMED_TRANSITION_FIXES: ReadonlyArray<readonly [string, string]> = [
  ["theme-switcher", "transition-colors motion-reduce:transition-none"],
  ["combobox", "transition-all duration-(--uni-duration-fast) ease-out motion-reduce:transition-none"],
  ["combobox", "transition-colors duration-(--uni-duration-fast) ease-in motion-reduce:transition-none"],
  ["drawer", "ease-snap motion-reduce:animate-none!"],
];

/** D. JS 门控：以 matchMedia 短路（类名之外的第二条路径）。 */
const JS_GATED = ["hamburger-menu", "drawer", "bottom-sheet"] as const;

/** E. 组件级免动画清单：无进出场动画、依赖全局兜底（数据可视化与装饰性循环动画）。 */
const GLOBAL_FALLBACK_EXEMPTIONS = [
  "spinner",
  "status-dot",
  "loading-icon",
  "avatar",
  "gauge",
  "area-chart",
  "bar-chart",
  "bar-list",
  "category-bar",
  "combo-chart",
  "line-chart",
  "progress-circle",
  "tracker",
] as const;

describe("HIG-AUD-019 reduced-motion coverage contract", () => {
  test("A. every tw-animate overlay carries a component-level animation kill switch", () => {
    // 口径与审计一致（审计按「多少文件包含 motion-reduce」计数）：文件级存在性。
    // 刻意不做逐行判定——同一元素的类名合法地分散在基类常量（如
    // context-menu 的 QUICK_ACTIONS_SCRIM_CLASS、modal 的 ModalContent 行）与多行
    // cn(...) 之间，逐行规则会把这些已覆盖元素误判为缺口。元素级/运行级的真相由
    // tests/e2e/reduced-motion.spec.ts 在 emulateMedia({reducedMotion:"reduce"}) 下断言
    // 每个浮层实际渲染出的 animation-name 来保证。
    // 必须是 important 形式：`data-[state=open]:animate-in[data-state="open"]` 的
    // specificity 是 0,2,0，普通 `motion-reduce:animate-none`（0,1,0）压不过它。
    // 实测（临时探针，reduce 模拟生效）：plain → computed animation-name "enter"；
    // `motion-reduce:animate-none!` → "none"。写法取 Tailwind v4 规范的**末尾** important，
    // 与 skeleton 既有写法统一。
    // 过渡侧不同：`transition-*` 是单类名（0,1,0），plain 的
    // `motion-reduce:transition-none` 实测已生效（property 归零），无需 important。
    const offenders = TW_ANIMATE_OVERLAYS.filter(
      (name) => !readComponent(name).includes("motion-reduce:animate-none!"),
    );
    expect(offenders).toEqual([]);
  });

  test("B. stylesheet-driven overlay relies on an explicit reduce block, not on the global duration clamp", () => {
    const css = read("src/styles/index.css");
    for (const name of CSS_FALLBACK_OVERLAYS) {
      expect(readComponent(name), `${name} must not declare tw-animate classes`).not.toContain(
        "animate-in",
      );
    }
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.command-menu-overlay,\s*\.command-menu-scale,\s*\.command-menu-mobile \{\s*animation: none !important;\s*transition: none !important;/,
    );
    // reduce 块关的是真实存在的动画：工具类与 keyframes 缺一即视为死代码
    expect(css).toContain("@utility command-menu-overlay");
    expect(css).toContain("@utility command-menu-scale");
    expect(css).toMatch(/\.command-menu-mobile\[data-state="open"\]/);
  });

  test("C. the transition gaps named by HIG-AUD-019 stay fixed", () => {
    for (const [file, needle] of NAMED_TRANSITION_FIXES) {
      expect(readComponent(file), `${file} must keep "${needle}"`).toContain(needle);
    }
  });

  test("D. JS-gated motion short-circuits on the media query", () => {
    for (const name of JS_GATED) {
      expect(
        readComponent(name),
        `${name} must gate its motion on prefers-reduced-motion`,
      ).toContain("prefers-reduced-motion");
    }
  });

  test("E. the global fallback that the exemption list depends on stays intact", () => {
    const css = read("src/styles/index.css");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\*,\s*\*::before,\s*\*::after \{\s*animation-duration: 0\.01ms !important;\s*animation-iteration-count: 1 !important;\s*transition-duration: 0\.01ms !important;\s*scroll-behavior: auto !important;/,
    );
    for (const name of GLOBAL_FALLBACK_EXEMPTIONS) {
      expect(
        readComponent(name),
        `${name} is on the exemption list and must not gain entry/exit animation`,
      ).not.toContain("animate-in");
    }
  });
});

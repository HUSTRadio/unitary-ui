// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

/**
 * HIG-AUD-010 遮罩背板契约（audit acceptance 的可执行版本）。
 *
 * 仓库有**两族**遮罩，各自都有官方实测出处（族注释见 `src/styles/index.css`）：
 * - backdrop 族（表面洗色）：官方 Modal scrim / Sheet overlay，light `#f2f2f2`、
 *   dark `#000000`，同 @ 0.8；消费 `modal` / `sheet` / `side-panel`。
 * - scrim 族（暗化）：官方 Drawer overlay 实测 `rgba(0,0,0,.4)`；消费 `drawer` /
 *   `bottom-sheet` / `responsive-drawer` / `expand-panel` / `context-menu`（quick-actions
 *   遮罩）/ `destructive-action-modal`。
 *
 * `command-menu` 的 overlay 是 design-gate（`tests/audit/geist-design-gate.json`）冻结的
 * 官方 cmdk 写法 `bg-background-100 opacity-80`，是两族之外的单列例外——不得被「顺手对齐」。
 *
 * 本文件锁四件事：token 值、消费矩阵（含跨族误用）、模糊只走显式开关、以及审计的
 * 验收 grep（`bg-black/<alpha>`、`bg-[#f2f2f2]` 在组件层不得再出现）。
 */
const root = process.cwd();
const uiDir = path.join(root, "src/components/ui");

const BACKDROP_FAMILY = ["modal", "sheet", "side-panel"] as const;
const SCRIM_FAMILY = [
  "drawer",
  "bottom-sheet",
  "responsive-drawer",
  "expand-panel",
  "context-menu",
  "destructive-action-modal",
] as const;
/** 只有这两个遮罩带模糊（官方 Drawer scrim 无模糊、官方 Modal scrim 无模糊）。 */
const BLUR_CONSUMERS = ["context-menu", "destructive-action-modal"] as const;
/** design-gate 冻结的官方 cmdk overlay 写法，不并入任一族。 */
const OFFICIAL_EXCEPTION = "command-menu";

const read = (relative: string) =>
  readFileSync(path.join(root, relative), "utf8").replace(/\r\n/g, "\n");
const readComponent = (name: string) => read(`src/components/ui/${name}.tsx`);
/** 断言消费矩阵时只看代码，不看注释里对另一族的说明。 */
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

const overlayMarkupLines = (source: string) =>
  stripComments(source)
    .split("\n")
    .filter((line) => line.includes("fixed inset-0"));

describe("HIG-AUD-010 overlay backdrop token contract", () => {
  test("freezes both overlay families at the values measured from the official components", () => {
    const css = read("src/styles/index.css");
    const light = themeBlock(css, ":root");
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');

    // backdrop 族：官方 Modal scrim live computed（2026-08-15）
    expect(light).toMatch(/--uni-overlay-backdrop-color:\s*#f2f2f2;/);
    expect(light).toMatch(/--uni-overlay-backdrop-opacity:\s*0\.8;/);
    expect(dark).toMatch(/--uni-overlay-backdrop-color:\s*#000000;/);
    // scrim 族：官方 Drawer overlay live computed（2026-08-13）；alpha 必须在颜色里，
    // 否则同族带 backdrop-filter 的消费者会把模糊按组一起降透明
    expect(light).toMatch(/--uni-overlay-scrim-color:\s*rgb\(0 0 0 \/ 40%\);/);
    // 合成色自动跟随 color + opacity（modal 的「遮罩带内容子节点」场景专用）
    expect(light).toMatch(
      /--uni-overlay-backdrop:\s*color-mix\(\s*in oklab,\s*var\(--uni-overlay-backdrop-color\) calc\(var\(--uni-overlay-backdrop-opacity\) \* 100%\),\s*transparent\s*\);/,
    );
    // 模糊是显式开关（0px = 不模糊）
    expect(light).toMatch(/--uni-overlay-backdrop-blur:\s*8px;/);

    // 两族的透明度/模糊 light/dark 同值：只声明一次，dark 侧不得再覆盖出分叉
    expect(dark).not.toMatch(/--uni-overlay-backdrop-opacity\s*:/);
    expect(dark).not.toMatch(/--uni-overlay-backdrop-blur\s*:/);
    expect(dark).not.toMatch(/--uni-overlay-scrim-color\s*:/);
  });

  test("removes every overlay color literal from the component layer (audit acceptance grep)", () => {
    const offenders = listComponentSources().flatMap(({ file, source }) => {
      const hits: string[] = [];
      const code = stripComments(source);
      if (/bg-black\/\d/.test(code)) hits.push("bg-black/<alpha>");
      if (/dark:bg-black\//.test(code)) hits.push("dark:bg-black/<alpha>");
      if (/bg-\[#f2f2f2\]/.test(code)) hits.push("bg-[#f2f2f2]");
      return hits.map((hit) => `${file}: ${hit}`);
    });

    expect(offenders).toEqual([]);
  });

  test("each overlay consumes exactly one role family and never the other", () => {
    // sheet / side-panel：Overlay 无子节点 → 官方两值式（color + opacity）
    for (const name of ["sheet", "side-panel"] as const) {
      const code = stripComments(readComponent(name));
      expect(code, `${name} must consume the backdrop family`).toContain(
        "bg-[var(--uni-overlay-backdrop-color)]",
      );
      expect(code, `${name} must consume the backdrop opacity`).toContain(
        "opacity-[var(--uni-overlay-backdrop-opacity)]",
      );
    }

    // modal：Content 是 Overlay 的**子节点** → 必须用合成色。若改成元素 opacity-*，
    // 内容会跟着一起降透明（真实的透明卡片回归），故此处显式反向锁死。
    const modalOverlays = overlayMarkupLines(readComponent("modal"));
    expect(modalOverlays.length, "modal overlay line not found").toBeGreaterThan(0);
    expect(modalOverlays.join("\n")).toContain("bg-[var(--uni-overlay-backdrop)]");
    expect(modalOverlays.join("\n"), "modal overlay must not use element opacity").not.toMatch(
      /(^|[\s"'])opacity-/,
    );

    for (const name of BACKDROP_FAMILY) {
      const code = stripComments(readComponent(name));
      expect(code, `${name} must not consume the scrim family`).not.toContain(
        "--uni-overlay-scrim-color",
      );
    }

    for (const name of SCRIM_FAMILY) {
      const code = stripComments(readComponent(name));
      expect(code, `${name} must consume the scrim family`).toContain(
        "bg-[var(--uni-overlay-scrim-color)]",
      );
      expect(code, `${name} must not consume the backdrop color/opacity`).not.toMatch(
        /--uni-overlay-backdrop-(?:color|opacity)/,
      );
    }
  });

  test("blur stays an explicit token switch owned by the two blurred overlays", () => {
    for (const name of BLUR_CONSUMERS) {
      expect(
        stripComments(readComponent(name)),
        `${name} must consume the explicit blur token`,
      ).toContain("backdrop-blur-(--uni-overlay-backdrop-blur)");
    }

    const nonBlurred = [...BACKDROP_FAMILY, ...SCRIM_FAMILY, OFFICIAL_EXCEPTION].filter(
      (name) => !BLUR_CONSUMERS.includes(name as (typeof BLUR_CONSUMERS)[number]),
    );
    for (const name of nonBlurred) {
      expect(stripComments(readComponent(name)), `${name} must not blur its backdrop`).not.toContain(
        "backdrop-blur-",
      );
    }
  });

  test("blurred scrims keep the darkening alpha in the color token, not in element opacity", () => {
    // 元素 opacity<1 会把 backdrop-filter 的合成结果一起降透明（观感上模糊被削弱），
    // 所以带模糊的遮罩必须用「含 alpha 的颜色」，不得用 opacity-* 表达暗度。
    for (const name of BLUR_CONSUMERS) {
      const overlays = overlayMarkupLines(readComponent(name));
      expect(overlays.length, `${name} overlay line not found`).toBeGreaterThan(0);
      for (const line of overlays) {
        expect(line, `${name} overlay must not use element opacity`).not.toMatch(
          /(^|[\s"'])opacity-/,
        );
      }
    }
  });

  test("command-menu keeps the frozen official cmdk overlay writing", () => {
    const code = stripComments(readComponent(OFFICIAL_EXCEPTION));
    expect(code).toContain("bg-background-100 opacity-80");
    expect(code).not.toMatch(/--uni-overlay-(?:backdrop|scrim)/);
  });
});

function listComponentSources() {
  return readdirSync(uiDir)
    .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
    .map((file) => ({ file, source: read(`src/components/ui/${file}`) }));
}

function themeBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing ${selector} theme block`).toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{", start) + 1;
  const end = css.indexOf("\n}", bodyStart);
  expect(end, `unterminated ${selector} theme block`).toBeGreaterThan(bodyStart);
  return css.slice(bodyStart, end);
}

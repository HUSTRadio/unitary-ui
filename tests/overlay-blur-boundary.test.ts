// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

/**
 * HIG-AUD-035 装饰性模糊的用途边界（audit acceptance 的可执行版本）。
 *
 * 审核尺度是「模糊作为点缀」：模糊只用于表达「主屏 / AI 建议 / 临时前台」这类前景
 * 层级，并且写成共享 token（`--uni-overlay-backdrop-blur`）而不是逐组件自选档位，
 * 否则会从「点缀」滑向「装饰过量」。
 *
 * 本文件把这条边界变成显式**白名单治理**（不是锁视觉类名）：
 * 1. 只有白名单里的组件允许给遮罩层（`fixed inset-0` 蒙层）加模糊；任何新的遮罩模糊
 *    使用点都会失败并提示「需要设计确认」；
 * 2. 任何新的 `backdrop-blur` 使用点（无论遮罩还是装饰）都必须先进入显式白名单；
 * 3. 遮罩上的模糊必须消费共享 token，不得回落 Tailwind 裸档位（`backdrop-blur-sm/md/…`）
 *    或任意值 `backdrop-blur-[…]`。
 *
 * 刻意**不**锁与用途边界无关的视觉类名（z-index / 颜色 / 动画分别由
 * `tests/overlay-backdrop-tokens.test.ts` 与各组件 API 测试负责）。
 */
const root = process.cwd();
const uiDir = path.join(root, "src/components/ui");

/** 允许给遮罩层加模糊的组件（显式白名单；新增必须做设计确认）。 */
const OVERLAY_BLUR_ALLOWLIST = ["context-menu", "destructive-action-modal"] as const;
/**
 * 非遮罩层的装饰性模糊例外：设备外框 chrome（Safari 面板）是 `absolute` 覆盖条、
 * 不是 `fixed inset-0` 蒙层，不表达遮罩层级，因此不走遮罩 token，也不被本条用途边界
 * 管辖。它是唯一例外，新增同类仍需设计确认。
 */
const DECORATIVE_BLUR_ALLOWLIST = ["phone-chrome"] as const;
/** 遮罩模糊的共享 token 写法。 */
const BLUR_TOKEN = "backdrop-blur-(--uni-overlay-backdrop-blur)";
/** Tailwind 内置模糊档位 + 任意值写法：遮罩一律不得使用。 */
const RAW_BLUR_STEP = /backdrop-blur-(?:xs|sm|md|lg|xl|2xl|3xl|none)\b|backdrop-blur-\[/;

const read = (relative: string) =>
  readFileSync(path.join(root, relative), "utf8").replace(/\r\n/g, "\n");
/** 断言用途边界时只看代码，不看注释里对另一族的说明。 */
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");
/** 遮罩层标记行：蒙层以 `fixed inset-0` 起手。 */
const overlayLines = (source: string) =>
  stripComments(source)
    .split("\n")
    .filter((line) => line.includes("fixed inset-0"));
/** 组件源码清单（`src/components/ui` 下 .ts/.tsx 混排，key 为去扩展名的组件名）。 */
const listComponents = () =>
  readdirSync(uiDir)
    .filter((file) => /\.tsx?$/.test(file))
    .map((file) => ({
      name: file.replace(/\.tsx?$/, ""),
      source: stripComments(read(`src/components/ui/${file}`)),
    }));
const blursOverlay = ({ source }: { source: string }) =>
  overlayLines(source).some((line) => line.includes("backdrop-blur"));

describe("HIG-AUD-035 overlay blur usage boundary", () => {
  test("only the explicit allowlist may blur an overlay; new usages need design confirmation", () => {
    const unexpected = listComponents()
      .filter(blursOverlay)
      .map(({ name }) => name)
      .filter((name) => !(OVERLAY_BLUR_ALLOWLIST as readonly string[]).includes(name));

    expect(
      unexpected,
      "新增遮罩模糊使用点需要设计确认：模糊只用于表达 主屏 / AI 建议 / 临时前台 层级",
    ).toEqual([]);
  });

  test("fails on any backdrop-blur usage outside the documented allowlists", () => {
    const allowed = new Set<string>([...OVERLAY_BLUR_ALLOWLIST, ...DECORATIVE_BLUR_ALLOWLIST]);
    const offenders = listComponents()
      .filter(({ source }) => source.includes("backdrop-blur"))
      .map(({ name }) => name)
      .filter((name) => !allowed.has(name));

    expect(
      offenders,
      "新增 backdrop-blur 使用点需要设计确认：模糊只用于表达 主屏 / AI 建议 / 临时前台 层级",
    ).toEqual([]);
  });

  test("every blurred overlay consumes the shared token, never a raw blur step", () => {
    const offenders = listComponents().flatMap(({ name, source }) =>
      overlayLines(source)
        .filter((line) => line.includes("backdrop-blur") && !line.includes(BLUR_TOKEN))
        .map((line) => `${name}: ${line.trim()}`),
    );

    expect(offenders, "遮罩模糊必须消费 --uni-overlay-backdrop-blur，禁止裸档位/任意值").toEqual(
      [],
    );
  });

  test("the allowlisted blurred overlays really carry the token and no raw step", () => {
    const byName = new Map(listComponents().map((c) => [c.name, c.source]));
    for (const name of OVERLAY_BLUR_ALLOWLIST) {
      const overlay = overlayLines(byName.get(name) ?? "").join("\n");
      expect(overlay, `${name} must consume the shared overlay blur token`).toContain(BLUR_TOKEN);
      expect(overlay, `${name} must not use a raw blur step`).not.toMatch(RAW_BLUR_STEP);
    }
  });
});

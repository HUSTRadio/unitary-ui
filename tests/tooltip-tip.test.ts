import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/components/ui/tooltip.tsx"), "utf8");
const tipArrow = readFileSync(resolve(process.cwd(), "src/lib/tip-arrow.ts"), "utf8");

describe("Tooltip tip seam contract", () => {
  it("uses a clipped custom SVG path that overlaps and masks the content border", () => {
    expect(source).toContain("<TooltipPrimitive.Arrow asChild>");
    expect(source).toContain('viewBox="0 0 14 7"');
    // path 数据已收敛到共享常量（tooltip / context-card 单点存放，防双维护漂移）：
    // 组件必须消费常量，官方 path 值存于 tip-arrow.ts
    expect(source).toContain("d={TIP_ARROW_PATH}");
    expect(tipArrow).toContain('"M15 -0.5V0.5H12.9834');
    expect(source).toContain("const tipClipId = React.useId()");
    expect(source).toContain("clipPath={`url(#${tipClipId})`}");
    expect(source).toContain("<clipPath id={tipClipId}>");
    expect(source).toContain('stroke="var(--tooltip-tip-stroke)"');
  });

  it("uses theme-aware seam stroke and the HIG overlay (6px) tooltip radius", () => {
    expect(source).toContain('"--tooltip-tip-stroke": "var(--gray-alpha-400)"');
    expect(source).toContain("rounded-overlay");
  });
});

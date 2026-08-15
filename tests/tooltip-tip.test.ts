import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/components/ui/tooltip.tsx"), "utf8");

describe("Tooltip tip seam contract", () => {
  it("uses a clipped custom SVG path that overlaps and masks the content border", () => {
    expect(source).toContain("<TooltipPrimitive.Arrow asChild>");
    expect(source).toContain('viewBox="0 0 14 7"');
    expect(source).toContain('d="M15 -0.5V0.5H12.9834');
    expect(source).toContain("const tipClipId = React.useId()");
    expect(source).toContain("clipPath={`url(#${tipClipId})`}");
    expect(source).toContain("<clipPath id={tipClipId}>");
    expect(source).toContain('stroke="var(--tooltip-tip-stroke)"');
  });

  it("uses theme-aware seam stroke and the official 8px tooltip radius", () => {
    expect(source).toContain('"--tooltip-tip-stroke": "var(--gray-alpha-400)"');
    expect(source).toContain("rounded-[8px]");
  });
});

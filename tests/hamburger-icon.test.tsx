import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HamburgerIcon } from "../src/components/ui/hamburger-icon";

describe("HamburgerIcon", () => {
  it("closed state shows official Menu bars; open state shows official Cross (verbatim paths)", () => {
    const closed = renderToStaticMarkup(<HamburgerIcon open={false} />);
    const open = renderToStaticMarkup(<HamburgerIcon open={true} />);

    // 官方 path 逐字存在（Menu 三杠 / Cross）
    const MENU =
      "M1 2h14v1.5H1zm0 10.5h14V14H1zm.75-5.25H1v1.5h14v-1.5z";
    const CROSS =
      "m12.47 13.53.53.53L14.06 13l-.53-.53L9.06 8l4.47-4.47.53-.53L13 1.94l-.53.53L8 6.94 3.53 2.47 3 1.94 1.94 3l.53.53L6.94 8l-4.47 4.47-.53.53L3 14.06l.53-.53L8 9.06z";
    expect(closed).toContain(`d="${MENU}"`);
    expect(open).toContain(`d="${CROSS}"`);

    // 两枚 SVG 常驻叠放（过渡需要），data-state 标记可见性
    expect(closed).toContain('data-state="shown"');
    expect(closed).toContain('data-state="hidden"');
    expect(open).toContain('data-state="shown"');
    expect(open).toContain('data-state="hidden"');

    // 官方 viewBox
    expect(closed).toContain('viewBox="0 0 16 16"');
    expect(closed).toContain('data-open="false"');
    expect(open).toContain('data-open="true"');
  });

  it("morph transition: rotate/scale/opacity swap with reduced-motion fallback", () => {
    const closed = renderToStaticMarkup(<HamburgerIcon open={false} />);
    const open = renderToStaticMarkup(<HamburgerIcon open={true} />);

    for (const markup of [closed, open]) {
      // 过渡曲线与时长（自制 morph 动画契约）
      expect(markup).toContain("transition-[opacity,transform]");
      expect(markup).toContain("duration-(--uni-duration-slow)");
      expect(markup).toContain("ease-snap");
      expect(markup).toContain("motion-reduce:transition-none");
    }

    // 汉堡→叉：closed 时汉堡显示（rotate-0）、叉隐藏（-90°）；open 相反
    expect(closed).toContain("-rotate-90 scale-50 opacity-0");
    expect(closed).toContain("rotate-0 scale-100 opacity-100");
    expect(open).toContain("rotate-90 scale-50 opacity-0");

    // 颜色继承 currentColor
    expect(closed).toContain('fill="currentColor"');
  });

  it("sizes from props (default 16) via inline style box", () => {
    const markup = renderToStaticMarkup(<HamburgerIcon open={false} />);
    expect(markup).toContain("width:16px");
    expect(markup).toContain("height:16px");

    const sized = renderToStaticMarkup(<HamburgerIcon open={false} size={24} />);
    expect(sized).toContain("width:24px");
    expect(sized).toContain("height:24px");
  });
});

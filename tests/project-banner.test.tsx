import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectBanner } from "../src/components/ui/project-banner";

/**
 * shard-F 契约测试（官方基准：vercel.com/geist/project-banner 2026-08 线上实测）：
 * - F1 variant 决定根 aside 整体着色三件套 bg-{c}-100 + border-{c}-400 + text-{c}-900
 * - F2 label <p> 无写死颜色，继承容器文字色
 * - F3 "gray" 为 default 的等价别名（类集完全一致）
 * - F4 CTA 焦点环走 banner 专用变量，不含裸 focus-ring
 */

const baseProps = {
  icon: <span data-testid="icon" />,
  label: "Your Pro trial expires in 3 days.",
  callToAction: { label: "Reactivate Project", href: "/billing" },
} as const;

describe("ProjectBanner", () => {
  it("F1: variant=success 染根元素三件套，且不再回落灰色", () => {
    const markup = renderToStaticMarkup(
      <ProjectBanner {...baseProps} variant="success" />,
    );

    expect(markup).toContain("bg-blue-100");
    expect(markup).toContain("border-blue-400");
    expect(markup).toContain("text-blue-900");
    expect(markup).not.toContain("bg-gray-100");
    expect(markup).not.toContain("border-gray-400");
    // CTA 文字色仍走 blue 系
    expect(markup).toContain("text-blue-1000");
  });

  it("F1: warning / error 各自染 amber / red 三件套", () => {
    const warning = renderToStaticMarkup(
      <ProjectBanner {...baseProps} variant="warning" />,
    );
    expect(warning).toContain("bg-amber-100");
    expect(warning).toContain("border-amber-400");
    expect(warning).toContain("text-amber-900");

    const error = renderToStaticMarkup(
      <ProjectBanner {...baseProps} variant="error" />,
    );
    expect(error).toContain("bg-red-100");
    expect(error).toContain("border-red-400");
    expect(error).toContain("text-red-900");
  });

  it("F2: label <p> 无任何 class（颜色继承自容器 text-{c}-900）", () => {
    const markup = renderToStaticMarkup(<ProjectBanner {...baseProps} />);

    expect(markup).toContain("<p>Your Pro trial expires in 3 days.</p>");
    expect(markup).not.toContain('<p class="text-gray-900"');
    // 容器仍带 default 的 gray 三件套承接颜色
    expect(markup).toContain("text-gray-900");
  });

  it("F3: variant=gray 与 default 类集完全一致", () => {
    const extract = (variant?: "gray") =>
      renderToStaticMarkup(
        variant ? (
          <ProjectBanner {...baseProps} variant={variant} />
        ) : (
          <ProjectBanner {...baseProps} />
        ),
      ).match(/class="([^"]*)"/g);

    expect(extract("gray")).toEqual(extract(undefined));
  });

  it("F4: CTA 含 banner 专用焦点环类，不含裸 focus-ring", () => {
    const markup = renderToStaticMarkup(
      <ProjectBanner
        callToAction={{ label: "Review Tokens", onClick: () => {} }}
      />,
    );

    expect(markup).toContain(
      "focus-visible:!shadow-[var(--banner-focus-color)]",
    );
    expect(markup).toContain("focus-visible:shadow-focus-ring");
    expect(markup).toContain("font-sans");
    expect(markup).toContain("border-none");
    expect(markup).not.toMatch(/(^| )focus-ring( |$)/);
  });
});

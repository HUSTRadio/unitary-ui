import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

import { JsonView } from "@/components/ui/json-view";
import { MultiSelectRow } from "@/components/ui/multi-select";
import { ProjectBannerClose } from "@/components/ui/project-banner";
import { Scroller } from "@/components/ui/scroller";
import { ShowMore } from "@/components/ui/show-more";
import { StatusDot } from "@/components/ui/status-dot";
import { I18nProvider } from "@/lib/i18n";

const localize = (child: ReactNode) =>
  renderToStaticMarkup(createElement(I18nProvider, { locale: "zh-CN" }, child));

describe("remaining framework i18n", () => {
  test("localizes built-in controls while retaining caller content", () => {
    expect(localize(createElement(ShowMore, { expanded: false }))).toContain("显示更多");
    expect(localize(createElement(Scroller, { withButtons: true }))).toContain(
      'aria-label="向左滚动"',
    );
    expect(
      localize(
        createElement(MultiSelectRow, {
          name: "Design System",
          checked: true,
          onChange: vi.fn(),
          onSelectOnly: vi.fn(),
          onSelectAll: vi.fn(),
          selectedCount: 1,
          totalCount: 1,
        }),
      ),
    ).toContain('aria-label="Design System. 取消选中"');
    expect(localize(createElement(ProjectBannerClose, { onClick: vi.fn() }))).toContain(
      'aria-label="关闭横幅"',
    );
  });

  test("localizes generated accessibility labels without translating JSON keys", () => {
    const markup = localize(createElement(JsonView, { data: { configuration: true } }));

    expect(markup).toContain('aria-label="JSON 对象"');
    expect(markup).toContain('aria-label="configuration: true"');
  });

  test("uses localized status defaults without changing a supplied prefix", () => {
    const localized = localize(createElement(StatusDot, { state: "READY", label: true }));
    const custom = localize(
      createElement(StatusDot, { state: "READY", titlePrefix: "Deployment A" }),
    );

    expect(localized).toContain("就绪");
    expect(localized).toContain('title="此部署 已就绪。"');
    expect(custom).toContain('title="Deployment A 已就绪。"');
  });
});

// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { Grabber } from "@/components/ui/grabber";
import { Pagination } from "@/components/ui/pagination";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { Video } from "@/components/ui/video";
import { I18nProvider } from "@/lib/i18n";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function localize(child: React.ReactNode) {
  return renderToStaticMarkup(<I18nProvider locale="zh-CN">{child}</I18nProvider>);
}

describe("framework i18n completeness", () => {
  test("uses pagination-specific labels and translates every direction", () => {
    const markup = localize(
      <Pagination
        previous={{ href: "/previous", title: "设置" }}
        next={{ href: "/next", title: "概览" }}
      />,
    );

    expect(markup).toContain("上一页");
    expect(markup).toContain("下一页");
    expect(markup).toContain('aria-label="前往上一页：设置"');
    expect(markup).toContain('aria-label="前往下一页：概览"');
    expect(markup).not.toContain("上一月");
  });

  test("localizes the destructive confirmation template while preserving supplied content", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <I18nProvider locale="zh-CN">
          <DestructiveActionModal
            open
            title="删除项目"
            confirmLabel="删除项目"
            verificationPhrase="demo"
          />
        </I18nProvider>,
      ),
    );

    expect(document.body.textContent).toContain("请输入值“");
    expect(document.body.textContent).toContain("取消");
    expect(document.body.textContent).toContain("demo");
  });

  test("uses the framework locale for relative time unless a component locale is supplied", () => {
    const time = Date.now() - 2 * 60_000;
    expect(localize(<RelativeTimeCard date={time} />)).toContain("2分钟前");
    expect(localize(<RelativeTimeCard date={time} locale="en-US" />)).toContain("2m ago");
  });

  test("localizes the grabber handle name (HIG-AUD-008)", () => {
    const english = renderToStaticMarkup(<Grabber detentCount={3} currentDetent={0} />);

    // 默认（无 Provider）回退 en；HIG-AUD-008 前该处用的是中文 key `t("调整高度")`，
    // 中文站与英文站的取值因此都错位（英文站显示中文）。
    expect(english).toContain('aria-label="Resize height"');
    expect(localize(<Grabber detentCount={3} currentDetent={0} />)).toContain(
      'aria-label="调整高度"',
    );
  });

  test("gives the video playback button a localized dynamic name", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <I18nProvider locale="zh-CN">
          <Video src="/demo.mp4" />
        </I18nProvider>,
      ),
    );

    expect(container.querySelector('[aria-label="播放视频"]')).not.toBeNull();
  });
});

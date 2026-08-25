/**
 * RelativeTimeCard 契约测试（shard-G）：浮层官方三段式结构。
 * Content 渲染于 Radix Portal（renderToStaticMarkup 不可达），
 * 故采用源码断言（与 progress-api 等测试的双轨模式一致）+ 触发器渲染断言。
 */
import { readFileSync } from "node:fs";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RelativeTimeCard } from "@/components/ui/relative-time-card";

const source = readFileSync(new URL("../src/components/ui/relative-time-card.tsx", import.meta.url), "utf-8");

describe("relative-time-card contract (shard-G)", () => {
  const date = Date.UTC(2026, 7, 22, 12, 0, 0);

  it("源码：Content 使用 min-w-[300px] + p-3（官方浮层几何），无 w-64", () => {
    expect(source).toContain("min-w-[300px]");
    expect(source).toContain(" p-3");
    expect(source).not.toContain("w-64");
  });

  it("源码：相对时间块与值列 tabular-nums，值列 font-mono（官方 mono 数字列）", () => {
    expect(source).toContain("tabular-nums");
    expect(source).toContain("font-mono");
  });

  it("渲染：缺省触发器无虚线下划线装饰（G1）", () => {
    const html = renderToStaticMarkup(<RelativeTimeCard date={date} locale="en-US" />);
    expect(html).not.toContain("border-dotted");
  });

  it("源码：动画 duration-(--uni-duration-base) + motion-reduce 禁动画（G3）", () => {
    expect(source).toContain("duration-(--uni-duration-base)");
    expect(source).toContain("motion-reduce:animate-none");
  });

  it("渲染：触发器为 inline cursor-pointer 形态", () => {
    const html = renderToStaticMarkup(<RelativeTimeCard date={date} locale="en-US" />);
    expect(html).toContain("cursor-pointer");
  });
});

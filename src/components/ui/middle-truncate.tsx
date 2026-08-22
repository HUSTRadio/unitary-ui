import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MiddleTruncate — Geist 中段截断（docs/geist-markdown-refs/components/middle-truncate.md 官方语义）。
 * 官方行为：
 * - 布局感知：监听**容器**宽度（ResizeObserver 观察父容器），按当前生效字体用 Canvas 测量字符宽度，
 *   二分求「头部 + 单个省略号 … + 尾部」放得下的最长组合（head/tail 随可用宽度自适应）；
 * - 单个省略号字形（…）而非三个句点，等宽字体不多占字符格；
 * - 完整文本保留在 DOM（sr-only span + data-value），复制拿到的是原文；
 * - 完整字符串通过包裹元素 accessible name（aria-label / title）暴露给辅助技术。
 * value 为官方文本入口。
 *
 * G07-MT-01 修复要点：可用宽度取自**父容器**（node.parentElement.clientWidth）而非自身
 * clientWidth —— 自身宽度会随截断结果收缩（首帧为空内容时为 0），导致 availableWidth<=0、
 * 二分结果永久塌缩为 1 头 1 尾（'h…t'）；观察父容器则宽度变化（视口/布局/动画）都会触发重算。
 */

const FALLBACK_CHAR_WIDTH = 7; // 无 canvas 环境（SSR / node 测试）下的单字符估算宽度（px）
const FALLBACK_ELLIPSIS_WIDTH = 14; // 无 canvas 环境下的省略号 … 估算宽度（px）

interface MiddleTruncateProps extends React.ComponentProps<"span"> {
  /** 完整文本（官方 prop） */
  value: string;
}

/** 用 Canvas 测量一段文本的像素宽度；无 canvas 时退化为逐字符估算（确定性，便于测试）。 */
function measureTextWidth(text: string, font: string): number {
  if (typeof document === "undefined") {
    return text === "…" ? FALLBACK_ELLIPSIS_WIDTH : text.length * FALLBACK_CHAR_WIDTH;
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text === "…" ? FALLBACK_ELLIPSIS_WIDTH : text.length * FALLBACK_CHAR_WIDTH;
  }
  context.font = font;
  return context.measureText(text).width;
}

/** 读取元素当前生效的字体（含 className 引入的字号/字重/字体族），保证 Canvas 度量与渲染一致。 */
function getComputedFont(node: HTMLElement): string {
  if (typeof getComputedStyle === "undefined") {
    return "normal normal 400 14px sans-serif";
  }
  const style = getComputedStyle(node);
  return [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontSize,
    style.fontFamily,
  ].join(" ");
}

function getCharWidths(text: string, font: string): number[] {
  return text.split("").map((char) => measureTextWidth(char, font));
}

/**
 * 二分查找：返回 [head, tail]（等长，≤ 文本一半），head + … + tail 的总宽不超过 maxWidth。
 * 文本整体放得下则返回 [text, ""]（不截断）；maxWidth <= 0（尚未布局）时保持完整文本，
 * 避免在首帧/隐藏容器中塌缩为单字符。
 *
 * @deprecated Internal measurement helper retained only for backwards compatibility.
 * Use `MiddleTruncate` instead; this function may be removed in a future major release.
 */
export function splitStringByWidth(text: string, font: string, maxWidth: number): [string, string] {
  if (maxWidth <= 0) {
    return [text, ""];
  }

  const charWidths = getCharWidths(text, font);
  const totalWidth = charWidths.reduce((sum, width) => sum + width, 0);

  if (totalWidth <= maxWidth) {
    return [text, ""];
  }

  const ellipsisWidth = measureTextWidth("…", font);
  let low = 1;
  let high = Math.floor(text.length / 2);
  let bestHead = 1;

  while (low <= high) {
    const headLength = Math.floor((low + high) / 2);
    const headWidth = charWidths.slice(0, headLength).reduce((sum, width) => sum + width, 0);
    const tailWidth = charWidths.slice(-headLength).reduce((sum, width) => sum + width, 0);

    if (headWidth + ellipsisWidth + tailWidth <= maxWidth) {
      bestHead = headLength;
      low = headLength + 1;
    } else {
      high = headLength - 1;
    }
  }

  // 单字符等退化情况：head 与 tail 会重叠，直接整体渲染
  if (bestHead >= text.length) {
    return [text, ""];
  }

  return [text.slice(0, bestHead), text.slice(-bestHead)];
}

function MiddleTruncate({ className, style, value, ...props }: MiddleTruncateProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  // 初始渲染完整文本：SSR 输出完整值；客户端 useLayoutEffect 在绘制前完成测量截断，避免闪烁
  const [parts, setParts] = React.useState<[string, string]>([value, ""]);
  const fullText = value;

  const resize = React.useCallback(() => {
    const node = ref.current;
    if (!node || !fullText) return;
    // 测量父容器而不是自身（见文件头 G07-MT-01 说明）；父容器宽度不受截断结果影响
    const parent = node.parentElement;
    if (!parent) return;
    const availableWidth = parent.clientWidth;
    const font = getComputedFont(node);
    setParts((prev) => {
      const next = splitStringByWidth(fullText, font, availableWidth);
      return prev[0] === next[0] && prev[1] === next[1] ? prev : next;
    });
  }, [fullText]);

  // 布局前测量：首帧直接渲染完整文本，useLayoutEffect 在绘制前完成截断，避免闪烁
  React.useLayoutEffect(() => {
    resize();
  }, [resize]);

  React.useLayoutEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    // 字体加载完成后 Canvas 度量才准确，重新测量一次
    if (typeof document !== "undefined") {
      document.fonts?.ready?.then(resize).catch(() => {});
    }
    return () => observer.disconnect();
  }, [resize]);

  const [head, tail] = parts;

  return (
    <span
      ref={ref}
      data-slot="middle-truncate"
      data-value={fullText}
      aria-label={fullText}
      title={fullText}
      className={cn("inline-block max-w-full whitespace-nowrap", className)}
      style={style}
      {...props}
    >
      {head}
      {tail ? "…" : null}
      {tail ? <span aria-hidden>{tail}</span> : null}
      <span className="sr-only">{fullText}</span>
    </span>
  );
}

export { MiddleTruncate, type MiddleTruncateProps };

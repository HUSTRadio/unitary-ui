import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MiddleTruncate — Geist 中段截断（docs/geist-markdown-refs/components/middle-truncate.md 官方语义）。
 * 官方行为：
 * - 布局感知：监听容器宽度（ResizeObserver），按当前字体用 Canvas 测量字符宽度，
 *   二分求「头部 + 单个省略号 … + 尾部」放得下的最长组合；
 * - 单个省略号字形（…）而非三个句点，等宽字体不多占字符格；
 * - 完整文本保留在 DOM（sr-only span），复制拿到的是原文；
 * - 完整字符串通过包裹元素 accessible name（aria-label）暴露给辅助技术。
 * value 为官方文本入口。
 */

const TEXT_PAD = 20; // 容器可用宽度两侧留白（px）
const ELLIPSIS_WIDTH = 14; // 省略号 … 的估算宽度（px）

interface MiddleTruncateProps extends React.ComponentProps<"span"> {
  /** 完整文本（官方 prop） */
  value: string;
}

function getCharWidths(text: string, font: string): number[] {
  if (typeof document === "undefined") {
    return text.split("").map(() => 7);
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text.split("").map(() => 7);
  }
  context.font = font;
  return text.split("").map((char) => context.measureText(char).width);
}

function getStyleFont(style?: React.CSSProperties): string {
  const { fontFamily, fontSize, fontWeight, fontStyle, fontVariant } = style ?? {};
  const size = typeof fontSize === "number" ? `${fontSize}px` : (fontSize ?? "14px");
  return [
    fontStyle ?? "normal",
    fontVariant ?? "normal",
    fontWeight ?? 400,
    size,
    fontFamily ?? "sans-serif",
  ].join(" ");
}

/**
 * 二分查找：返回 [head, tail]，head 与 tail 等长（≤ 文本一半），
 * head + … + tail 的总宽不超过 maxWidth。放得下则返回 [text, ""]。
 */
function splitStringByWidth(text: string, font: string, maxWidth: number): [string, string] {
  const charWidths = getCharWidths(text, font);
  const totalWidth = charWidths.reduce((sum, width) => sum + width, 0);

  if (totalWidth <= maxWidth) {
    return [text, ""];
  }

  let low = 1;
  let high = Math.floor(text.length / 2);
  let bestHead = 1;

  while (low <= high) {
    const headLength = Math.floor((low + high) / 2);
    const headWidth = charWidths.slice(0, headLength).reduce((sum, width) => sum + width, 0);
    const tailWidth = charWidths.slice(-headLength).reduce((sum, width) => sum + width, 0);

    if (headWidth + ELLIPSIS_WIDTH + tailWidth <= maxWidth) {
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
  const [parts, setParts] = React.useState<[string, string]>(["", ""]);
  const fullText = value;

  const resize = React.useCallback(() => {
    const node = ref.current;
    if (!node || !fullText) return;
    const availableWidth = node.clientWidth - TEXT_PAD;
    setParts(splitStringByWidth(fullText, getStyleFont(style), availableWidth));
  }, [fullText, style]);

  // 布局前测量：首帧直接渲染完整文本，useLayoutEffect 在绘制前完成截断，避免闪烁
  React.useLayoutEffect(() => {
    resize();
  }, [resize]);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(resize);
    observer.observe(node);
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

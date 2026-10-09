import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { animateScroll, inlineScrollLeft, inlineScrollPosition, type ScrollAnimation } from "@/lib/scroll-animation";

/**
 * Scroller — Geist 官方 Scroller（docs/geist-markdown-refs/components/scroller.md）。
 * 官方 props：height / width / overflow（"x" | "y" | "both"）/ withButtons / childrenContainerClassName。
 * - 默认横向（overflow="x"），children 容器 flex + gap-4
 * - withButtons：右上角 32px 圆形实心方向按钮，每次滚动到相邻 direct child
 *   （按钮只认 direct children，多包一层布局节点会失效）
 * - 高度/宽度经 style 透传（number → px，string 原样）
 */
export interface ScrollerProps {
  /** 容器高度（number px 或 string，如 "100%"） */
  height?: number | string;
  /** 容器宽度（number px 或 string，如 "100%"） */
  width?: number | string;
  /** 滚动轴：x（横向，默认）| y（纵向）| both（自由） */
  overflow?: "x" | "y" | "both";
  /** 显示方向按钮（滚动到相邻 direct child） */
  withButtons?: boolean;
  /** 追加到 children 容器的 className（如 "gap-4"） */
  childrenContainerClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

function Scroller({
  height = "100%",
  width = "100%",
  overflow = "x",
  withButtons = false,
  childrenContainerClassName,
  className,
  children,
}: ScrollerProps) {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<ScrollAnimation | null>(null);
  const vertical = overflow === "y";
  React.useEffect(() => () => animationRef.current?.cancel(), []);

  const scrollToChild = React.useCallback(
    (direction: 1 | -1) => {
      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const position = vertical ? container.scrollTop : inlineScrollPosition(container);
      const rtl = !vertical && container.ownerDocument.defaultView?.getComputedStyle(container).direction === "rtl";
      const itemStart = (rect: DOMRect) => vertical
        ? rect.top - containerRect.top - container.clientTop + position
        : rtl
          ? containerRect.left + container.clientLeft + container.clientWidth - rect.right + position
          : rect.left - containerRect.left - container.clientLeft + position;

      let target: HTMLElement | null = null;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const start = itemStart(rect);
        if (direction === 1 && start > position + 1) {
          target = item;
          break;
        }
        if (direction === -1 && start < position - 1) {
          target = item;
        }
      }
      if (direction === -1 && target === null) {
        target = items[0];
      }
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const targetPosition = itemStart(rect);
      animationRef.current = animateScroll(container, {
        destination: vertical ? { top: targetPosition } : { left: inlineScrollLeft(container, targetPosition) },
      });
    },
    [vertical],
  );

  const buttonClass =
    "grid size-8 place-items-center rounded-full border border-gray-200 bg-background-100 text-gray-1000 outline-none transition-colors hover:bg-gray-200 focus-ring";

  return (
    <div
      data-slot="scroller"
      className={cn("flex flex-col gap-3", className)}
      style={{ height, width }}
    >
      {withButtons ? (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollToChild(-1)}
            aria-label={t(vertical ? "Scroll up" : "Scroll left")}
            className={buttonClass}
          >
            {vertical ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronLeft className="size-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={() => scrollToChild(1)}
            aria-label={t(vertical ? "Scroll down" : "Scroll right")}
            className={buttonClass}
          >
            {vertical ? (
              <ChevronDown className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
          </button>
        </div>
      ) : null}
      <div
        ref={containerRef}
        className={cn(
          "flex gap-4",
          overflow === "x" && "overflow-x-auto overflow-y-hidden",
          overflow === "y" && "flex-col overflow-x-hidden overflow-y-auto",
          overflow === "both" && "overflow-auto",
          childrenContainerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Scroller };

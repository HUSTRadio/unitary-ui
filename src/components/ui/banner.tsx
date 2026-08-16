import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface BannerButton {
  href: string;
  content: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

interface BannerProps extends React.ComponentProps<"div"> {
  button?: BannerButton;
}

/**
 * Banner - 官方 @vercel/geistcn Banner 对齐实现（vercel.com/geist/banner 实测）。
 *
 * 单一 universal 形态：横幅消息（children）+ 可选 CTA 胶囊（button），所有 viewport 一致。
 * banner 的语义是「横幅消息」，整个 banner 绝不降级为一条按钮。
 *
 * 官方结构（实测）：max-w-[1080px] + w-full + flex + items-center + justify-center
 * + gap-3 + [&_b]:text-gray-1000 [&_b]:font-semibold + p-4（组件内置）；
 * 文本 p 用 text-copy-16 text-gray-900；CTA 胶囊 bg-background-100 + rounded-full
 * + h-8 + px-3 + text-button-14/500 + shadow-border-small。
 */
const CTA_CLASS =
  "inline-flex h-8 max-w-full shrink-0 items-center justify-center rounded-full bg-background-100 px-3 text-button-14 font-medium text-gray-1000 shadow-[var(--material-shadow-small)] outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-200 focus-ring";

function Banner({ button, children, className, ...props }: BannerProps) {
  return (
    <div
      data-slot="banner"
      className={cn(
        "flex w-full max-w-[1080px] flex-wrap items-center justify-center gap-3 p-4 [&_b]:text-gray-1000 [&_b]:font-semibold",
        className,
      )}
      {...props}
    >
      <p className="text-copy-16 text-gray-900">{children}</p>
      {button && (
        <a
          href={button.href}
          target={button.target}
          rel={button.rel}
          className={CTA_CLASS}
        >
          <span className="inline-block truncate px-1.5">{button.content}</span>
          <span className="ml-1 mr-0.5 flex shrink-0 items-center justify-center" aria-hidden>
            <ChevronRight className="size-3.5" />
          </span>
        </a>
      )}
    </div>
  );
}

export { Banner };

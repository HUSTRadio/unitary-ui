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
 * 响应式双根节点：
 * - Mobile（<lg）：整条胶囊 `<a>`（lg:hidden）——文本 + chevron，无 "Read more" 文本
 * - Desktop（≥lg）：`<div>` 文本 + 单独 CTA 胶囊（hidden lg:flex）
 *
 * 胶囊样式（官方实测）：bg background-100 + 1px ring（gray-400）+ 底部阴影
 * （material-small / shadow-border-small）+ rounded-full + h-8 + px-3 + text-button-14/500。
 * `<b>` 保持原生 bold（700），不降为 font-semibold。
 */
const CTA_CLASS =
  "material-small inline-flex h-8 max-w-full shrink-0 items-center justify-center rounded-full bg-background-100 px-3 text-button-14 font-medium text-gray-1000 outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-200 focus-ring";

function Banner({ button, children, className, ...props }: BannerProps) {
  return (
    <>
      {/* Mobile：整条胶囊链接（文本 + chevron） */}
      <a
        data-slot="banner"
        href={button?.href}
        target={button?.target}
        rel={button?.rel}
        className={cn(CTA_CLASS, "mx-auto !w-fit lg:hidden")}
      >
        <span className="inline-block truncate px-1.5">{children}</span>
        <span className="ml-1 mr-0.5 flex shrink-0 items-center justify-center" aria-hidden>
          <ChevronRight className="size-3.5" />
        </span>
      </a>

      {/* Desktop：文本 + 单独 CTA 胶囊 */}
      <div
        data-slot="banner"
        className={cn(
          "hidden w-full max-w-[1080px] items-center justify-center gap-3 lg:flex [&_b]:text-gray-1000",
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
    </>
  );
}

export { Banner };

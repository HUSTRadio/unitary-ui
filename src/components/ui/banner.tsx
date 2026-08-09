import * as React from "react";

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
 * Banner — full-width announcement with an optional pill CTA.
 * Official contract: `<Banner button={{ href, content }}>…</Banner>`.
 */
function Banner({ button, children, className, ...props }: BannerProps) {
  return (
    <div data-slot="banner" className={cn("flex w-full items-center gap-3", className)} {...props}>
      <div className="min-w-0 flex-1 text-copy-16 text-gray-900 [&_b]:font-semibold">
        {children}
      </div>
      {button ? (
        <a
          href={button.href}
          target={button.target}
          rel={button.rel}
          className="material-small inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-background-100 px-3 text-[14px]/[21px] font-medium text-gray-1000 outline-none transition-colors hover:bg-gray-100 focus-ring"
        >
          {button.content}
        </a>
      ) : null}
    </div>
  );
}

export { Banner };

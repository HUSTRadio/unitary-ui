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
 * Banner - full-width announcement with an optional pill CTA.
 *
 * Official contract (vercel.com/geist/banner):
 * - Mobile (< lg): whole-message pill CTA (lg:hidden)
 * - Desktop (≥ lg): content + separate CTA row (hidden lg:flex)
 * - CTA: text-button-14 (14px/21px), 32px height, pill shape
 * - Chevron: 14px (size-3.5), not 16px
 */
function Banner({ button, children, className, ...props }: BannerProps) {
  const cta = button ? (
    <a
      href={button.href}
      target={button.target}
      rel={button.rel}
      className="material-small inline-flex h-8 max-w-full shrink-0 items-center justify-center rounded-full bg-background-100 px-3 text-button-14 text-gray-1000 outline-none transition-colors hover:bg-gray-100 focus-ring"
    >
      <span className="inline-block truncate px-1.5">{button.content}</span>
      <span className="ml-1 mr-0.5 flex shrink-0 items-center justify-center" aria-hidden>
        <ChevronRight className="size-3.5" />
      </span>
    </a>
  ) : null;

  return (
    <>
      {/* Mobile: whole-message pill CTA */}
      <div
        data-slot="banner"
        className={cn(
          "flex w-full max-w-[1080px] items-center justify-center lg:hidden [&_b]:font-semibold [&_b]:text-gray-1000",
          className,
        )}
        {...props}
      >
        <a
          href={button?.href}
          target={button?.target}
          rel={button?.rel}
          className="material-small inline-flex h-8 max-w-full shrink-0 items-center justify-center gap-1 rounded-full bg-background-100 px-3 text-button-14 text-gray-1000 outline-none transition-colors hover:bg-gray-100 focus-ring"
        >
          <span className="inline-block truncate px-1.5 [&_b]:font-semibold [&_b]:text-gray-1000">
            {children}
          </span>
          {button && (
            <>
              <span className="px-0.5 text-gray-900" aria-hidden>
                {button.content}
              </span>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
            </>
          )}
        </a>
      </div>

      {/* Desktop: content + CTA row */}
      <div
        data-slot="banner"
        className={cn(
          "hidden w-full max-w-[1080px] items-center justify-center gap-3 lg:flex [&_b]:font-semibold [&_b]:text-gray-1000",
          className,
        )}
        {...props}
      >
        <p className="text-copy-16 text-gray-900">{children}</p>
        {cta}
      </div>
    </>
  );
}

export { Banner };

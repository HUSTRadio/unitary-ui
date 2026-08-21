import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface PaginationRailLink {
  title: string;
  href: string;
}

interface PaginationProps extends React.ComponentProps<"nav"> {
  previous?: PaginationRailLink;
  next?: PaginationRailLink;
}

function Pagination({ className, previous, next, children, ...props }: PaginationProps) {
  const { t } = useI18n();
  return (
    <nav
      role="navigation"
      aria-label={t("pagination")}
      data-slot="pagination"
      className={cn(
        "relative flex w-full flex-wrap items-start justify-between [&_a]:no-underline",
        className,
      )}
      {...props}
    >
      {previous ? <RailLink direction="previous" {...previous} /> : <span />}
      {children ? (
        <div className="absolute top-1/2 left-1/2 z-2 max-xl:hidden -translate-x-1/2 -translate-y-1/2">
          {children}
        </div>
      ) : null}
      {next ? <RailLink direction="next" {...next} /> : <span />}
    </nav>
  );
}

function RailLink({
  direction,
  title,
  href,
}: PaginationRailLink & { direction: "previous" | "next" }) {
  const { t } = useI18n();
  const alignRight = direction === "next";
  return (
    <a
      href={href}
      aria-label={t("Go to {direction} page: {title}", { direction, title })}
      data-slot="pagination-rail-link"
      className={cn(
        "group rounded-md p-1 focus-ring",
        alignRight ? "ml-auto pr-7 pl-2" : "pr-2 pl-7",
      )}
    >
      <span className="mb-0.5 text-copy-13 text-gray-900 transition-colors duration-200 ease-in-out group-hover:text-foreground">
        {alignRight ? t("Next") : t("Previous")}
      </span>
      <span className="relative flex [&>span]:inline-block [&>span]:max-w-[20em] [&>span]:truncate [&>span]:break-words">
        <span className="text-[16px] leading-[24px] font-medium">{title}</span>
        <span
          aria-hidden
          className={cn(
            "absolute mt-0.5 text-gray-900 transition-colors duration-200 ease-in-out group-hover:text-foreground",
            alignRight ? "-right-[26px]" : "-left-[26px]",
          )}
        >
          {alignRight ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </span>
      </span>
    </a>
  );
}

export { Pagination };

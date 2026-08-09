import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Breadcrumbs — 面包屑导航，展示用户在当前站点层级中的位置。
 * BreadcrumbsItem + BreadcrumbsLink 组合，BreadcrumbsSeparator 为分隔箭头。
 */
function Breadcrumbs({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="breadcrumbs"
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-label-14", className)}
      {...props}
    />
  );
}

function BreadcrumbsItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumbs-item"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function BreadcrumbsLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="breadcrumbs-link"
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbsSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumbs-separator"
      aria-hidden
      className={cn("text-muted-foreground/50", className)}
      {...props}
    >
      <ChevronRight className="size-4" />
    </span>
  );
}

export { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink, BreadcrumbsSeparator };

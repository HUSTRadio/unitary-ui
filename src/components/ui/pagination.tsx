import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface PaginationRailLink {
  title: string;
  href: string;
}

export interface PaginationProps extends React.ComponentProps<"nav"> {
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
      aria-label={
        alignRight
          ? t("Go to next page: {title}", { title })
          : t("Go to previous page: {title}", { title })
      }
      data-slot="pagination-rail-link"
      className={cn(
        "group rounded-md p-1 focus-ring",
        alignRight ? "ml-auto pr-7 pl-2" : "pr-2 pl-7",
      )}
    >
      <span className="mb-0.5 text-copy-13 text-gray-900 transition-colors duration-(--uni-duration-base) ease-in-out group-hover:text-foreground">
        {alignRight ? t("Next page") : t("Previous page")}
      </span>
      <span className="relative flex [&>span]:inline-block [&>span]:max-w-[20em] [&>span]:truncate [&>span]:break-words">
        <span className="text-[16px] leading-[24px] font-medium">{title}</span>
        <span
          aria-hidden
          className={cn(
            "absolute mt-0.5 text-gray-900 transition-colors duration-(--uni-duration-base) ease-in-out group-hover:text-foreground",
            alignRight ? "-right-[26px]" : "-left-[26px]",
          )}
        >
          {alignRight ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </span>
      </span>
    </a>
  );
}

export interface NumberedPaginationProps extends Omit<
  React.ComponentProps<"nav">,
  "onChange" | "children"
> {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  getPageHref?: (page: number) => string;
  disabled?: boolean;
}

function NumberedPagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  getPageHref,
  disabled = false,
  className,
  ...props
}: NumberedPaginationProps) {
  const { t } = useI18n();
  const [internalPage, setInternalPage] = React.useState(defaultPage);
  const count = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0;
  const current = Math.min(Math.max(1, Math.floor(page ?? internalPage) || 1), Math.max(1, count));
  const siblings = Number.isFinite(siblingCount)
    ? Math.min(10, Math.max(0, Math.floor(siblingCount)))
    : 1;
  const pages = new Set<number>();
  if (count) {
    pages.add(1);
    for (
      let value = Math.max(1, current - siblings);
      value <= Math.min(count, current + siblings);
      value++
    )
      pages.add(value);
    pages.add(count);
  }
  const visible: (number | string)[] = [];
  let last = 0;
  for (const value of [...pages].sort((a, b) => a - b)) {
    if (value - last === 2) visible.push(last + 1);
    else if (last && value - last > 2) visible.push(`gap-${last}`);
    visible.push(value);
    last = value;
  }
  const select = (value: number) => {
    if (disabled || !count || value === current) return;
    if (page === undefined) setInternalPage(value);
    onPageChange?.(value);
  };
  const control = (
    value: number,
    label: string,
    children: React.ReactNode,
    inactive = false,
    active = false,
  ) => {
    const shared = {
      className: cn(
        "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border px-2 text-label-14 focus-ring transition-colors motion-reduce:transition-none pointer-coarse:min-h-11 pointer-coarse:min-w-11",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-transparent hover:bg-gray-alpha-100",
        inactive && "pointer-events-none opacity-50",
      ),
      "aria-label": label,
      "aria-current": active ? ("page" as const) : undefined,
      children,
    };
    return getPageHref && !inactive ? (
      <a
        {...shared}
        href={getPageHref(value)}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) select(value);
        }}
      />
    ) : (
      <button {...shared} type="button" disabled={inactive} onClick={() => select(value)} />
    );
  };
  return (
    <nav
      data-slot="numbered-pagination"
      aria-label={t("pagination")}
      className={className}
      {...props}
    >
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          {control(
            Math.max(1, current - 1),
            t("Previous page"),
            <ChevronLeft className="size-4" aria-hidden />,
            disabled || current <= 1 || !count,
          )}
        </li>
        {visible.map((value) => (
          <li key={value}>
            {typeof value === "number" ? (
              control(
                value,
                t("Go to page {page}", { page: value }),
                value,
                disabled,
                value === current,
              )
            ) : (
              <span aria-hidden className="inline-flex min-h-9 min-w-5 items-center justify-center">
                …
              </span>
            )}
          </li>
        ))}
        <li>
          {control(
            Math.min(count, current + 1),
            t("Next page"),
            <ChevronRight className="size-4" aria-hidden />,
            disabled || current >= count || !count,
          )}
        </li>
      </ul>
    </nav>
  );
}

export { Pagination, NumberedPagination };

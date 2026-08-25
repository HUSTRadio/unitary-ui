import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type BreadcrumbType = "text" | "menu";

const BreadcrumbTypeContext = React.createContext<BreadcrumbType>("text");

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  type?: BreadcrumbType;
}

/**
 * Breadcrumb - 官方 @vercel/geistcn Breadcrumb 对齐实现（vercel.com/geist/breadcrumbs 实测）。
 *
 * 双变体结构（官方实时 DOM 实测）：
 * - `type="text"`（默认）：`<nav><ol class="flex list-none gap-1.5"><li>`，每个 li 为
 *   文本（或 href 时 `<a>`）+ 16px chevron 分隔符；li 本身带 cursor-pointer。
 * - `type="menu"`：`<div class="flex gap-2">` 直接排布 `<button>`，按钮之间无 chevron
 *   分隔符（官方 menu 变体是独立 chip 按钮组，不用 nav/ol/li）。
 */
function Breadcrumb({ type = "text", className, children, ...props }: BreadcrumbProps) {
  const { t } = useI18n();
  return (
    <BreadcrumbTypeContext.Provider value={type}>
      {type === "menu" ? (
        <div
          data-slot="breadcrumb"
          role="navigation"
          aria-label={t("Breadcrumb")}
          className={cn("flex gap-2 max-sm:overflow-x-auto", className)}
        >
          {children}
        </div>
      ) : (
        <nav data-slot="breadcrumb" aria-label={t("Breadcrumb")} className={className} {...props}>
          <ol className="flex list-none items-center gap-1.5 p-0">{children}</ol>
        </nav>
      )}
    </BreadcrumbTypeContext.Provider>
  );
}

interface BreadcrumbItemProps extends Omit<React.ComponentProps<"li">, "onClick"> {
  active?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

function BreadcrumbItem({
  active = false,
  disabled = false,
  href,
  onClick,
  className,
  children,
  ...props
}: BreadcrumbItemProps) {
  const type = React.useContext(BreadcrumbTypeContext);

  if (type === "menu") {
    return (
      <button
        type="button"
        data-slot="breadcrumb-item"
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className={cn(
          "cursor-pointer truncate whitespace-nowrap break-normal rounded-sm border border-gray-alpha-400 bg-background-200 px-1.5 py-0.5",
          "text-label-12 text-gray-900 transition-[color,border-color,background] duration-(--uni-duration-base)",
          "hover:bg-gray-200 hover:border-gray-alpha-500 hover:text-gray-1000 focus-ring",
          active && "text-gray-1000",
          disabled && "cursor-not-allowed text-gray-700",
          className,
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <li
      data-slot="breadcrumb-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 text-label-14 cursor-pointer transition-colors duration-(--uni-duration-base)",
        "text-gray-900 hover:text-gray-1000",
        "last-of-type:[&_svg]:hidden [&_svg]:text-gray-900",
        active && "text-gray-1000",
        disabled && "text-gray-700 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {href ? (
        <a
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? undefined : (onClick as React.MouseEventHandler<HTMLAnchorElement>)}
          className="rounded-xs text-inherit no-underline focus-ring"
        >
          {children}
        </a>
      ) : (
        children
      )}
      <ChevronRight aria-hidden className="size-4 shrink-0" />
    </li>
  );
}

export { Breadcrumb, BreadcrumbItem };
export type { BreadcrumbType, BreadcrumbProps, BreadcrumbItemProps };

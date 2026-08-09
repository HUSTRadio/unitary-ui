import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BreadcrumbType = "text" | "menu";

const BreadcrumbTypeContext = React.createContext<BreadcrumbType>("text");

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  type?: BreadcrumbType;
}

function Breadcrumb({ type = "text", className, children, ...props }: BreadcrumbProps) {
  return (
    <BreadcrumbTypeContext.Provider value={type}>
      <nav data-slot="breadcrumb" aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex list-none items-center gap-1.5 p-0">{children}</ol>
      </nav>
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
  const common = cn(
    "min-w-0 transition-[color,border-color,background-color] duration-200 outline-none focus-ring",
    type === "menu"
      ? "inline-block max-w-full truncate rounded-[4px] border border-gray-alpha-400 bg-background-200 px-1.5 py-0.5 text-xs/4 whitespace-nowrap text-gray-900 hover:border-gray-alpha-500 hover:bg-gray-200 hover:text-gray-1000"
      : "text-sm/5 text-gray-900 hover:text-gray-1000",
    active && "text-gray-1000",
    disabled && "cursor-not-allowed text-gray-700 hover:bg-transparent hover:text-gray-700",
  );

  let content: React.ReactNode;
  if (href) {
    content = (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? undefined : (onClick as React.MouseEventHandler<HTMLAnchorElement>)}
        className={common}
      >
        {children}
      </a>
    );
  } else if (type === "menu" && !active) {
    content = (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className={common}
      >
        {children}
      </button>
    );
  } else {
    content = <span className={common}>{children}</span>;
  }

  return (
    <li
      data-slot="breadcrumb-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 items-center gap-1.5 last-of-type:[&_svg]:hidden [&_svg]:text-gray-900",
        className,
      )}
      {...props}
    >
      {content}
      <ChevronRight aria-hidden className="size-4 shrink-0" />
    </li>
  );
}

export { Breadcrumb, BreadcrumbItem };

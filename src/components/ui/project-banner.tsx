import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ProjectBanner — 项目级横幅（对应官方 Project Banner，docs/geist-markdown-refs/components/project-banner.md）。
 * 用于需要解决的临时性项目级通知：逾期账单、回滚中、攻击缓解、试用到期。
 *
 * 官方实测（vercel.com/geist/project-banner，2026-08 CDP）：
 * - 根：<aside>，flex justify-center items-center gap-x-2 py-2 min-h-[40px]
 *   border-t border-b border-gray-400 bg-gray-100 text-[14px]/20px text-gray-900 translate-y-[-1px]
 * - 内容：flex flex-col gap-2 px-6（移动）→ md:flex-row md:justify-center md:items-center（桌面）
 * - icon：16px shrink-0（aria-hidden），随 label 文字色（gray-900）
 * - label：<p>，14px/20px，text-gray-900
 * - callToAction：链接样式（underline + decoration-*-400，14px/20px font-medium），
 *   variant 决定文字色：default=gray-1000 / success=blue-1000 / warning=amber-1000 / error=red-1000，
 *   hover 降到 900 级、decoration 升到 500 级
 *
 * 官方 Best Practices：non-dismissible by design；一次一个；始终提供 callToAction。
 * ProjectBannerContent / ProjectBannerClose 为本地扩展（children 组合式用法），非官方 API。
 */

type ProjectBannerVariant = "default" | "success" | "warning" | "error";

interface ProjectBannerCallToAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ProjectBannerProps extends React.ComponentProps<"aside"> {
  /** 严重度语义（官方 variant），决定 CTA 文字色与焦点语义。默认 gray。 */
  variant?: ProjectBannerVariant;
  /** 16px 图标（官方 icon，aria-hidden，随 label 文字色） */
  icon?: React.ReactNode;
  /** 一句 sentence case 文案（官方 label） */
  label?: React.ReactNode;
  /** 解决该状态的行动入口（官方 callToAction，Title Case 动词短语） */
  callToAction?: ProjectBannerCallToAction;
}

const CTA_VARIANT_CLASSES: Record<ProjectBannerVariant, string> = {
  default: "text-gray-1000 hover:text-gray-900 decoration-gray-500 hover:decoration-gray-500",
  success: "text-blue-1000 hover:text-blue-900 decoration-blue-400 hover:decoration-blue-500",
  warning: "text-amber-1000 hover:text-amber-900 decoration-amber-400 hover:decoration-amber-500",
  error: "text-red-1000 hover:text-red-900 decoration-red-400 hover:decoration-red-500",
};

const CTA_BASE_CLASS =
  "rounded-xs cursor-pointer bg-transparent px-0 py-1 h-6 my-[-1px] font-medium underline underline-offset-[5px] outline-none focus-ring text-[14px] leading-5";

function ProjectBanner({
  className,
  variant = "default",
  icon,
  label,
  callToAction,
  children,
  ...props
}: ProjectBannerProps) {
  const hasApiProps = icon !== undefined || label !== undefined || callToAction !== undefined;

  const content = hasApiProps ? (
    <div className="flex w-full flex-col gap-2 px-6 md:flex-row md:items-center md:justify-center">
      {(icon !== undefined || label !== undefined) && (
        <div className="flex items-center gap-2">
          {icon !== undefined && (
            <div aria-hidden="true" className="shrink-0 [&_svg]:size-4">
              {icon}
            </div>
          )}
          {label !== undefined && <p className="text-gray-900">{label}</p>}
        </div>
      )}
      {callToAction && (
        <div className="ml-6 md:ml-0">
          {callToAction.href !== undefined ? (
            <a
              href={callToAction.href}
              className={cn(CTA_BASE_CLASS, CTA_VARIANT_CLASSES[variant])}
            >
              {callToAction.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={callToAction.onClick}
              className={cn(CTA_BASE_CLASS, CTA_VARIANT_CLASSES[variant])}
            >
              {callToAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  ) : (
    children
  );

  return (
    <aside
      data-slot="project-banner"
      className={cn(
        "flex z-30 min-h-[40px] translate-y-[-1px] items-center justify-center gap-x-2 border-t border-b border-gray-400 bg-gray-100 py-2 text-[14px] leading-5 text-gray-900",
        className,
      )}
      {...props}
    >
      {content}
    </aside>
  );
}

/** 本地扩展：children 组合式内容容器（官方 API 用 icon/label/callToAction prop）。 */
function ProjectBannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-banner-content"
      className={cn(
        "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * 本地扩展（官方按设计不可关闭）：仅当显式传入 onClick 时渲染关闭按钮；
 * 未传 onClick 时不渲染（避免死控件）。
 */
function ProjectBannerClose({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  if (!onClick) {
    return null;
  }
  return (
    <Button
      typeName="button"
      type="tertiary"
      svgOnly
      size="small"
      aria-label="Close banner"
      onClick={onClick}
      className={cn("absolute top-4 right-4", className)}
      {...props}
    >
      <X aria-hidden />
    </Button>
  );
}

export { ProjectBanner, ProjectBannerContent, ProjectBannerClose };
export type { ProjectBannerProps, ProjectBannerVariant, ProjectBannerCallToAction };

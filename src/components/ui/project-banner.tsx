import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ProjectBanner — 项目级横幅（对应官方 Project Banner，docs/geist-markdown-refs/components/project-banner.md）。
 * 用于需要解决的临时性项目级通知：逾期账单、回滚中、攻击缓解、试用到期。
 * 导出 ProjectBanner, ProjectBannerContent, ProjectBannerClose。
 * 样式（官方实测对齐）：
 * - root：relative overflow-hidden border-b border-gray-alpha-400 bg-background
 * - content：flex items-center justify-between gap-4 px-6 py-4 max-w-7xl mx-auto
 * - close：absolute right-4 top-4 ghost icon-sm button
 * 官方 bestPractices：
 * - 匹配严重度：error 关键宕机 / 支付阻塞，warning 非即时处理的异常态，
 *   success 正向临时缓解，默认灰即常规项目级通知。
 * - Project Banner 按设计不可随意关闭（non-dismissible by design）；消息可被关闭
 *   而不解决底层状态时改用 Note。
 * - 一次只显示一个 Project Banner；始终提供解决该状态的行动入口。
 * - label 是一句 sentence case、直接点名影响；CTA 是 Title Case 动词短语。
 *
 * 修复（2026-08 实测）：官方 4 个变体均无关闭按钮；本地 ProjectBannerClose 曾无条件渲染
 * （demo 未接 onClick = 死控件）。现仅在调用方显式传入 onClick 时渲染关闭按钮 ——
 * 无 onClick 时不渲染任何内容，保持官方 non-dismissible 外观，且不再产生死控件。
 * ProjectBannerClose 属本地扩展，非官方 API 的一部分。
 */
function ProjectBanner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-banner"
      className={cn(
        "relative overflow-hidden border-b border-gray-alpha-400 bg-background",
        className,
      )}
      {...props}
    />
  );
}

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

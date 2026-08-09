import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Entity — Geist 行级实体卡片。
 * 左侧媒体（Avatar / 图标）+ 中间内容（标题 + 描述）+ 右侧操作区。
 * 用于成员行、集成行、域名行等「描述性内容 + 一两个控件」的行式布局。
 */

function Entity({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="entity"
      className={cn(
        "flex items-center gap-4 rounded-[8px] border border-gray-alpha-400 bg-background p-4",
        className,
      )}
      {...props}
    />
  );
}

function EntityMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="entity-media"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-alpha-200",
        className,
      )}
      {...props}
    />
  );
}

function EntityContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="entity-content" className={cn("min-w-0 flex-1", className)} {...props} />;
}

function EntityTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="entity-title"
      className={cn("truncate text-label-14 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function EntityDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="entity-description"
      className={cn("truncate text-copy-13 text-muted-foreground", className)}
      {...props}
    />
  );
}

function EntityAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="entity-action" className={cn("ml-auto shrink-0", className)} {...props} />;
}

export { Entity, EntityMedia, EntityContent, EntityTitle, EntityDescription, EntityAction };

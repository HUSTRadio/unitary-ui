import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Entity — Geist 官方 Entity 行式实体卡片（vercel.com/geist/entity 实测对齐）。
 *
 * 官方 DOM（b1-evidence + CDP 实测）：
 *   li.p-4.flex.flex-col.items-stretch.justify-start.flex-initial
 *     section.flex.items-center.gap-4
 *       div.left.flex.flex-1.items-center.gap-4.min-w-0
 *         [EntityMedia 内容直接内联]
 *         div.flex.items-center.gap-2.[--width:initial].w-[var(--width, initial)].min-w-0[.flex-1|.flex-initial]
 *           div.flex.flex-col.items-stretch.flex-1.min-w-0
 *             p.text-copy-14.truncate.font-semibold（Title）
 *             p.text-copy-14.truncate.text-gray-900（Description）
 *       div.right.flex.items-center.gap-4.ml-auto（有 Action 时）
 *         [EntityAction 内容直接内联]
 *
 * 使用：<Entity><EntityMedia>…</EntityMedia><EntityContent fill>…</EntityContent>
 *       <EntityAction>…</EntityAction></Entity>。EntityContent 的 fill 控制内容列
 *       flex-1（占满）还是 flex-initial（按内容）；leftClassName/rightClassName
 *       透传到 left/right 容器（官方 columnClassName 场景）。
 */

function EntityMedia({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function EntityContent({
  className,
  fill = false,
  ...props
}: React.ComponentProps<"div"> & { fill?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 [--width:initial] w-[var(--width, initial)] min-w-0",
        fill ? "flex-1" : "flex-initial",
      )}
    >
      <div
        data-slot="entity-content"
        className={cn("flex flex-col items-stretch flex-1 min-w-0", className)}
        {...props}
      />
    </div>
  );
}

function EntityTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="entity-title"
      className={cn("text-copy-14 truncate font-semibold", className)}
      {...props}
    />
  );
}

function EntityDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="entity-description"
      className={cn("text-copy-14 truncate text-gray-1000", className)}
      {...props}
    />
  );
}

function EntityAction({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function Entity({
  className,
  leftClassName,
  rightClassName,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  /** 透传到 left 容器（官方 columnClassName 左侧） */
  leftClassName?: string;
  /** 透传到 right 容器（官方 columnClassName 右侧） */
  rightClassName?: string;
}) {
  const media: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const action: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === EntityMedia) media.push(child);
    else if (React.isValidElement(child) && child.type === EntityAction) action.push(child);
    else content.push(child);
  });
  return (
    <li
      data-slot="entity"
      className={cn("p-4 flex flex-col items-stretch justify-start flex-initial", className)}
      {...props}
    >
      <section className="flex items-center gap-4">
        <div
          data-slot="entity-left"
          className={cn("left flex flex-1 items-center gap-4 min-w-0", leftClassName)}
        >
          {media}
          {content}
        </div>
        {action.length > 0 && (
          <div
            data-slot="entity-right"
            className={cn("right flex items-center gap-4 ml-auto", rightClassName)}
          >
            {action}
          </div>
        )}
      </section>
    </li>
  );
}

export { Entity, EntityMedia, EntityContent, EntityTitle, EntityDescription, EntityAction };

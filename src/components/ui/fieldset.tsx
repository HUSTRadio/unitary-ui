import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Label } from "./label";

/* ------------------------------------------------------------------ */
/* 原生表单分组（FieldSet*）：<fieldset>/<legend> 语义，保留既有用法。  */
/* ------------------------------------------------------------------ */

/**
 * FieldSet — 表单分组（对应官方 Fieldset，docs/geist-markdown-refs/components/fieldset.md）。
 * radix-ui 统一包不含 FieldSet 原语，因此直接消费原生 <fieldset>/<legend> 语义元素，
 * 视觉与交互（legend 关联分组、legend 无障碍播报组名）与官方一致。
 * 导出 FieldSet / FieldSetLegend / FieldSetItem / FieldSetLabel：
 * - FieldSetLegend：text-label-14 text-foreground，分组标题
 * - FieldSetItem：flex items-center gap-3，单行字段（控件 + 标签）
 * - FieldSetLabel：复用 Label（cursor-pointer），绑定 FieldSetItem 内的控件
 * 颜色消费语义 token（--foreground），零 `dark:` 分支。
 */
/** @deprecated 请改用卡片式 `Fieldset` 组合 API。 */
type FieldSetProps = React.ComponentProps<"fieldset">;
/** @deprecated 请改用 `FieldsetTitle`。 */
type FieldSetLegendProps = React.ComponentProps<"legend">;
/** @deprecated 请改用 `FieldsetContent`。 */
type FieldSetItemProps = React.ComponentProps<"div">;
/** @deprecated 请在 `FieldsetContent` 内使用正式表单 Label。 */
type FieldSetLabelProps = React.ComponentProps<typeof Label>;

/** @deprecated 请改用卡片式 `Fieldset` 组合 API。 */
function FieldSet({ className, ...props }: FieldSetProps) {
  return <fieldset data-slot="fieldset" className={cn("min-w-0", className)} {...props} />;
}

/** @deprecated 请改用 `FieldsetTitle`。 */
function FieldSetLegend({ className, ...props }: FieldSetLegendProps) {
  return (
    <legend
      data-slot="fieldset-legend"
      className={cn("mb-2 text-label-14 text-foreground", className)}
      {...props}
    />
  );
}

/** @deprecated 请改用 `FieldsetContent`。 */
function FieldSetItem({ className, ...props }: FieldSetItemProps) {
  return (
    <div
      data-slot="fieldset-item"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

/** @deprecated 请在 `FieldsetContent` 内使用正式表单 Label。 */
function FieldSetLabel({ className, ...props }: FieldSetLabelProps) {
  return <Label data-slot="fieldset-label" className={cn(className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* 官方卡片式 Fieldset：卡片（标题 + 副标题 + 内容 + footer）。          */
/* 官方部件集：Fieldset / FieldsetTitle / FieldsetSubtitle /           */
/* FieldsetContent / FieldsetFooter / FieldsetFooterStatus /           */
/* FieldsetFooterActions / FieldsetFooterAction / ErrorText /          */
/* WarningText / DisabledWall。                                        */
/* 官方实测：                                                           */
/* - 容器 r:6px；default 类型无边框；error/warning 类型 1px 彩色边框     */
/*   （border-red-400 / border-amber-400）                              */
/* - 标题 20px/600；footer `min-h-14 bg-background-200 border-t          */
/*   pt-3 pr-3 pb-3 pl-5`（内置 status 左 + actions 右）；               */
/* - type="error" 时 footer border-t red-400 / bg red-100 / text red-900，*/
/*   type="warning" 时 amber 对应值；highlight 时 footer 高亮背景         */
/*   `bg-[var(--bg,#f5f5f5)]`。                                          */
/* - 禁用只作用于内容区：FieldsetContent disabled -> 内容 text-gray-700 +  */
/*   内容区内墙（absolute inset-0 bg-background/60），footer 保持全不透明。 */
/* ------------------------------------------------------------------ */

type FieldsetType = "default" | "error" | "warning";

const FieldsetTypeContext = React.createContext<FieldsetType>("default");

interface FieldsetProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** 视觉类型：default / error / warning（染色 footer 与边框） */
  type?: FieldsetType;
  /** 标题（等价于 FieldsetTitle 子部件） */
  title?: React.ReactNode;
  /** 副标题（等价于 FieldsetSubtitle 子部件） */
  subtitle?: React.ReactNode;
}

type FieldsetTitleProps = React.ComponentProps<"h4">;
type FieldsetSubtitleProps = React.ComponentProps<"p">;
type FieldsetFooterStatusProps = React.ComponentProps<"div">;
type FieldsetFooterActionsProps = React.ComponentProps<"div">;
type FieldsetFooterActionProps = React.ComponentProps<typeof Button>;
type ErrorTextProps = React.ComponentProps<"span">;
type WarningTextProps = React.ComponentProps<"span">;
type DisabledWallProps = React.ComponentProps<"div">;

function Fieldset({
  className,
  type = "default",
  title,
  subtitle,
  children,
  ...props
}: FieldsetProps) {
  const titleNodes: React.ReactNode[] = [];
  const subtitleNodes: React.ReactNode[] = [];
  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      rest.push(child);
      return;
    }
    if (child.type === FieldsetTitle) titleNodes.push(child);
    else if (child.type === FieldsetSubtitle) subtitleNodes.push(child);
    else rest.push(child);
  });

  const hasDirectHeader =
    title !== undefined ||
    subtitle !== undefined ||
    titleNodes.length > 0 ||
    subtitleNodes.length > 0;

  return (
    <FieldsetTypeContext.Provider value={type}>
      <div
        data-slot="fieldset"
        data-fieldset-type={type}
        className={cn(
          "group/fieldset material-base relative overflow-hidden rounded-[6px] [--geist-fieldset-title-color:var(--ds-gray-1000)]",
          type === "error" && "border border-red-400 shadow-none",
          type === "warning" && "border border-amber-400 shadow-none",
          className,
        )}
        {...props}
      >
        {hasDirectHeader && (
          <FieldsetContent>
            {title !== undefined ? <FieldsetTitle>{title}</FieldsetTitle> : titleNodes}
            {subtitle !== undefined ? (
              <FieldsetSubtitle>{subtitle}</FieldsetSubtitle>
            ) : (
              subtitleNodes
            )}
          </FieldsetContent>
        )}
        {rest}
      </div>
    </FieldsetTypeContext.Provider>
  );
}

function FieldsetTitle({ className, ...props }: FieldsetTitleProps) {
  return (
    <h4
      data-slot="fieldset-title"
      className={cn(
        "inline-flex items-center text-heading-20 text-foreground [word-break:_break-word]",
        className,
      )}
      {...props}
    />
  );
}

function FieldsetSubtitle({ className, ...props }: FieldsetSubtitleProps) {
  return (
    <p
      data-slot="fieldset-subtitle"
      className={cn("pb-5 pt-2 text-copy-14 text-gray-900 first:pt-0", className)}
      {...props}
    />
  );
}

interface FieldsetContentProps extends React.ComponentProps<"div"> {
  /** 禁用态：内容降级 text-gray-700 + 内容区内墙（对应官方 Disabled / With Disabled Wall） */
  disabled?: boolean;
}

function FieldsetContent({
  className,
  disabled = false,
  children,
  ...props
}: FieldsetContentProps) {
  return (
    <div
      data-slot="fieldset-content"
      className={cn(
        "relative rounded-t-[6px] bg-background p-5 [&:has(>[data-slot=fieldset-subtitle]:last-child)]:pb-0 first:rounded-t-[6px] last:rounded-b-[6px]",
        disabled && "text-gray-700",
        className,
      )}
      {...props}
    >
      {disabled && <div aria-hidden data-slot="fieldset-wall" className="absolute inset-0 z-1" />}
      {children}
    </div>
  );
}

interface FieldsetFooterProps extends React.ComponentProps<"footer"> {
  /** 高亮态：footer 使用高亮背景（bg-[var(--bg,#f5f5f5)]，对应官方 Disabled 示例） */
  highlight?: boolean;
}

function FieldsetFooter({ className, highlight = false, ...props }: FieldsetFooterProps) {
  const type = React.useContext(FieldsetTypeContext);
  // 注意：highlight 的 bg-[var(--bg,#f5f5f5)] 与类型 bg（bg-background-200 等）同属
  // tailwind-merge 的 bg-color 组，直接传入 cn() 会被 twMerge 去重丢掉一个；
  // 官方 DOM 同时保留两个类（由 CSS 级联决定最终背景），因此 highlight 类拼接在 cn() 之外。
  const typeClasses = cn(
    "relative flex min-h-14 items-center rounded-bl rounded-br border-t pt-3 pr-3 pb-3 pl-5 text-copy-14",
    type === "default" && "border-gray-400 bg-background-200 text-gray-900",
    type === "error" && "border-red-400 bg-red-100 text-red-900",
    type === "warning" && "border-amber-400 bg-amber-100 text-amber-900",
    className,
  );
  return (
    <footer
      data-slot="fieldset-footer"
      className={highlight ? `${typeClasses} bg-[var(--bg,#f5f5f5)]` : typeClasses}
      {...props}
    />
  );
}

function FieldsetFooterStatus({ className, ...props }: FieldsetFooterStatusProps) {
  return (
    <div
      data-slot="fieldset-footer-status"
      className={cn("flex max-w-full items-center", className)}
      {...props}
    />
  );
}

function FieldsetFooterActions({ className, ...props }: FieldsetFooterActionsProps) {
  return (
    <div
      data-slot="fieldset-footer-actions"
      className={cn(
        "ml-auto flex items-center justify-end sm:justify-between max-w-3xl:ml-0",
        className,
      )}
      {...props}
    />
  );
}

function FieldsetFooterAction({ className, ...props }: FieldsetFooterActionProps) {
  return (
    <div data-slot="fieldset-footer-action" className={cn("mx-2 first:ml-0 last:mr-0", className)}>
      <Button typeName="button" size="small" type="secondary" {...props} />
    </div>
  );
}

/* 官方辅助部件：ErrorText / WarningText（内容区错误/警告文案）、DisabledWall（内容区禁用墙） */
function ErrorText({ className, ...props }: ErrorTextProps) {
  return (
    <span data-slot="fieldset-error-text" className={cn("text-red-900", className)} {...props} />
  );
}

function WarningText({ className, ...props }: WarningTextProps) {
  return (
    <span
      data-slot="fieldset-warning-text"
      className={cn("text-amber-900", className)}
      {...props}
    />
  );
}

function DisabledWall({ className, ...props }: DisabledWallProps) {
  return (
    <div
      aria-hidden
      data-slot="fieldset-disabled-wall"
      className={cn("absolute inset-0 z-1", className)}
      {...props}
    />
  );
}

export {
  FieldSet,
  FieldSetLegend,
  FieldSetItem,
  FieldSetLabel,
  Fieldset,
  FieldsetTitle,
  FieldsetSubtitle,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetFooterActions,
  FieldsetFooterAction,
  ErrorText,
  WarningText,
  DisabledWall,
  type FieldsetProps,
  type FieldsetType,
  type FieldsetContentProps,
  type FieldsetFooterProps,
  type FieldsetTitleProps,
  type FieldsetSubtitleProps,
  type FieldsetFooterStatusProps,
  type FieldsetFooterActionsProps,
  type FieldsetFooterActionProps,
  type ErrorTextProps,
  type WarningTextProps,
  type DisabledWallProps,
  type FieldSetProps,
  type FieldSetLegendProps,
  type FieldSetItemProps,
  type FieldSetLabelProps,
};

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Menu, MenuButton, MenuContainer, MenuItem, type MenuPosition } from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * SplitButton - Geist 官方 props 式 API（docs/geist-markdown-refs/components/split-button.md 实测）。
 * 一个主按钮 + 一个下拉菜单按钮，两者拼成单个圆角按钮组。
 *
 * 官方 API：
 * - `buttonProps`：主按钮 props（ButtonProps：onClick / size / type 等）
 * - `menuButtonLabel`：下拉触发按钮的无障碍标签（aria-label）
 * - `menuItems`：菜单内容（SplitButtonMenuItem[] 或 fragment）
 * - `menuAlignment`：菜单对齐方式，默认 "bottom-start"（对齐主按钮下方），可选 "bottom-end"
 * - `menuProps`：菜单容器 props（如 { width: 264 }）
 * - `children`：主按钮文案
 */

export type SplitButtonMenuAlignment = "bottom-start" | "bottom-end";

/**
 * 变体形态：
 * - `split`：官方按钮 + 菜单列表形态（下拉菜单贴在按钮下方）。
 * - `pulldown`：HIG Pull-down Button 的**悬浮卡片**变体——卡片锚定按钮的
 *   `expandCorner` 角，向对角方向展开（transform-origin 即该角 + 缩放入场）。
 */
export type SplitButtonVariant = "split" | "pulldown";

/** pulldown 卡片的展开角：卡片固定该角，向对向展开。 */
export type SplitButtonExpandCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/**
 * 展开角 → 菜单定位 + 动画原点。
 * - top-left：卡片在按钮下方、左对齐，从左上角向右下展开（常规下拉观感）
 * - top-right：卡片在按钮下方、右对齐，从右上角向左下展开
 * - bottom-left：卡片在按钮上方、左对齐，从左下角向右上展开
 * - bottom-right：卡片在按钮上方、右对齐，从右下角向左上展开
 */
const EXPAND_CORNER_PROPS: Record<
  SplitButtonExpandCorner,
  { position: MenuPosition; origin: string }
> = {
  "top-left": { position: "bottom-start", origin: "origin-top-left" },
  "top-right": { position: "bottom-end", origin: "origin-top-right" },
  "bottom-left": { position: "top-start", origin: "origin-bottom-left" },
  "bottom-right": { position: "top-end", origin: "origin-bottom-right" },
};

export interface SplitButtonProps extends React.ComponentProps<"div"> {
  /**
   * 形态变体（默认 "split"）：
   * - `split`：按钮 + 菜单列表（菜单贴在按钮下方）。
   * - `pulldown`：悬浮卡片，从 `expandCorner` 角向对向展开。
   */
  variant?: SplitButtonVariant;
  /** pulldown 卡片的展开角（split 模式忽略），默认 "top-left" */
  expandCorner?: SplitButtonExpandCorner;
  /** 主按钮 props（官方 buttonProps） */
  buttonProps?: ButtonProps;
  /** 下拉触发按钮的无障碍标签（官方 menuButtonLabel） */
  menuButtonLabel?: string;
  /**
   * 单独禁用下拉触发按钮（HIG-AUD-018）。
   * `buttonProps.disabled` 只作用于主按钮，无法表达「主按钮可用、菜单不可用」这一状态。
   */
  menuButtonDisabled?: boolean;
  /** 菜单对齐方式（官方 menuAlignment；默认 bottom-start 对齐主按钮下方） */
  menuAlignment?: SplitButtonMenuAlignment;
  /** 菜单内容（官方 menuItems：SplitButtonMenuItem[] 或 fragment） */
  menuItems?: React.ReactNode;
  /** 菜单容器 props（官方 menuProps，如 { width: 264 }） */
  menuProps?: React.ComponentProps<typeof Menu>;
}

export interface SplitButtonMenuItemProps {
  /** 菜单项标题（官方 title，可为任意 ReactNode） */
  title?: React.ReactNode;
  /** 菜单项描述（官方 description，第二行 muted 小字） */
  description?: React.ReactNode;
  /** 可选图标（官方 icon） */
  icon?: React.ReactNode;
  /**
   * 透传给 MenuItem 的 props（官方 menuItemProps：onClick / className / disabled 等）。
   * 破坏性项经 `type: "error"` 标红；按 HIG（pull-down-buttons）破坏性操作还需二次
   * 确认——确认浮层由消费方在 `onClick` 中串接（出现在菜单之外、可取消），
   * HIG-AUD-037。
   */
  menuItemProps?: Omit<React.ComponentProps<typeof MenuItem>, "children" | "prefix" | "suffix">;
}

/** 测量元素宽度，用于把菜单从触发按钮锚点偏移到主按钮下方 */
function useElementWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function SplitButton({
  className,
  children,
  variant = "split",
  expandCorner = "top-left",
  buttonProps,
  menuButtonLabel = "More options",
  menuButtonDisabled = false,
  menuAlignment = "bottom-start",
  menuItems,
  menuProps,
  ...props
}: SplitButtonProps) {
  const { t } = useI18n();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerWidth = useElementWidth(triggerRef);

  const isPulldown = variant === "pulldown";
  // pulldown 卡片的方向由展开角决定；split 仍用官方 menuAlignment。
  const position: MenuPosition = isPulldown
    ? EXPAND_CORNER_PROPS[expandCorner].position
    : menuAlignment;

  // start 对齐时把菜单左缘从触发按钮左缘再左移一个触发按钮宽度，
  // 使菜单锚定在主按钮下方（官方 Best Practices：默认对齐主按钮）。
  const alignOffset = position.endsWith("-end") ? 0 : -triggerWidth;

  return (
    <MenuContainer position={position}>
      <div data-slot="split-button" className={cn("flex rounded-md", className)} {...props}>
        <Button
          data-slot="split-button-main"
          {...buttonProps}
          // min-w-0：Button 的 min-w（高度×2.2）只针对独立按钮；split 两半若保留会让
          // 短文案被居中撑开，右侧文字到 chevron 的间隙远大于左侧 padding（官方两半
          // 均为内容宽 + 10px，无 min-width）。
          className={cn("rounded-r-none min-w-0", buttonProps?.className)}
        >
          {children}
        </Button>
        <MenuButton
          ref={triggerRef}
          data-slot="split-button-menu"
          variant={buttonProps?.type}
          size={buttonProps?.size}
          svgOnly
          disabled={menuButtonDisabled}
          aria-label={menuButtonLabel === "More options" ? t(menuButtonLabel) : menuButtonLabel}
          className="rounded-l-none"
        >
          <ChevronDown className="size-3.5" aria-hidden />
        </MenuButton>
      </div>
      <Menu
        alignOffset={alignOffset}
        sideOffset={isPulldown ? 6 : undefined}
        {...menuProps}
        className={cn(
          // pulldown：卡片化内边距 + 动画原点固定在锚定角，卡片向对向展开
          isPulldown && cn("p-2", EXPAND_CORNER_PROPS[expandCorner].origin),
          menuProps?.className,
        )}
      >
        {menuItems}
      </Menu>
    </MenuContainer>
  );
}

const SplitButtonMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuItem>,
  SplitButtonMenuItemProps
>(({ title, description, icon, menuItemProps }, ref) => (
  <MenuItem
    ref={ref}
    prefix={icon}
    {...menuItemProps}
    className={cn(
      // 两行条目（title + description）：MenuItem 默认固定 h-9，两行内容只剩 1px
      // 呼吸、相邻条目贴死；改为自适应高度 + 上下 6px + 行间 2px。
      // 图标 self-start + 1px 顶移对齐首行标题——items-center 会把图标吊在两行中间。
      "h-auto min-h-9 py-1.5 [&>span:first-child]:self-start [&>span:first-child]:mt-px",
      menuItemProps?.className,
    )}
  >
    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
      <span className="min-w-0 max-w-full truncate text-label-13 text-foreground">{title}</span>
      {description ? (
        <span className="min-w-0 max-w-full truncate text-label-12 text-muted-foreground">
          {description}
        </span>
      ) : null}
    </span>
  </MenuItem>
));
SplitButtonMenuItem.displayName = "SplitButtonMenuItem";

export { SplitButton, SplitButtonMenuItem };

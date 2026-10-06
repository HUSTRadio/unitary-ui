import * as React from "react";

import { cn } from "@/lib/utils";
import { useScrollTracking, type ScrollTrackingMode } from "@/lib/scroll-tracking";
import { useSlidingIndicator } from "@/lib/selection-indicator";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * Tabs — Geist 官方 Tabs 规范（docs/geist-markdown-refs/components/tabs.md 实测）。
 * 官方实测：Tab 高 50px、padding 14px 2px、400 14px/20px；tablist 无 border-b，
 * 顶部 1px 发丝线（inset shadow）+ gap 24px；选中态 2px 下边框 gray-1000 + 文字 gray-1000。
 * - 键盘（官方实测 auto activation）：ArrowRight/ArrowLeft/Home/End 移动焦点并立即激活
 *   新聚焦的 tab（禁用 tab 跳过），Enter/Space 仍可激活当前聚焦 tab
 * - variant="secondary"：24px pill，r6px，pad 0 6px，400 13px；选中 bg gray-1000/text background-100；
 *   未选中 bg gray-alpha-200；禁用 bg gray-200/text gray-900
 * - compact（所有者自有扩展，官方无此规范，与 variant 正交叠加）：tab 间距与
 *   垂直高度收半档——primary tab 间距 24→12、上下 pad 14→8（tab 高 50→38）；
 *   secondary tab 间距 8→4、pill 高 24→20。字号/图标/选中态均不变，适合密集
 *   表面（卡片头、面板内嵌 tab）
 * - 禁用 tab 配 tooltip 说明约束（官方 tabs[].tooltip 语义）
 */

type TabsVariant = "primary" | "secondary";

interface TabsTab {
  /** Title Case 标题（1–2 词，名词） */
  title: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** sentence case 约束说明（仅禁用 tab 需要） */
  tooltip?: string;
}

interface TabsProps {
  tabs: TabsTab[];
  selected: string;
  setSelected: (value: string) => void;
  /** primary（下划线）/ secondary（pill），默认 primary */
  variant?: TabsVariant;
  /** 紧凑：tab 间距与垂直高度收半档（与 variant 正交，见头注释规格） */
  compact?: boolean;
  /** 官方 API：整组禁用 */
  disabled?: boolean;
  /** tablist 无障碍标签（无可见标题时必填） */
  ariaLabel?: string;
  /** 活动项滚动跟随；默认禁用。 / Active-item scroll tracking; disabled by default. */
  scrollTracking?: ScrollTrackingMode;
  className?: string;
}

function Tabs({
  className,
  tabs,
  selected,
  setSelected,
  variant = "primary",
  compact,
  disabled,
  ariaLabel,
  scrollTracking = "disabled",
}: TabsProps) {
  return (
    <OfficialTabs
      tabs={tabs}
      selected={selected}
      setSelected={setSelected}
      variant={variant}
      compact={compact}
      disabled={disabled}
      ariaLabel={ariaLabel}
      scrollTracking={scrollTracking}
      className={className}
    />
  );
}

const tabsListClasses = (variant: TabsVariant, compact?: boolean) =>
  cn(
    "group flex flex-nowrap items-center gap-6 overflow-x-auto pb-px shadow-[0_-1px_0_var(--gray-200)_inset]",
    variant === "secondary" && "gap-2 shadow-none",
    // compact 间距收半档：primary 24→12、secondary 8→4（twMerge 覆盖上方基准 gap）
    compact && (variant === "secondary" ? "gap-1" : "gap-3"),
  );

const tabsTriggerClasses = (variant: TabsVariant, compact?: boolean) =>
  cn(
    "outline-none focus-ring",
    variant === "secondary"
      ? "flex h-6 items-center justify-center whitespace-nowrap rounded-md bg-gray-alpha-200 px-1.5 text-copy-13 text-foreground transition-colors data-[state=active]:bg-foreground data-[state=active]:text-background-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-muted-foreground"
      : "relative flex -mb-px items-center justify-center whitespace-nowrap border-b-2 border-transparent px-0.5 py-3.5 text-copy-14 text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-foreground disabled:cursor-not-allowed",
    // compact 垂直高度收半档：primary 上下 pad 14→8（tab 高 50→38）、secondary
    // pill 高 24→20（twMerge 覆盖上方基准 py/h）
    compact && (variant === "secondary" ? "h-5" : "py-2"),
  );

/** 官方 API 模式：selected/setSelected/tabs[]；auto activation 键盘语义（方向键/Home/End 移动焦点即激活，禁用跳过） */
function OfficialTabs({
  tabs,
  selected,
  setSelected,
  variant = "primary",
  compact,
  disabled,
  ariaLabel,
  scrollTracking = "disabled",
  className,
}: {
  tabs: TabsTab[];
  selected: string;
  setSelected: (value: string) => void;
  variant?: TabsVariant;
  compact?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  scrollTracking?: ScrollTrackingMode;
  className?: string;
}) {
  const [focusedIndex, setFocusedIndex] = React.useState(() =>
    Math.max(
      0,
      tabs.findIndex((tab) => tab.value === selected),
    ),
  );
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = React.useRef<HTMLDivElement>(null);
  useSlidingIndicator({ rootRef: listRef, activeKey: selected, enabled: variant === "primary" });
  useScrollTracking({
    mode: scrollTracking, activeKey: selected, rootRef: listRef,
    axis: "inline", owner: "self",
    targetSelector: '[role="tab"][aria-selected="true"]',
    precedingSelector: '[role="tab"]',
  });

  const enabledIndices = tabs
    .map((tab, index) => (disabled || tab.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const activate = (index: number) => {
    const tab = tabs[index];
    if (disabled || tab.disabled) return;
    setSelected(tab.value);
  };

  /** 移动焦点并同步激活（官方实测 auto activation：新聚焦的 tab 立即被选中） */
  const moveFocusTo = (index: number) => {
    setFocusedIndex(index);
    refs.current[index]?.focus({ preventScroll: scrollTracking === "always" });
    activate(index);
  };

  const moveFocus = (direction: 1 | -1) => {
    if (enabledIndices.length === 0) return;
    const current = enabledIndices.indexOf(focusedIndex);
    const next =
      enabledIndices[(current + direction + enabledIndices.length) % enabledIndices.length];
    moveFocusTo(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      if (enabledIndices.length > 0) moveFocusTo(enabledIndices[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      if (enabledIndices.length > 0) {
        moveFocusTo(enabledIndices[enabledIndices.length - 1]);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(focusedIndex);
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      data-slot="tabs"
      data-selection-indicator-group={variant === "primary" ? "" : undefined}
      className={cn(tabsListClasses(variant, compact), className)}
    >
      {tabs.map((tab, index) => {
        const isSelected = selected === tab.value;
        const isDisabled = disabled || tab.disabled;
        const button = (
          <button
            key={tab.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            data-state={isSelected ? "active" : "inactive"}
            aria-selected={isSelected}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            tabIndex={index === focusedIndex ? 0 : -1}
            onClick={() => activate(index)}
            onFocus={() => setFocusedIndex(index)}
            className={cn(
              tabsTriggerClasses(variant, compact),
              isDisabled && "cursor-not-allowed",
              scrollTracking !== "disabled" && "scroll-tracking-inset",
            )}
          >
            {variant === "primary" ? (
              <span
                aria-hidden
                data-selection-indicator=""
                data-slot={isSelected ? "tabs-indicator" : undefined}
                className={cn("pointer-events-none absolute -bottom-0.5 inset-x-0 h-0.5 bg-foreground", !isSelected && "invisible")}
              />
            ) : null}
            {tab.icon ? (
              <span
                aria-hidden
                className="mr-1.5 flex items-center [&_svg]:size-4 [&_svg]:shrink-0"
              >
                {tab.icon}
              </span>
            ) : null}
            {tab.title}
          </button>
        );
        if (tab.tooltip && isDisabled) {
          return (
            <Tooltip key={tab.value} text={tab.tooltip}>
              <span tabIndex={0} className="inline-flex outline-none focus-ring">
                {button}
              </span>
            </Tooltip>
          );
        }
        return button;
      })}
    </div>
  );
}

export { Tabs, type TabsProps, type TabsTab, type TabsVariant };

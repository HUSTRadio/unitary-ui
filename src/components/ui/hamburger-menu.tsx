import * as React from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { ExpandPanel, type Side } from "./expand-panel";
import { HamburgerIcon } from "./hamburger-icon";

/**
 * HamburgerMenu — 复合导航组件：HamburgerIcon(trigger) + ExpandPanel(展开容器)
 * + 内建搜索过滤状态机。
 * - anchor：触发来源场景（topbar/sidebar），决定默认展开方向映射
 * - direction："down"(→side=top) | "left" | "right"；默认 topbar→down，
 *   sidebar 场景建议显式传 "right"/"left"（对侧展开）
 * - maxExpandedHeight 默认 100dvh；maxExpandedWidth 默认 80vw
 * - content："merged"|"split"（split 面板只渲染导航、搜索入口独立——当前两态
 *   均渲染搜索+导航，split 仅加视觉分隔标注，API 先占位）
 * - 内建搜索状态机：query 非空 → 导航列表区收起（opacity-0 max-h-0 过渡 300ms）
 *   + 结果区渲染；X 清空钮还原列表（反向过渡）；Ctrl K 提示仅 pointer-fine 渲染
 * - side=down(top)：面板与 navbar 同宽共享 border-b、顶部无圆角（延伸感关键）
 */

interface MenuItem {
  label: string;
  to: string;
}

interface HamburgerMenuProps {
  /** 自定义触发图标；缺省用受控 open 的 HamburgerIcon（三叠↔叉号动画） */
  icon?: React.ReactNode;
  /** 触发来源场景 */
  anchor: "topbar" | "sidebar";
  /** 定位锚元素（topbar 场景传 navbar 根元素，面板从其底边延伸落下） */
  anchorElement?: HTMLElement | null;
  /** 展开方向；默认映射 topbar→down，sidebar 建议传对侧方向 */
  direction?: "down" | "left" | "right";
  /** 展开态最大高。@default "100dvh" */
  maxExpandedHeight?: string;
  /** 展开态最大宽。@default "80vw" */
  maxExpandedWidth?: string;
  /** 导航/搜索合并或拆分展示。@default "merged" */
  content?: "merged" | "split";
  /** 过滤数据源 */
  items?: MenuItem[];
  /** 点击结果项回调（随后关闭面板） */
  onNavigate?: (to: string) => void;
  /** 受控打开状态（不传则非受控） */
  open?: boolean;
  /** 开关回调 */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const DIRECTION_TO_SIDE: Record<"down" | "left" | "right", Side> = {
  down: "top",
  left: "left",
  right: "right",
};

function HamburgerMenu({
  icon,
  anchor,
  anchorElement,
  direction,
  maxExpandedHeight = "100dvh",
  maxExpandedWidth = "80vw",
  content = "merged",
  items,
  onNavigate,
  open,
  onOpenChange,
  className,
}: HamburgerMenuProps) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const [query, setQuery] = React.useState("");
  const searching = query.trim().length > 0;

  // 默认方向映射：topbar→down；sidebar 未显式指定时同样向下（文档建议传 right 对侧）
  const resolvedDirection = direction ?? "down";
  const side = DIRECTION_TO_SIDE[resolvedDirection];

  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const normalized = query.trim().toLowerCase();
  const results =
    items?.filter((item) => item.label.toLowerCase().includes(normalized)) ?? [];

  return (
    <>
      <button
        type="button"
        data-slot="hamburger-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setOpen(!isOpen)}
        className="inline-flex h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md p-3 text-[var(--ds-gray-1000)] outline-none hover:bg-[var(--ds-gray-alpha-200)]"
      >
        {icon ?? <HamburgerIcon open={isOpen} />}
      </button>
      <ExpandPanel
        side={side}
        open={isOpen}
        onOpenChange={setOpen}
        anchorElement={anchor === "topbar" ? (anchorElement ?? null) : null}
        maxHeight={maxExpandedHeight}
        maxWidth={maxExpandedWidth}
        aria-label={t("Menu")}
        className={cn(
          // 延伸感：side=top 时与 navbar 同宽共享 border-b、顶部无圆角
          side === "top" && "rounded-t-none",
          className,
        )}
      >
        {/* 搜索行 */}
        <div
          data-slot="menu-search"
          className="flex items-center gap-2 border-b border-gray-alpha-400 px-4 py-3"
        >
          <input
            type="text"
            role="searchbox"
            aria-label={t("Search")}
            placeholder={t("Search…")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9 flex-1 border-none bg-transparent text-copy-14 text-[var(--ds-gray-1000)] outline-none placeholder:text-[var(--ds-gray-700)]"
          />
          {searching ? (
            <button
              type="button"
              data-slot="search-clear"
              aria-label={t("Clear search")}
              onClick={() => setQuery("")}
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--ds-gray-700)] hover:bg-[var(--ds-gray-alpha-200)]"
            >
              <HamburgerIcon open size={10} />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded border border-gray-alpha-400 px-1.5 py-0.5 text-xs text-[var(--ds-gray-700)] pointer-fine:inline-block">
              {t("Ctrl K")}
            </kbd>
          )}
        </div>

        {/* split 模式视觉分隔标注（API 占位：搜索入口未来独立） */}
        {content === "split" ? (
          <div
            data-slot="content-divider"
            role="separator"
            className="mx-4 my-2 border-t border-dashed border-gray-alpha-400"
          />
        ) : null}

        {/* 导航列表区：搜索时收起（反向过渡还原） */}
        <nav data-slot="menu-nav" className="px-2 py-2">
          <ul
            data-slot="menu-list"
            className={cn(
              "list-none overflow-hidden transition-all duration-300",
              searching
                ? "pointer-events-none max-h-0 opacity-0"
                : "max-h-[60vh] opacity-100",
            )}
          >
            {(items ?? []).map((item) => (
              <li key={item.to}>
                <a
                  href={item.to}
                  onClick={() => onNavigate?.(item.to)}
                  className="block rounded-md px-3 py-2 text-copy-14 text-[var(--ds-gray-1000)] no-underline hover:bg-[var(--ds-gray-alpha-200)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 结果区：仅搜索中渲染 */}
        {searching ? (
          <ul data-slot="menu-results" className="list-none px-2 pb-2">
            {results.map((item) => (
              <li key={item.to}>
                <a
                  href={item.to}
                  data-slot="menu-result"
                  onClick={() => {
                    onNavigate?.(item.to);
                    setOpen(false);
                  }}
                  className="block rounded-md px-3 py-2 text-copy-14 text-[var(--ds-gray-1000)] no-underline hover:bg-[var(--ds-gray-alpha-200)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </ExpandPanel>
    </>
  );
}

export { HamburgerMenu };
export type { HamburgerMenuProps, MenuItem };

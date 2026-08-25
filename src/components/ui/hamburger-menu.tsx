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
 * - 内建搜索状态机：query 非空 → 导航列表区收起（opacity-0 h-0 过渡 300ms）
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
  /**
   * 面板顶边下移到 navbar 底边（仅遮蔽正文区、topbar 保持可见可交互）。
   * 仅 side=left/right 生效；需 anchorElement 提供测量源。
   */
  belowTopbar?: boolean;
  /**
   * 逐项浮现动画（stagger-in）：面板打开时前 staggerCount 个导航项依次淡入上移，
   * 非线性缓动；动画期间列表禁点，完结后恢复。滚动后看到的后续项不参与动画。
   */
  staggerIn?: boolean;
  /** 参与 stagger 动画的首屏项数（默认 8） */
  staggerCount?: number;
  /** 导航/搜索合并或拆分展示。@default "merged" */
  content?: "merged" | "split";
  /** 过滤数据源 */
  items?: MenuItem[];
  /** 当前激活路由（用于 aria-current="page" 与高亮，对齐桌面 sidebar active 态） */
  activeTo?: string;
  /** 点击结果项回调（随后关闭面板） */
  onNavigate?: (to: string) => void;
  /** 受控打开状态（不传则非受控） */
  open?: boolean;
  /** 开关回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板第一行渲染 X 关闭按钮（几何与触发前汉堡图标视口重合） */
  showCloseButton?: boolean;
  /** 不渲染内建搜索行（次宽屏：顶栏已有搜索入口，避免重复） */
  disableSearch?: boolean;
  /**
   * 搜索视图驱动方式。@default "query"
   * - "query"：query 非空即搜索（旧形态，向后兼容）
   * - "toolbar"：焦点驱动——输入框聚焦进入搜索、失焦退出（手机端）
   */
  searchMode?: "query" | "toolbar";
  /** 面板首行左侧插槽（手机端放搜索按钮） */
  toolbarLeft?: React.ReactNode;
  /** 面板首行右侧插槽（手机端放主题/语言切换） */
  toolbarRight?: React.ReactNode;
  className?: string;
}

/** ref 句柄：命令式打开搜索视图并聚焦输入框 */
interface HamburgerMenuHandle {
  openSearch: () => void;
}

const DIRECTION_TO_SIDE: Record<"down" | "left" | "right", Side> = {
  down: "top",
  left: "left",
  right: "right",
};

// stagger-in 时序（Task 5b 提速，对齐 HIG 导航转场 0.3–0.4s 口径）：
// 最后一项完成于 staggerCount*20+240 = 380ms（旧 40/320 为 600ms，-37%）
// stagger 是独立编排设计参数（非转场时长档位），保留本地不纳入 --uni-duration-* token；
// 若未来出现第二处消费，再上移至 src/lib/motion.ts（YAGNI）。
const STAGGER_INTERVAL_MS = 20;
const STAGGER_ITEM_DURATION_MS = 240;

const HamburgerMenu = React.forwardRef<HamburgerMenuHandle, HamburgerMenuProps>(function HamburgerMenu({
  icon,
  anchor,
  anchorElement,
  direction,
  maxExpandedHeight = "100dvh",
  maxExpandedWidth = "80vw",
  belowTopbar = false,
  staggerIn = false,
  staggerCount = 8,
  content = "merged",
  items,
  activeTo,
  onNavigate,
  open,
  onOpenChange,
  showCloseButton = false,
  disableSearch = false,
  searchMode = "query",
  toolbarLeft,
  toolbarRight,
  className,
}, ref) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const [query, setQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  // 搜索视图判定：旧形态（有搜索行）按 query 驱动；工具行形态（手机端）按焦点驱动
  const searching =
    searchMode === "toolbar" ? searchFocused : query.trim().length > 0;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = React.useRef(isOpen);

  // ExpandPanel uses a controlled Radix Root without Dialog.Trigger, so Radix
  // cannot infer where focus should return. Preserve the documented menu
  // contract explicitly for Escape, outside press, and close controls.
  React.useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // stagger-in：面板每次打开重播；动画进行中列表禁点，最后一项延迟结束后恢复。
  // prefers-reduced-motion 下不启用（项直接呈现）。
  const [staggerActive, setStaggerActive] = React.useState(false);
  React.useEffect(() => {
    if (!staggerIn || !isOpen) {
      setStaggerActive(false);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setStaggerActive(true);
    const total = staggerCount * STAGGER_INTERVAL_MS + STAGGER_ITEM_DURATION_MS;
    const timer = window.setTimeout(() => setStaggerActive(false), total);
    return () => window.clearTimeout(timer);
  }, [staggerIn, isOpen, staggerCount]);

  // 命令式句柄：进入搜索视图并聚焦输入框
  React.useImperativeHandle(ref, () => ({
    openSearch: () => {
      if (disableSearch) return;
      setSearchFocused(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
  }));

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
        ref={triggerRef}
        type="button"
        data-slot="hamburger-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setOpen(!isOpen)}
        className="inline-flex h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md p-3 text-[var(--uni-gray-1000)] outline-none hover:bg-[var(--uni-gray-alpha-200)]"
      >
        {icon ?? <HamburgerIcon open={isOpen} />}
      </button>
      <ExpandPanel
        side={side}
        belowTopbar={belowTopbar}
        open={isOpen}
        onOpenChange={setOpen}
        anchorElement={anchor === "topbar" ? (anchorElement ?? null) : null}
        maxHeight={maxExpandedHeight}
        maxWidth={maxExpandedWidth}
        aria-label={t("Menu")}
        className={cn(
          // 延伸感：side=top 时与 navbar 同宽共享 border-b、顶部无圆角
          side === "top" && "rounded-t-none",
          // flex column：让内层 menu-nav 的 flex-1 + min-h-0 滚动容器生效
          side !== "top" && "flex flex-col",
          className,
        )}
      >
        {/* 首行工具栏（次宽屏：X 关闭钮；手机端：搜索/主题/语言工具行） */}
        {(showCloseButton || toolbarLeft || toolbarRight) && (
          <div
            data-slot="panel-toolbar"
            className="flex h-16 items-center justify-between border-b border-gray-alpha-400 pl-0 pr-4"
          >
            <div className="flex items-center">
              {showCloseButton && (
                <button
                  type="button"
                  data-slot="panel-close"
                  aria-label={t("Close menu")}
                  onClick={() => setOpen(false)}
                  className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-[var(--uni-gray-1000)] outline-none hover:bg-[var(--uni-gray-alpha-200)]"
                >
                  <HamburgerIcon open size={16} />
                </button>
              )}
              {toolbarLeft}
            </div>
            {toolbarRight ? (
              <div className="flex items-center gap-2">{toolbarRight}</div>
            ) : null}
          </div>
        )}

        {/* 搜索行（disableSearch 时不渲染） */}
        {!disableSearch && (
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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            ref={inputRef}
            className="h-9 flex-1 border-none bg-transparent text-copy-14 text-[var(--uni-gray-1000)] outline-none placeholder:text-[var(--uni-gray-700)]"
          />
          {searching ? (
            <button
              type="button"
              data-slot="search-clear"
              aria-label={t("Clear search")}
              onClick={() => setQuery("")}
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--uni-gray-700)] hover:bg-[var(--uni-gray-alpha-200)]"
            >
              <HamburgerIcon open size={10} />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded border border-gray-alpha-400 px-1.5 py-0.5 text-xs text-[var(--uni-gray-700)] pointer-fine:inline-block">
              {t("Ctrl K")}
            </kbd>
          )}
        </div>
        )}

        {/* split 模式视觉分隔标注（API 占位：搜索入口未来独立） */}
        {content === "split" ? (
          <div
            data-slot="content-divider"
            role="separator"
            className="mx-4 my-2 border-t border-dashed border-gray-alpha-400"
          />
        ) : null}

        {/* 导航列表区：nav 是唯一滚动容器（min-h-0 flex-1 撑满剩余高度）；
            搜索时列表收起（h-0 + opacity 过渡还原）；stagger 动画期禁点 */}
        <nav
          data-slot="menu-nav"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2"
        >
          <ul
            data-slot="menu-list"
            className={cn(
              "list-none transition-opacity duration-(--uni-duration-slow)",
              searching
                ? "pointer-events-none opacity-0 h-0 overflow-hidden"
                : "opacity-100",
              staggerActive && "pointer-events-none",
            )}
          >
            {(items ?? []).map((item, index) => {
              // 仅首屏可见的前 N 项参与逐项浮现；滚动后看到的后续项直接呈现
              const staggered = staggerActive && index < staggerCount;
              return (
                <li
                  key={item.to}
                  style={
                    staggered
                      ? {
                          animation: `hamburger-stagger-in ${STAGGER_ITEM_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
                          animationDelay: `${index * STAGGER_INTERVAL_MS}ms`,
                        }
                      : undefined
                  }
                  data-staggered={staggered || undefined}
                >
                  <a
                    href={item.to}
                    aria-current={item.to === activeTo ? "page" : undefined}
                    onClick={() => onNavigate?.(item.to)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-copy-14 no-underline hover:bg-[var(--uni-gray-alpha-200)]",
                      item.to === activeTo
                        ? "bg-gray-alpha-100 font-medium text-[var(--uni-gray-1000)]"
                        : "text-[var(--uni-gray-1000)]",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
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
                  aria-current={item.to === activeTo ? "page" : undefined}
                  onClick={() => {
                    onNavigate?.(item.to);
                    setOpen(false);
                  }}
                  className={cn(
                    "block rounded-md px-3 py-2 text-copy-14 no-underline hover:bg-[var(--uni-gray-alpha-200)]",
                    item.to === activeTo
                      ? "bg-gray-alpha-100 font-medium text-[var(--uni-gray-1000)]"
                      : "text-[var(--uni-gray-1000)]",
                  )}
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
});

export { HamburgerMenu };
export type { HamburgerMenuProps, HamburgerMenuHandle, MenuItem };

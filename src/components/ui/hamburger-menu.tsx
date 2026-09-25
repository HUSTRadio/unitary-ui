import * as React from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { ExpandPanel, type Side } from "./expand-panel";
import { HamburgerIcon } from "./hamburger-icon";
import { NavStatusBadge, type NavStatusTone } from "./nav-status-badge";
import { Separator } from "./separator";
import { Spinner } from "./spinner";

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
 * - belowTopbar：面板顶边下移到 topbar 底边、topbar 保持可见可交互——此时触发按钮
 *   在打开态即是关闭控件，故面板内不再渲染 showCloseButton 指定的关闭按钮（否则
 *   两个功能相同的 X 垂直相邻，构成重复关闭入口）；toolbar 行相应左右各 16px 内边距。
 * - 触发行高 44px（HIG 触控），列表容器水平内边距 16px（与 toolbar 的 pr-4 同一栅格）
 */

/** 条目右端状态胶囊（与桌面侧栏共用 NavStatusBadge 原子）。 */
interface MenuItemBadge {
  label: string;
  tone?: NavStatusTone;
}

interface MenuItem {
  label: string;
  to: string;
  badge?: MenuItemBadge;
}

/** 分组内的二级分类条目。 */
interface MenuSubgroup {
  title: string;
  items: MenuItem[];
}

interface MenuGroup {
  title: string;
  /** 分组内全部条目（扁平）；有 subgroups 时是其顺序一致的投影，搜索始终按此扁平序匹配。 */
  items: MenuItem[];
  /** 可选的二级分类；存在时按分类渲染二级小标题。 */
  subgroups?: MenuSubgroup[];
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
  /** 分组导航数据；传入时保留小标题（含可选二级分类），并作为搜索的统一数据源 */
  groups?: MenuGroup[];
  /** 数据加载中：显示加载指示并标记导航区域忙碌。@default false */
  loading?: boolean;
  /** 无导航项或无搜索结果时的空态文案；搜索无结果默认展示查询词。 */
  emptyMessage?: React.ReactNode;
  /** 当前激活路由（用于 aria-current="page" 与高亮，对齐桌面 sidebar active 态） */
  activeTo?: string;
  /** 点击条目回调（导航列表项与搜索结果项均在随后关闭面板，HIG-AUD-017） */
  onNavigate?: (to: string) => void;
  /** 受控打开状态（不传则非受控） */
  open?: boolean;
  /** 开关回调 */
  onOpenChange?: (open: boolean) => void;
  /**
   * 面板第一行渲染 X 关闭按钮（几何与触发前汉堡图标视口重合）。
   * belowTopbar 时忽略：该模式下 topbar 保持可见可交互，触发按钮在打开态已经是
   * 关闭控件，面板内再渲染会形成两个垂直相邻、功能相同的关闭入口。
   */
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
// 若未来出现第二处消费，再上移至共享 motion 模块（YAGNI）。
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
  groups,
  loading = false,
  emptyMessage,
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

  // belowTopbar 下 topbar 可见可交互，其触发按钮打开态即关闭控件；
  // 面板内不再渲染第二个关闭入口（见 showCloseButton 契约）。
  const renderCloseButton = showCloseButton && !belowTopbar;

  const navigationGroups = groups ?? [{ title: "", items: items ?? [] }];
  const navigationItems = groups?.flatMap((group) => group.items) ?? items ?? [];
  const normalized = query.trim().toLowerCase();
  const results = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(normalized),
  );
  const emptyLabel = emptyMessage ?? (normalized
    ? t('No results found for "{query}".', { query: query.trim() })
    : t("No results found"));
  const groupIdPrefix = React.useId();
  let navigationIndex = 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-slot="hamburger-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? t("Close menu") : t("Menu")}
        onClick={() => setOpen(!isOpen)}
        className="group inline-flex size-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-md outline-none focus-ring"
      >
        <span
          data-slot="hamburger-trigger-visual"
          className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-gray-alpha-100 group-hover:text-foreground md:size-8"
        >
          {icon ?? <HamburgerIcon open={isOpen} />}
        </span>
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
        {(renderCloseButton || toolbarLeft || toolbarRight) && (
          <div
            data-slot="panel-toolbar"
            className={cn(
              "flex h-16 items-center justify-between border-b border-gray-alpha-400 pr-4",
              // 关闭按钮需与触发前汉堡图标视口重合（贴边 pl-0）；无关闭按钮时
              // 与右端 pr-4 对称，避免首个 slot 贴边
              renderCloseButton ? "pl-0" : "pl-4",
            )}
          >
            <div className="flex items-center">
              {renderCloseButton && (
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
              // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 28px 视觉
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--uni-gray-700)] hover:bg-[var(--uni-gray-alpha-200)] pointer-coarse:min-h-11 pointer-coarse:min-w-11"
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
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2"
          aria-busy={loading}
        >
          {loading ? (
            <div data-slot="menu-loading" role="status" className="flex min-h-11 items-center gap-2 px-3.5 text-style-nav-item text-gray-900">
              <Spinner aria-hidden size="md" />
              <span>{t("Loading...")}</span>
            </div>
          ) : !searching && navigationItems.length === 0 ? (
            <div data-slot="menu-empty" role="status" className="flex min-h-11 items-center px-3.5 text-style-nav-item text-gray-900">
              {emptyLabel}
            </div>
          ) : null}
          {!loading && navigationItems.length > 0 ? (
            <div
              data-slot="menu-list"
              className={cn(
                "list-none transition-opacity duration-(--uni-duration-slow)",
                searching
                  ? "pointer-events-none opacity-0 h-0 overflow-hidden"
                  : "opacity-100",
                staggerActive && "pointer-events-none",
              )}
            >
            {navigationGroups.map((group, groupIndex) => {
              const headingId = group.title
                ? `${groupIdPrefix}-group-${groupIndex}`
                : undefined;
              // stagger 索引按分组内条目的扁平顺序递增（子分类不打断首屏时序）
              const renderItems = (groupItems: MenuItem[]) => (
                <ul className="space-y-1">
                  {groupItems.map((item) => {
                    const itemIndex = navigationIndex++;
                    // 仅首屏可见的前 N 项参与逐项浮现；滚动后看到的后续项直接呈现
                    const staggered = staggerActive && itemIndex < staggerCount;
                    return (
                      <li
                        key={item.to}
                        style={
                          staggered
                            ? {
                                animation: `hamburger-stagger-in ${STAGGER_ITEM_DURATION_MS}ms var(--ease-stagger) both`,
                                animationDelay: `${itemIndex * STAGGER_INTERVAL_MS}ms`,
                              }
                            : undefined
                        }
                        data-staggered={staggered || undefined}
                      >
                        <a
                          href={item.to}
                          aria-current={item.to === activeTo ? "page" : undefined}
                          onClick={(event) => {
                            // HIG-AUD-017：导航列表项激活后必须收起面板——与搜索结果项
                            // （:466-469）一致；此前只调 onNavigate，文档站靠消费方兜底。
                            // 修饰键 / 中键 = 新标签页等原生行为，保留面板。
                            onNavigate?.(item.to);
                            if (
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            ) {
                              return;
                            }
                            setOpen(false);
                          }}
                          className={cn(
                            // 与桌面侧栏同一套视觉语言 + HIG 触控行高（44px = 最小命中区）
                            "relative flex items-center gap-2 rounded-md px-3.5 nav-item-row-touch text-style-nav-item no-underline",
                            item.to === activeTo
                              ? "bg-gray-100 font-medium text-gray-1000"
                              : "text-gray-900 hover:bg-gray-100 hover:text-gray-1000",
                          )}
                        >
                          {item.to === activeTo ? (
                            <span
                              aria-hidden
                              data-slot="menu-item-indicator"
                              className="absolute top-1/2 left-2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-900"
                            />
                          ) : null}
                          <span className="truncate ink-shift-cjk">{item.label}</span>
                          {item.badge ? (
                            <NavStatusBadge className="ml-auto" {...item.badge} />
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              );
              return (
                <section
                  key={group.title || "navigation"}
                  data-slot="menu-group"
                  aria-labelledby={headingId}
                >
                  {group.title ? (
                    <h2
                      id={headingId}
                      data-slot="menu-group-heading"
                      className="nav-space-parent flex h-8 items-center text-style-nav-heading font-semibold tracking-wide text-gray-1000"
                    >
                      <span className="truncate ink-shift-cjk">{group.title}</span>
                    </h2>
                  ) : null}
                  {group.subgroups ? (
                    // 与桌面侧栏同一节奏 token：一级标题 nav-space-parent，二级小组 40px 短分割线 + nav-space-sibling
                    <div>
                      {group.subgroups.map((subgroup, index) => (
                        <React.Fragment key={subgroup.title}>
                          {index > 0 ? (
                            <Separator
                              decorative
                              length="short"
                              data-slot="menu-subgroup-divider"
                              className="nav-space-sibling bg-gray-alpha-400"
                            />
                          ) : null}
                          <div data-slot="menu-subgroup">
                            <h3
                              data-slot="menu-subgroup-heading"
                              className="flex h-7 items-center text-style-nav-subheading font-medium text-gray-900"
                            >
                              <span className="truncate ink-shift-cjk">{subgroup.title}</span>
                            </h3>
                            {renderItems(subgroup.items)}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    renderItems(group.items)
                  )}
                </section>
              );
            })}
            </div>
          ) : null}
        </nav>

        {/* 结果区：仅搜索中渲染 */}
        {searching && !loading ? (
          <div data-slot="menu-results-region" aria-busy={loading} className="px-4 pb-2">
            {results.length === 0 ? (
              <div data-slot="menu-empty" role="status" className="flex min-h-11 items-center px-3.5 text-style-nav-item text-gray-900">
                {emptyLabel}
              </div>
            ) : (
              <ul data-slot="menu-results" className="list-none space-y-1">
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
                        // 结果项与列表项同一行几何（搜索是同一批路由的另一种呈现）
                        "relative flex items-center gap-2 rounded-md px-3.5 nav-item-row-touch text-style-nav-item no-underline",
                        item.to === activeTo
                          ? "bg-gray-100 font-medium text-gray-1000"
                          : "text-gray-900 hover:bg-gray-100 hover:text-gray-1000",
                      )}
                    >
                      {item.to === activeTo ? (
                        <span
                          aria-hidden
                          data-slot="menu-item-indicator"
                          className="absolute top-1/2 left-2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-900"
                        />
                      ) : null}
                      <span className="truncate ink-shift-cjk">{item.label}</span>
                      {item.badge ? <NavStatusBadge className="ml-auto" {...item.badge} /> : null}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </ExpandPanel>
    </>
  );
});

export { HamburgerMenu };
export type { HamburgerMenuProps, HamburgerMenuHandle, MenuGroup, MenuItem, MenuSubgroup };

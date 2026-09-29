import * as React from "react";

/**
 * 导航排版契约（NavSurface layout contract）——侧栏 `SidebarNav` 与折叠抽屉
 * `HamburgerMenu` 共用的唯一几何来源。
 *
 * 背景（用户实测 2026-09-29：次级宽屏 900px 抽屉 vs 宽屏 1280px 侧栏）：
 * 同一份导航数据在两个表面上的排版不一致——抽屉侧内缩 16px、分组之间无呼吸、
 * 行高固定 44px、分组标题不可折叠、滚动条是原生粗轨；侧栏侧内缩 24px（+ 稳定
 * 槽位）、分组之间 16px、指针行高 36px、标题可折叠、细滚动条。抽屉就是「侧栏被
 * 折叠后的形态」，换形态不该换排版，因此两处取值必须同源。
 *
 * 落点原则：数值与类名只在本模块声明一次，两个标准组件消费同一份常量；排版由
 * 组件自己拥有，docs 站点只负责宽度、边框与滚动所有权，不再特化导航样式。
 *
 * 下列几何均来自既有实测结论（见 sidebar-nav.tsx 顶部注释与
 * tests/e2e/component-geometry.spec.ts）：
 * - 内容内缩 24px（x）/ 16px（y）
 * - 条目行：rounded-md + 行高 token + text-style-nav-item；行距 space-y-1（4px）
 * - 行内缩：条目 -mx-1 px-3.5（药丸两侧各外扩 4px，文字左内缩 14px）；
 *   小标题一律不内缩，文字左缘 = 药丸左缘 → 标题永远在读层级的外侧
 * - 分组之间 16px（gap-4）；一级标题到首个二级小组 6px（nav-space-parent）
 * - 选中 = 与悬停同底色 + 强化文字 + 左侧 2×14px 主题色指示条
 */

/** 内容内缩：x 单轴（工具栏 / 结果区）与 y 单轴分开导出，便于只对齐横向。 */
export const NAV_INSET_X = "px-6";
export const NAV_INSET_Y = "py-4";
/** 导航内容标准内缩（侧栏 aside 与抽屉滚动容器共用）。 */
export const NAV_CONTENT_INSET = `${NAV_INSET_X} ${NAV_INSET_Y}`;

/** 一级分组之间的垂直节奏：分组之间呼吸更松（16px）。 */
export const NAV_GROUP_RHYTHM = "flex flex-col gap-4";

/**
 * 分组内容包裹：px-1 恰好抵消条目的 -mx-1 → 药丸左缘落在内容盒边缘；同时保证
 * 内容不横向溢出（CollapseContent 的 overflow-y:hidden 会把 overflow-x 算成 auto，
 * 越界会冒出横向滚动条）。
 */
export const NAV_GROUP_BODY_INSET = "px-1";
/** 条目行内缩契约：药丸两侧各外扩 4px、文字左内缩 14px。 */
export const NAV_ITEM_INSET = "-mx-1 px-3.5";
/** 包裹内的二级小标题：用 -mx-1 回到药丸左缘（与条目、分割线同轴）。 */
export const NAV_SUBHEADING_INSET = "-mx-1";

/** 一级小标题（静态或折叠触发器同用）：h-8 标签行，落在药丸左缘。 */
export const NAV_HEADING_BASE = `nav-space-parent flex h-8 items-center gap-2 rounded-md text-style-nav-heading font-semibold tracking-wide text-gray-1000 focus-ring`;
/** 二级小标题：与一级同字号，靠字重 + 次级色分层。 */
export const NAV_SUBHEADING_BASE = `${NAV_SUBHEADING_INSET} flex h-7 items-center text-style-nav-subheading font-medium text-gray-900`;
/**
 * 二级小组分隔契约：复用标准 `Separator`（length="short" 提供 40px），本层只补
 * 三件事——左缘与小标题同轴（-ml-1）、上下留白（nav-space-sibling）、
 * 颜色跟外壳分隔线同 token（gray-alpha-400）。
 */
export const NAV_SUBGROUP_DIVIDER = "-ml-1 nav-space-sibling bg-gray-alpha-400";

/** 条目状态：选中 = 悬停同底色 + 强化文字；未选中 = 次级文字 + 悬停反馈。 */
export const NAV_ITEM_STATE_ACTIVE = "bg-gray-100 font-medium text-gray-1000";
export const NAV_ITEM_STATE_IDLE = "text-gray-900 hover:bg-gray-100 hover:text-gray-1000";
/** 选中指示条：2×14px、垂直居中、距药丸左缘 8px、跟随主题强调色。 */
export const NAV_ITEM_INDICATOR =
  "absolute top-1/2 left-2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-theme-accent";

/**
 * 条目行高（值见 index.css 的 --uni-nav-item-height*）：
 * pointer = 36px（HIG 指针行高）/ touch = 44px（HIG 最小命中区）。
 */
export const NAV_ITEM_ROW = "nav-item-row";
export const NAV_ITEM_ROW_TOUCH = "nav-item-row-touch";
/**
 * 自适应行高：指针场景 36px、触控场景 44px —— 同一个导航在不同指针能力下
 * 保持各自正确的行几何，避免桌面鼠标环境被迫使用 44px 触控行。
 */
export const NAV_ITEM_ROW_ADAPTIVE = "nav-item-row pointer-coarse:nav-item-row-touch";

function navItemBase(row: string): string {
  return `${NAV_ITEM_INSET} ${row} relative flex items-center gap-2 rounded-md text-style-nav-item focus-ring`;
}

/** 条目基线（桌面指针行）。 */
export const NAV_ITEM_BASE = navItemBase(NAV_ITEM_ROW);
/** 条目基线（触控行，固定 44px）。 */
export const NAV_ITEM_BASE_TOUCH = navItemBase(NAV_ITEM_ROW_TOUCH);
/** 条目基线（自适应行高，见 NAV_ITEM_ROW_ADAPTIVE）。 */
export const NAV_ITEM_BASE_ADAPTIVE = navItemBase(NAV_ITEM_ROW_ADAPTIVE);

/** 分组折叠记忆的键：显式 id 优先，回退与语言无关的 label，最后回退序号。 */
export function navGroupKey(
  id: string | undefined,
  label: string,
  index: number,
): string {
  return id ?? label ?? String(index);
}

/** 折叠记忆读取：存储不可用时静默降级为「无记忆」。 */
function readCollapsedGroups(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set<string>();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return new Set<string>();
  }
}

/** 折叠记忆写入：隐私模式/配额受限时静默降级为「不记忆」。 */
function writeCollapsedGroups(key: string, collapsed: ReadonlySet<string>): void {
  try {
    window.localStorage.setItem(key, JSON.stringify([...collapsed]));
  } catch {
    // 折叠本身仍然工作，只是跨会话不记忆。
  }
}

export interface NavGroupCollapseOptions {
  /** 分组标题可点击开合；false 时不读写任何存储，标题由调用方渲染为静态标题。 */
  enabled: boolean;
  /** 折叠状态记忆键：传入后折叠结果写入 localStorage 并在下次挂载恢复。 */
  persistKey?: string;
  /** 当前页所在分组的 id：该分组永不以折叠态恢复，路由变化时自动展开。 */
  activeGroupId?: string | null;
}

export interface NavGroupCollapse {
  /** 该分组当前是否处于折叠态。 */
  isCollapsed: (id: string) => boolean;
  /** 开合回调：受控交给标准 Collapse 的 onOpenChange。 */
  setGroupOpen: (id: string, open: boolean) => void;
}

/**
 * 分组折叠状态（侧栏与抽屉共用的唯一实现）。
 * 首帧一律全展开 → 静态渲染与首帧结果确定；记忆恢复在挂载后进行，
 * 静态渲染路径不触碰存储。路由变化时展开当前页所在分组，
 * 避免「当前页被折叠藏起来」。
 */
export function useNavGroupCollapse({
  enabled,
  persistKey,
  activeGroupId = null,
}: NavGroupCollapseOptions): NavGroupCollapse {
  // 折叠的是「分组 id 集合」；首帧为空集 = 全展开。
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const [storageReady, setStorageReady] = React.useState(false);
  const [seenActiveGroupId, setSeenActiveGroupId] = React.useState<string | null>(
    activeGroupId,
  );

  // 路由变化时展开新页面所在分组：渲染期派生，避免「当前页被折叠藏起来」。
  if (seenActiveGroupId !== activeGroupId) {
    setSeenActiveGroupId(activeGroupId);
    if (activeGroupId && collapsed.has(activeGroupId)) {
      const next = new Set(collapsed);
      next.delete(activeGroupId);
      setCollapsed(next);
    }
  }

  // 记忆恢复：挂载后读取，静态渲染路径不触碰存储。
  // enabled/persistKey 变化才重读；此处只关心首次读取的 activeGroupId（闭包捕获当次值即可）。
  React.useEffect(() => {
    if (!enabled || !persistKey) return;
    const stored = readCollapsedGroups(persistKey);
    // 当前页所在分组永不以折叠态恢复
    if (activeGroupId) stored.delete(activeGroupId);
    setCollapsed(stored);
    setStorageReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, persistKey]);

  // 记忆写入：storageReady 之后才写，避免用首帧空集覆盖已存状态。
  React.useEffect(() => {
    if (!storageReady || !persistKey) return;
    writeCollapsedGroups(persistKey, collapsed);
  }, [collapsed, persistKey, storageReady]);

  const setGroupOpen = React.useCallback((id: string, nextOpen: boolean) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (nextOpen) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isCollapsed = React.useCallback(
    (id: string) => collapsed.has(id),
    [collapsed],
  );

  return { isCollapsed, setGroupOpen };
}

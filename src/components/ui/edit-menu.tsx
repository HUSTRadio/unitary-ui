import * as React from "react";
import { createPortal } from "react-dom";

import { copyTextToClipboard } from "@/lib/clipboard";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * EditMenu — Apple HIG「Edit Menus」的 Geist 化实现：文本选择后浮现的横向胶囊式编辑操作条。
 *
 * **与 ContextMenu 的区别（两种组件，勿混用）**
 * - ContextMenu：右键 / 长按触发的**竖向操作菜单**，菜单语义（role=menu），
 *   面向"对某个对象执行操作"。
 * - EditMenu：**选区驱动**的横向胶囊条（iOS 选中文字后的 Cut / Copy / Paste 胶囊），
 *   浮层锚定选区矩形（非触发器），操作对象是"当前选中的文本"，
 *   工具条语义（role=toolbar）。触发机制、形态、语义均不同，故独立实现。
 *
 * **行为要点（HIG）**
 * - 仅在容器内存在有效文本选区时浮现；选区变化 / 滚动 / 缩放 / 点击他处即隐藏。
 * - 操作按上下文可用：未提供回调的标准操作不渲染（HIG 的"只显示相关操作"）。
 * - 浮层优先显示在选区上方，上方空间不足时翻转到下方；水平方向居中于选区并 clamp 进视口。
 *
 * **定位**：项目无 floating-ui 依赖，选区定位手写（`getSelection()` + `Range.getBoundingClientRect()`
 * + fixed 定位 + portal 到 body，避免被容器 overflow 裁剪）。
 *
 * ```tsx
 * <EditMenu onCut={(text) => replaceSelection("")} onPaste={() => insertClipboard()}>
 *   <p>可选中文本…</p>
 * </EditMenu>
 * ```
 */

export type EditMenuStandardAction =
  | "cut"
  | "copy"
  | "paste"
  | "selectAll"
  | "lookUp"
  | "share";

export interface EditMenuAction {
  /** 操作标识（同时作为 React key） */
  id: string;
  /** 操作文案（胶囊为文本优先；需要时再给 icon） */
  label: React.ReactNode;
  /** 可选图标（16px 档） */
  icon?: React.ReactNode;
  /** 点击时触发，参数为当前选中文本 */
  onSelect: (selectedText: string) => void;
  disabled?: boolean;
}

export interface EditMenuProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onCopy" | "onCut" | "onPaste"> {
  /** 承载可选文本的内容（选区检测范围） */
  children: React.ReactNode;
  /** 自定义操作，追加在标准操作之后（以竖分隔线隔开） */
  actions?: readonly EditMenuAction[];
  /** 启用的标准操作与顺序（默认全开）；未提供对应回调的项不渲染 */
  standardActions?: readonly EditMenuStandardAction[];
  /** 剪切：组件复制文本后回调，实际删除由调用方执行（选区内容不受本组件控制） */
  onCut?: (text: string) => void;
  /** 复制后回调（复制动作本身由组件执行） */
  onCopy?: (text: string) => void;
  /**
   * 粘贴。组件不读取剪贴板（避免申请读权限），由调用方自行
   * `navigator.clipboard.readText()` 或写入编辑器。
   */
  onPaste?: () => void;
  /** 全选（调用方实现：选中容器内全部文本） */
  onSelectAll?: () => void;
  /** 查询（Look Up） */
  onLookUp?: (text: string) => void;
  /** 共享 */
  onShare?: (text: string) => void;
  /** 胶囊与选区的间距（px，默认 8） */
  offset?: number;
}

const DEFAULT_STANDARD_ACTIONS: readonly EditMenuStandardAction[] = [
  "cut",
  "copy",
  "paste",
  "selectAll",
  "lookUp",
  "share",
];

const DEFAULT_OFFSET = 8;
/** 视口安全边距（胶囊不贴边） */
const VIEWPORT_MARGIN = 8;

interface SelectionInfo {
  text: string;
  rect: { top: number; bottom: number; left: number; width: number };
}

interface CapsulePosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
}

function EditMenu({
  children,
  actions,
  standardActions = DEFAULT_STANDARD_ACTIONS,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onLookUp,
  onShare,
  offset = DEFAULT_OFFSET,
  className,
  ...props
}: EditMenuProps) {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const capsuleRef = React.useRef<HTMLDivElement>(null);
  const [selection, setSelection] = React.useState<SelectionInfo | null>(null);
  const [position, setPosition] = React.useState<CapsulePosition | null>(null);

  /** 读取当前选区：仅接受容器内、非空、有面积的文本选区。 */
  const readSelection = React.useCallback((): SelectionInfo | null => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return null;
    const selectionObject = window.getSelection?.();
    if (!selectionObject || selectionObject.isCollapsed || selectionObject.rangeCount === 0) {
      return null;
    }
    const text = selectionObject.toString().trim();
    if (!text) return null;
    const range = selectionObject.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return null;
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return {
      text,
      rect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width },
    };
  }, []);

  // 选区驱动：pointer 结束 / selectionchange 时刷新；滚动、缩放、点击他处时收起。
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = () => setSelection(readSelection());
    const closeIfOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && capsuleRef.current?.contains(target)) return;
      setSelection(null);
    };
    const close = () => setSelection(null);

    document.addEventListener("mouseup", sync);
    document.addEventListener("touchend", sync);
    document.addEventListener("selectionchange", sync);
    document.addEventListener("mousedown", closeIfOutside, true);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mouseup", sync);
      document.removeEventListener("touchend", sync);
      document.removeEventListener("selectionchange", sync);
      document.removeEventListener("mousedown", closeIfOutside, true);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [readSelection]);

  // 定位：优先选区上方，空间不足翻转下方；水平居中于选区并 clamp 进视口。
  React.useLayoutEffect(() => {
    const capsule = capsuleRef.current;
    if (!selection || !capsule) {
      setPosition(null);
      return;
    }
    const { width, height } = capsule.getBoundingClientRect();
    const centerX = selection.rect.left + selection.rect.width / 2;
    const placement =
      selection.rect.top >= height + offset + VIEWPORT_MARGIN ? "top" : "bottom";
    const top =
      placement === "top"
        ? selection.rect.top - offset - height
        : selection.rect.bottom + offset;
    const half = width / 2;
    const left = Math.min(
      Math.max(centerX, half + VIEWPORT_MARGIN),
      Math.max(window.innerWidth - half - VIEWPORT_MARGIN, half + VIEWPORT_MARGIN),
    );
    setPosition({ top, left, placement });
  }, [selection, offset]);

  const runAction = React.useCallback((action: () => void) => {
    action();
    setSelection(null);
  }, []);

  const items: EditMenuAction[] = React.useMemo(() => {
    if (!selection) return [];
    const text = selection.text;
    const standard: EditMenuAction[] = [];

    for (const key of standardActions) {
      switch (key) {
        case "cut":
          if (onCut) {
            standard.push({
              id: "cut",
              label: t("Cut"),
              onSelect: () => {
                void copyTextToClipboard(text).then(() => onCut(text));
              },
            });
          }
          break;
        case "copy":
          standard.push({
            id: "copy",
            label: t("Copy"),
            onSelect: () => {
              void copyTextToClipboard(text).then(() => onCopy?.(text));
            },
          });
          break;
        case "paste":
          if (onPaste) {
            standard.push({ id: "paste", label: t("Paste"), onSelect: () => onPaste() });
          }
          break;
        case "selectAll":
          if (onSelectAll) {
            standard.push({ id: "selectAll", label: t("Select All"), onSelect: () => onSelectAll() });
          }
          break;
        case "lookUp":
          if (onLookUp) {
            standard.push({ id: "lookUp", label: t("Look Up"), onSelect: () => onLookUp(text) });
          }
          break;
        case "share":
          if (onShare) {
            standard.push({ id: "share", label: t("Share"), onSelect: () => onShare(text) });
          }
          break;
      }
    }

    return actions ? [...standard, ...actions] : standard;
  }, [selection, standardActions, actions, onCut, onCopy, onPaste, onSelectAll, onLookUp, onShare, t]);

  const capsule =
    selection && items.length > 0 ? (
      <div
        ref={capsuleRef}
        role="toolbar"
        aria-label={t("Edit menu")}
        data-slot="edit-menu-capsule"
        data-placement={position?.placement}
        // mousedown 阻止默认：点击胶囊不清除当前选区（否则 click 前选区已消失）
        onMouseDown={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setSelection(null);
          }
        }}
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          transform: "translate(-50%, 0)",
        }}
        className={cn(
          "flex max-w-[calc(100vw-16px)] items-center gap-0.5 overflow-x-auto rounded-full bg-[var(--color-bg-elevated)] p-1 shadow-[var(--material-shadow-menu)]",
          "z-[var(--uni-z-popover)] animate-in fade-in-0 zoom-in-95 duration-(--uni-duration-fast) motion-reduce:animate-none",
          // 首帧尚未测量时先隐藏，layout effect 在绘制前完成定位，避免位置跳变
          !position && "opacity-0",
        )}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {actions && index === items.length - actions.length && index !== 0 ? (
              <span aria-hidden className="mx-0.5 h-4 w-px shrink-0 bg-gray-alpha-400" />
            ) : null}
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => runAction(() => item.onSelect(selection.text))}
              className={cn(
                "flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-label-13 text-gray-1000 outline-none transition-colors",
                "hover:bg-gray-alpha-100 focus-visible:bg-gray-alpha-100",
                "disabled:pointer-events-none disabled:text-gray-700",
              )}
            >
              {item.icon ? (
                <span aria-hidden className="inline-flex size-4 items-center justify-center">
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    ) : null;

  return (
    <div ref={containerRef} data-slot="edit-menu" className={className} {...props}>
      {children}
      {typeof document !== "undefined" && capsule ? createPortal(capsule, document.body) : null}
    </div>
  );
}

export { EditMenu };

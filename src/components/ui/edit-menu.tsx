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
/** 退场驻留时长：与胶囊 class 的 duration-(--uni-duration-fast)（150ms）保持一致 */
const CAPSULE_EXIT_MS = 150;

interface SelectionInfo {
  text: string;
  rect: { top: number; bottom: number; left: number; width: number };
}

interface CapsulePosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
}

/**
 * 选区指纹：用于识别「同一个选区」。
 * 关闭胶囊并不会清空用户的选区，而**元素获得焦点本身也会触发一次 `selectionchange`**
 * （浏览器与 jsdom 皆然，且是异步排队的）。若不做识别，关闭时归还焦点触发的这次同步
 * 会读到「仍然存在」的旧选区，把刚关掉的胶囊重新唤起。
 */
function selectionSignature(selection: SelectionInfo): string {
  const { text, rect } = selection;
  return [text, rect.top, rect.left, rect.width, rect.bottom].map((part) => String(part)).join("|");
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
  // 展示用选区：选区塌陷后驻留一个动画时长再卸载（Apple 对称过渡——有入必有出）。
  // 直接条件渲染会在选区塌陷瞬间卸载节点，退场动画无从播放。
  const [displaySelection, setDisplaySelection] = React.useState<SelectionInfo | null>(null);
  const [exiting, setExiting] = React.useState(false);
  const exitTimerRef = React.useRef<number | null>(null);
  const [position, setPosition] = React.useState<CapsulePosition | null>(null);
  // HIG-AUD-004：toolbar 的 roving tabindex —— 同一时刻只有一个项进入 Tab 序列。
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  /** 打开胶囊时的选区 Range：焦点移入胶囊后可能被浏览器清空，用它还原。 */
  const savedRangeRef = React.useRef<Range | null>(null);
  /** 打开胶囊前的焦点元素：关闭时归还焦点。 */
  const focusReturnRef = React.useRef<HTMLElement | null>(null);
  /** 本次浮现是否由指针操作触发（指针场景不抢焦点，避免打断鼠标/触控操作）。 */
  const pointerOpenedRef = React.useRef(false);
  /**
   * 已被关闭的选区指纹。关闭胶囊不会清空选区，同一段选区不应再次唤起胶囊；
   * 只有在选区真的变化、或用户重新开始一次交互后才允许再次浮现。
   */
  const dismissedSignatureRef = React.useRef<string | null>(null);

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
    // 记录 Range 以便焦点移入胶囊后还原选区（HIG-AUD-004）
    savedRangeRef.current = range;
    return {
      text,
      rect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width },
    };
  }, []);

  /**
   * 还原已记录的选区。焦点移入胶囊（`role="toolbar"`）后浏览器可能清空选区，
   * 导致胶囊随即被「选区塌陷」逻辑收起；用打开时记录的 Range 还原即可保持选中态。
   * 非标准 Range 实现（如测试桩）缺 `addRange` 时静默跳过。
   */
  const restoreSelection = React.useCallback(() => {
    const range = savedRangeRef.current;
    if (!range || typeof window === "undefined") return;
    const selectionObject = window.getSelection?.();
    if (
      !selectionObject ||
      typeof selectionObject.removeAllRanges !== "function" ||
      typeof selectionObject.addRange !== "function"
    ) {
      return;
    }
    try {
      selectionObject.removeAllRanges();
      selectionObject.addRange(range);
    } catch {
      // 选区已失效（DOM 变更）：忽略，胶囊会按常规逻辑收起
    }
  }, []);

  // 选区驱动：pointer 结束 / selectionchange 时刷新；滚动、缩放、点击他处时收起。
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = () => {
      const next = readSelection();
      // 刚被关闭的同一段选区不再唤起（见 dismissedSignatureRef）。
      if (next && dismissedSignatureRef.current === selectionSignature(next)) return;
      setSelection(next);
    };
    const closeIfOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && capsuleRef.current?.contains(target)) return;
      setSelection(null);
    };
    const close = () => setSelection(null);
    // HIG-AUD-004：区分「指针产生选区」与「键盘产生选区」，只有后者抢焦点；
    // 同时，新的交互开始意味着「已关闭的同名选区」不再被记住——即使重新选中
    // 一模一样的一段文字，也应当再次浮现。
    const handlePointerStart = () => {
      pointerOpenedRef.current = true;
      dismissedSignatureRef.current = null;
    };
    const handleKeyStart = () => {
      pointerOpenedRef.current = false;
      dismissedSignatureRef.current = null;
    };

    document.addEventListener("mouseup", sync);
    document.addEventListener("touchend", sync);
    document.addEventListener("selectionchange", sync);
    document.addEventListener("mousedown", closeIfOutside, true);
    document.addEventListener("mousedown", handlePointerStart, true);
    document.addEventListener("pointerdown", handlePointerStart, true);
    document.addEventListener("touchstart", handlePointerStart, true);
    document.addEventListener("keydown", handleKeyStart, true);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mouseup", sync);
      document.removeEventListener("touchend", sync);
      document.removeEventListener("selectionchange", sync);
      document.removeEventListener("mousedown", closeIfOutside, true);
      document.removeEventListener("mousedown", handlePointerStart, true);
      document.removeEventListener("pointerdown", handlePointerStart, true);
      document.removeEventListener("touchstart", handlePointerStart, true);
      document.removeEventListener("keydown", handleKeyStart, true);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [readSelection]);

  // 选区出现即同步展示；选区塌陷则先播放退场动画，再于一个时长后卸载。
  // 计时器存 ref 并在「选区重新出现」时清除，避免退场中途重新选中导致误卸载。
  React.useLayoutEffect(() => {
    if (selection) {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      dismissedSignatureRef.current = null;
      setDisplaySelection(selection);
      setExiting(false);
      return;
    }
    if (!displaySelection) return;
    // 关闭的唯一收口处：记住被关闭的选区，避免同一段选区在 selectionchange
    // 回弹（归还焦点、浏览器重放）时把胶囊重新唤起。
    dismissedSignatureRef.current = selectionSignature(displaySelection);
    setExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      setDisplaySelection(null);
      setExiting(false);
      // HIG-AUD-004：关闭后把焦点归还给打开胶囊前的元素（如产生选区的输入框）。
      const target = focusReturnRef.current;
      focusReturnRef.current = null;
      if (target && target.isConnected) target.focus();
    }, CAPSULE_EXIT_MS);
  }, [selection, displaySelection]);

  React.useEffect(
    () => () => {
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    },
    [],
  );

  // 定位：优先选区上方，空间不足翻转下方；水平居中于选区并 clamp 进视口。
  React.useLayoutEffect(() => {
    const capsule = capsuleRef.current;
    if (!displaySelection || !capsule) {
      setPosition(null);
      return;
    }
    // 用 offsetWidth/offsetHeight 而非 getBoundingClientRect()：入场动画 `zoom-in-95`
    // 在测量时已把缩放应用到渲染结果上，rect 量到的是 0.95 倍的 34.2px，
    // 会让胶囊与选区的实际间距比 offset 小 1.8px。offset* 取的是不受 transform
    // 影响的布局盒尺寸，与动画结束后的真实尺寸一致。
    const width = capsule.offsetWidth;
    const height = capsule.offsetHeight;
    const centerX = displaySelection.rect.left + displaySelection.rect.width / 2;
    const placement =
      displaySelection.rect.top >= height + offset + VIEWPORT_MARGIN ? "top" : "bottom";
    const top =
      placement === "top"
        ? displaySelection.rect.top - offset - height
        : displaySelection.rect.bottom + offset;
    const half = width / 2;
    const left = Math.min(
      Math.max(centerX, half + VIEWPORT_MARGIN),
      Math.max(window.innerWidth - half - VIEWPORT_MARGIN, half + VIEWPORT_MARGIN),
    );
    setPosition({ top, left, placement });
  }, [displaySelection, offset]);

  const runAction = React.useCallback((action: () => void) => {
    action();
    setSelection(null);
  }, []);

  const items: EditMenuAction[] = React.useMemo(() => {
    if (!displaySelection) return [];
    const text = displaySelection.text;
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
  }, [displaySelection, standardActions, actions, onCut, onCopy, onPaste, onSelectAll, onLookUp, onShare, t]);

  /** HIG-AUD-004：roving tabindex 的落点，越界时收敛到末项。 */
  const rovingIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));

  // HIG-AUD-004：胶囊浮现时把焦点移入首个可用项（仅键盘产生选区时），
  // 让键盘用户无需「碰运气」在 DOM 末尾找 portal 出来的工具条。
  React.useLayoutEffect(() => {
    const capsuleElement = capsuleRef.current;
    if (!displaySelection || exiting || !capsuleElement) return;
    // 指针选择场景不抢焦点：用户仍在用鼠标/触控操作，抢焦会打断操作。
    if (pointerOpenedRef.current) return;
    if (capsuleElement.contains(document.activeElement)) return;
    const first = capsuleElement.querySelector<HTMLButtonElement>("button:not(:disabled)");
    if (!first) return;
    focusReturnRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(0);
    first.focus();
    // 焦点移入胶囊可能清空浏览器选区；立刻还原，避免被「选区已消失」逻辑误收起。
    restoreSelection();
  }, [displaySelection, exiting, items.length, restoreSelection]);

  // HIG-AUD-004：Escape 不再依赖「胶囊先获得焦点」——键盘用户在胶囊未获焦时
  // 也需要能关闭它（原实现只把 Escape 挂在胶囊自身的 onKeyDown 上，形同虚设）。
  React.useEffect(() => {
    if (!displaySelection || exiting) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setSelection(null);
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [displaySelection, exiting]);

  const capsule =
    displaySelection && items.length > 0 ? (
      <div
        ref={capsuleRef}
        role="toolbar"
        aria-label={t("Edit menu")}
        data-slot="edit-menu-capsule"
        data-placement={position?.placement}
        data-exiting={exiting ? "" : undefined}
        // mousedown 阻止默认：点击胶囊不清除当前选区（否则 click 前选区已消失）
        onMouseDown={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setSelection(null);
            return;
          }
          // HIG-AUD-004：toolbar 的 APG 键盘模型——方向键在项间循环移动，Home/End 跳首尾。
          if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft" &&
            event.key !== "Home" &&
            event.key !== "End"
          ) {
            return;
          }
          const buttons = itemRefs.current.filter(
            (button): button is HTMLButtonElement => Boolean(button) && !button!.disabled,
          );
          if (buttons.length === 0) return;
          event.preventDefault();
          const currentPosition = buttons.indexOf(document.activeElement as HTMLButtonElement);
          let nextPosition: number;
          if (event.key === "Home") {
            nextPosition = 0;
          } else if (event.key === "End") {
            nextPosition = buttons.length - 1;
          } else {
            const delta = event.key === "ArrowRight" ? 1 : -1;
            const base = currentPosition === -1 ? 0 : currentPosition;
            nextPosition = (base + delta + buttons.length) % buttons.length;
          }
          const nextButton = buttons[nextPosition];
          if (!nextButton) return;
          setActiveIndex(itemRefs.current.indexOf(nextButton));
          nextButton.focus();
          restoreSelection();
        }}
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          transform: "translate(-50%, 0)",
        }}
        className={cn(
          "flex max-w-[calc(100vw-16px)] items-center gap-0.5 overflow-x-auto rounded-full bg-[var(--color-bg-elevated)] p-1 shadow-[var(--material-shadow-menu)]",
          "z-[var(--uni-z-popover)] duration-(--uni-duration-fast) motion-reduce:animate-none!",
          exiting
            ? "animate-out fade-out-0 zoom-out-95 pointer-events-none"
            : "animate-in fade-in-0 zoom-in-95",
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
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              tabIndex={index === rovingIndex ? 0 : -1}
              disabled={item.disabled}
              onFocus={() => setActiveIndex(index)}
              onClick={() => runAction(() => item.onSelect(displaySelection.text))}
              className={cn(
                // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 28px 胶囊
                "flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-label-13 text-gray-1000 outline-none transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11",
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

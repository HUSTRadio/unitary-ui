import * as React from "react";
import { createPortal } from "react-dom";

import { copyTextToClipboard } from "@/lib/clipboard";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * EditMenu — 选区驱动的横向胶囊编辑工具条，适用于触屏、鼠标和键盘选区。
 *
 * **与 ContextMenu 的区别（两种组件，勿混用）**
 * - ContextMenu：右键 / 长按触发的**竖向操作菜单**，菜单语义（role=menu），
 *   面向"对某个对象执行操作"。
 * - EditMenu：**选区驱动**，浮层锚定文本选区矩形（非触发器）；始终使用
 *   role=toolbar 的横向胶囊，操作对象是"当前选中的文本"，而非右键触发的对象。
 *
 * **行为要点（HIG）**
 * - 仅在容器内存在有效文本选区时浮现；选区变化 / 滚动 / 缩放 / 点击他处即隐藏。
 * - 操作按上下文可用：未提供回调的标准操作不渲染（HIG 的"只显示相关操作"）。
 * - 浮层优先显示在选区上方，上方空间不足时翻转到下方；垂直与水平方向都 clamp 进视口。
 * - 触屏（HIG-AUD-020）：手势结束后的合成 `mousedown` 不会误关胶囊；容器内抑制 iOS 原生
 *   callout 与原生上下文菜单（消费方传入自己的 `onContextMenu` 即可让位）。
 * - 剪贴板（HIG-AUD-021）：写入的是选区**原文**（含首尾空白）；写入失败时不触发
 *   `onCut` / `onCopy`，改为 `onError`，由调用方给出可见反馈。
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
  /**
   * 点击时触发。
   * @param selectedText 选中文本（**已 trim**，适合长度统计、查询等）
   * @param rawText 选区**原文**（保留首尾空白）；剪切、替换等「原样处理选区」的操作
   *   必须用它，否则处理结果与用户可见选区不一致（HIG-AUD-021）
   */
  onSelect: (selectedText: string, rawText: string) => void;
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
  /**
   * 剪切：组件把选区**原文**写入剪贴板后回调，实际删除由调用方执行
   * （选区内容不受本组件控制）。第二个参数是选区原文，删除时必须用它。
   * 剪贴板写入失败时**不会**回调（HIG-AUD-021：避免调用方据此删除内容造成数据丢失），
   * 失败改由 `onError` 上报。
   */
  onCut?: (text: string, rawText: string) => void;
  /**
   * 复制后回调（复制动作本身由组件执行，写入剪贴板的是选区原文）。
   * 剪贴板写入失败时**不会**回调，改由 `onError` 上报。
   */
  onCopy?: (text: string, rawText: string) => void;
  /**
   * 粘贴。组件不读取剪贴板（避免申请读权限），由调用方自行
   * `navigator.clipboard.readText()` 或写入编辑器。
   */
  onPaste?: () => void;
  /** 全选（调用方实现：选中容器内全部文本） */
  onSelectAll?: () => void;
  /** 查询（Look Up）：参数为选中文本与选区原文 */
  onLookUp?: (text: string, rawText: string) => void;
  /** 共享：参数为选中文本与选区原文 */
  onShare?: (text: string, rawText: string) => void;
  /**
   * 剪贴板写入失败回调（参数为原始错误对象）。
   *
   * 组件不自行渲染错误 UI——**可见反馈由调用方给出**（如 toast / 行内提示）。
   * 契约：写入失败时 `onCut` / `onCopy` 一律不触发，保证调用方不会在未复制成功时
   * 删除内容（HIG-AUD-021）。
   */
  onError?: (error: unknown) => void;
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
  /** 选中文本（已 trim，供长度统计 / 查询使用） */
  text: string;
  /** 选区原文（含首尾空白，供原样剪切 / 替换使用；HIG-AUD-021） */
  rawText: string;
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
  onError,
  offset = DEFAULT_OFFSET,
  className,
  onContextMenu,
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
    const rawText = selectionObject.toString();
    const text = rawText.trim();
    if (!text) return null;
    const range = selectionObject.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return null;
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    // 记录 Range 以便焦点移入胶囊后还原选区（HIG-AUD-004）
    savedRangeRef.current = range;
    // text 已 trim（长度统计 / 查询语义不变），rawText 保留首尾空白供原样操作（HIG-AUD-021）
    return {
      text,
      rawText,
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
    /**
     * HIG-AUD-020：触屏手势结束后浏览器会补发一次**合成 mousedown**（compat mouse
     * event），其 target 是手指落点——必然在容器内、不在胶囊内。原实现「不在胶囊内即关闭」
     * 于是把 `touchend` 刚浮现的胶囊立刻收掉（一闪即隐）。
     *
     * 判据（按可靠性排序）：
     * 1. `sourceCapabilities.firesTouchEvents`——规范的「由触摸合成」判据（Chromium）；
     * 2. 触屏手势结束后的短窗口——覆盖不实现 (1) 的引擎（Safari / Firefox）。
     *
     * 注意：合成 mousedown 的 `isTrusted` 是 `true`，**不能**用它过滤。
     */
    const SYNTHETIC_MOUSE_WINDOW_MS = 1000;
    let touchEndedAt: number | null = null;
    const markTouchEnd = () => {
      touchEndedAt = Date.now();
    };
    const consumeSyntheticMouse = (event: MouseEvent) => {
      const capabilities = (
        event as MouseEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } | null }
      ).sourceCapabilities;
      const synthesizedFromTouch =
        capabilities?.firesTouchEvents === true ||
        (touchEndedAt !== null && Date.now() - touchEndedAt <= SYNTHETIC_MOUSE_WINDOW_MS);
      // 窗口只覆盖紧随手势的那一次事件，避免吞掉后续真实鼠标交互。
      touchEndedAt = null;
      return synthesizedFromTouch;
    };
    const closeIfOutside = (event: MouseEvent) => {
      if (consumeSyntheticMouse(event)) return;
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
    // 先记录手势结束时刻，再同步选区：紧随其后的合成 mousedown 需要被识别（见上）。
    document.addEventListener("touchend", markTouchEnd, true);
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
      document.removeEventListener("touchend", markTouchEnd, true);
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
    // 上方分支的可用空间由 placement 判定保证（top ≥ VIEWPORT_MARGIN）。
    // 下方分支必须自行 clamp：选区贴近视口底部时 `rect.bottom + offset` 会把胶囊顶出下沿
    // （HIG-AUD-021；`VIEWPORT_MARGIN` 原先只参与上方判定与水平 clamp）。
    const top =
      placement === "top"
        ? displaySelection.rect.top - offset - height
        : Math.max(
            VIEWPORT_MARGIN,
            Math.min(
              displaySelection.rect.bottom + offset,
              window.innerHeight - height - VIEWPORT_MARGIN,
            ),
          );
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

  /**
   * 复制 / 剪切的标准动作：**成功写入剪贴板后**才回调。
   *
   * HIG-AUD-021：原实现 `void copyTextToClipboard(text).then(() => onCut(text))` 无 `catch`，
   * 写入失败时 `onCut` 仍被调用，调用方据此删除选中内容即造成**数据丢失**。
   * 现在失败一律走 `onError`（可见反馈由调用方给出），`onCut` / `onCopy` 不触发。
   * 写入的是选区原文（`rawText`），与系统原生复制的行为一致。
   */
  const writeClipboardThen = React.useCallback(
    (rawText: string, after: () => void) => {
      void copyTextToClipboard(rawText)
        .then(after)
        .catch((error: unknown) => {
          onError?.(error);
        });
    },
    [onError],
  );

  const items: EditMenuAction[] = React.useMemo(() => {
    if (!displaySelection) return [];
    const text = displaySelection.text;
    const rawText = displaySelection.rawText;
    const standard: EditMenuAction[] = [];

    for (const key of standardActions) {
      switch (key) {
        case "cut":
          if (onCut) {
            standard.push({
              id: "cut",
              label: t("Cut"),
              onSelect: () => {
                writeClipboardThen(rawText, () => onCut(text, rawText));
              },
            });
          }
          break;
        case "copy":
          standard.push({
            id: "copy",
            label: t("Copy"),
            onSelect: () => {
              writeClipboardThen(rawText, () => onCopy?.(text, rawText));
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
            standard.push({
              id: "lookUp",
              label: t("Look Up"),
              onSelect: () => onLookUp(text, rawText),
            });
          }
          break;
        case "share":
          if (onShare) {
            standard.push({ id: "share", label: t("Share"), onSelect: () => onShare(text, rawText) });
          }
          break;
      }
    }

    return actions ? [...standard, ...actions] : standard;
  }, [
    displaySelection,
    standardActions,
    actions,
    onCut,
    onCopy,
    onPaste,
    onSelectAll,
    onLookUp,
    onShare,
    writeClipboardThen,
    t,
  ]);

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
        aria-orientation="horizontal"
        aria-label={t("Edit menu")}
        data-slot="edit-menu-capsule"
        data-presentation="capsule"
        data-placement={position?.placement}
        data-exiting={exiting ? "" : undefined}
        // mousedown 阻止默认：点击胶囊不清除当前选区（否则 click 前选区已消失）
        onMouseDown={(event) => event.preventDefault()}
        // HIG-AUD-020：长按胶囊不应弹出原生 callout / 上下文菜单（胶囊自带全部操作）
        onContextMenu={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setSelection(null);
            return;
          }
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
          // touch-manipulation：胶囊是按钮组，去掉双击缩放判定带来的点击延迟
          // （页面级滚动/缩放不受影响——容器不加 touch-action，见 HIG-AUD-020 台账）
          // -webkit-touch-callout：长按胶囊同样不弹出原生 callout
          "flex max-w-[calc(100vw-16px)] items-center gap-0.5 overflow-x-auto rounded-full touch-manipulation [-webkit-touch-callout:none] bg-[var(--color-bg-elevated)] p-1 shadow-[var(--material-shadow-menu)]",
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
              <span
                role="separator"
                aria-orientation="vertical"
                className="mx-0.5 h-4 w-px shrink-0 bg-gray-alpha-400"
              />
            ) : null}
            <button
              type="button"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              tabIndex={index === rovingIndex ? 0 : -1}
              disabled={item.disabled}
              onFocus={() => setActiveIndex(index)}
              onClick={() =>
                runAction(() => item.onSelect(displaySelection.text, displaySelection.rawText))
              }
              className={cn(
                // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 28px 胶囊
                "flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 whitespace-nowrap text-label-13 text-gray-1000 outline-none transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11",
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
    <div
      ref={containerRef}
      data-slot="edit-menu"
      // HIG-AUD-020：选区容器内长按会**同时**弹出 iOS 原生 callout（WebKit 私有属性，
      // 继承到子树）与 Android 原生上下文菜单，与胶囊重叠。callout 走 Tailwind 任意属性
      // 类（Blink / jsdom 都会丢弃该属性的计算值，类名与编译后的样式规则才是可核对的证据）；
      // 原生上下文菜单只在调用方未自行处理 `onContextMenu` 时抑制——需要容器内嵌
      // ContextMenu（右键菜单）的消费方传入自己的 handler 即可让位。
      // 不声明 `touch-action`：容器是页面内容区，必须保留原生滚动与缩放手势。
      className={cn("[-webkit-touch-callout:none]", className)}
      onContextMenu={
        onContextMenu ??
        ((event) => {
          event.preventDefault();
        })
      }
      {...props}
    >
      {children}
      {typeof document !== "undefined" && capsule ? createPortal(capsule, document.body) : null}
    </div>
  );
}

export { EditMenu };

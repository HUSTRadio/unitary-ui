/**
 * 可见视口（visual viewport）的统一契约 —— HIG-AUD-029。
 *
 * 移动端**软键盘弹起**与**双指缩放**改变的是视觉视口：`window.visualViewport`
 * 的 `width` / `height` / `offsetTop` 会变，而布局视口（`window.innerWidth` /
 * `innerHeight`）往往**不变**，`window` 也不一定派发 `resize`。
 * 只监听 `window` 的浮层因此在键盘弹起后停在旧位置（实测：编辑胶囊无任何反应）。
 *
 * 这里把「读取可见视口边界」与「订阅可见视口变化」收敛到一处，
 * 供定位类浮层共用，避免各组件各写一套监听（HIG-AUD-029 的统一响应式契约）。
 *
 * 注意：`visualViewport` 在 jsdom 中不存在，离线渲染时回退到 `window.inner*`，
 * 因此本模块对 SSR / 单测环境安全。
 */

export interface VisibleViewport {
  /** 可见区域左缘（视口坐标；双指缩放平移后不为 0）。 */
  left: number;
  /** 可见区域上缘（视口坐标；软键盘弹起时通常不为 0）。 */
  top: number;
  /** 可见区域右缘（`left + width`）。 */
  right: number;
  /** 可见区域下缘（`top + height`）。 */
  bottom: number;
  width: number;
  height: number;
}

/** 读取当前可见视口边界；无 `visualViewport` 时回退到布局视口。 */
export function getVisibleViewport(): VisibleViewport {
  if (typeof window === "undefined") {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }
  const viewport = window.visualViewport;
  const left = viewport?.offsetLeft ?? 0;
  const top = viewport?.offsetTop ?? 0;
  const width = viewport?.width ?? window.innerWidth;
  const height = viewport?.height ?? window.innerHeight;
  return { left, top, right: left + width, bottom: top + height, width, height };
}

/**
 * 订阅**任何会移动可见视口的变化**：布局视口的 `resize`、页面滚动
 * （捕获阶段，覆盖内部滚动容器），以及视觉视口的 `resize` / `scroll`。
 *
 * 返回取消订阅函数。回调可能在同一帧内被多次触发，需要高频重算的调用方
 * 应自行用 `requestAnimationFrame` 合帧。
 */
export function subscribeToVisualViewport(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("resize", onChange);
  window.addEventListener("scroll", onChange, true);
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", onChange);
  viewport?.addEventListener("scroll", onChange);

  return () => {
    window.removeEventListener("resize", onChange);
    window.removeEventListener("scroll", onChange, true);
    viewport?.removeEventListener("resize", onChange);
    viewport?.removeEventListener("scroll", onChange);
  };
}

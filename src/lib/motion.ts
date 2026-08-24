/**
 * 动画时长单一事实源（JS 侧）。CSS 对应 token 见 src/styles/index.css @theme static
 * 的 --ds-duration-fast/base/slow/slower，两处必须同步修改（注释互指）。
 * 档位口径 = Apple HIG：微交互 / 标准过渡 / 内容切换 / 大面积位移。
 */
export const DURATION_FAST_MS = 150;
export const DURATION_BASE_MS = 200;
export const DURATION_SLOW_MS = 300;
export const DURATION_SLOWER_MS = 500;

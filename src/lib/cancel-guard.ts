/**
 * Cancelled-Action Contract（框架约定，见文档站「状态与事件」）：
 * 点击类组件先调用用户的 handler，再据此决定是否执行后续动作。
 * handler 内调用 event.preventDefault() 即取消。
 * 仅用于「点击触发一个明确后续动作」的组件（复制、跳转确认等）；
 * open/close 状态切换走 Radix 自带取消机制，不适用本契约。
 */
export function callWithCancelGuard<E extends { defaultPrevented: boolean }>(
  event: E,
  handler: ((event: E) => void) | undefined,
): boolean {
  handler?.(event);
  return !event.defaultPrevented;
}

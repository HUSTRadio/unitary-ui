import * as React from "react";

/**
 * HIG-AUD-017：可供浮层 / 面板消费的「导航发生即收起」原语。
 *
 * 刻意不耦合任何路由库（组件库不能假设消费方用 react-router / next / 自研路由），
 * 而是监听两种全局信号：
 * - `hashchange`：hash 路由的 push/replace（本仓库文档站即此模式）；
 * - `popstate`：浏览器前进 / 后退。
 *
 * 覆盖两类靠「点击回调」拦不住的场景：① 浮层打开时用户点了浮层外的链接导航；
 * ② 前进 / 后退或程序化 navigate。
 *
 * 库内浮层默认**不**自动关闭（保持既有行为，AGENTS.md：除非任务要求否则不改运行时行为），
 * 由消费方显式接入；文档站的落点见 `docs/site/src/components/docs-shell.tsx`。
 *
 * @param onDismiss 导航发生时调用；始终取最新闭包（内部用 ref 转发）
 * @param enabled 传 false 时完全不解绑订阅（条件挂载用）
 */
export function useDismissOnNavigate(onDismiss: () => void, enabled = true): void {
  const latest = React.useRef(onDismiss);

  React.useEffect(() => {
    latest.current = onDismiss;
  }, [onDismiss]);

  React.useEffect(() => {
    if (!enabled) return;
    const dismiss = () => latest.current();
    window.addEventListener("hashchange", dismiss);
    window.addEventListener("popstate", dismiss);
    return () => {
      window.removeEventListener("hashchange", dismiss);
      window.removeEventListener("popstate", dismiss);
    };
  }, [enabled]);
}

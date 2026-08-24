import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ErrorBoundary — React 错误边界（工程审查 2026-08-24 P1：项目此前零错误边界，
 * 任一组件渲染抛错会卸载整棵树导致白屏）。
 *
 * 双层边界策略：
 * - App 根一层：兜底未预料崩溃，整页错误卡 + 刷新/重试；
 * - docs 站每个页面/分区一层：单个 demo 崩溃只显示该分区占位，其余内容继续可用。
 *
 * 仅捕获渲染期异常（React class boundary 语义）；事件处理器、异步回调、
 * SSR 错误不在此列（官方文档明确边界外场景）。
 * resetKeys 变化（如路由切换）时自动重置错误态重试渲染。
 */

interface ErrorBoundaryProps {
  /** 崩溃占位 UI；缺省用内置最小样式（不依赖任何业务 token，保证自身永不崩） */
  fallback?: React.ReactNode;
  /** 这些 key 变化时自动清除错误态（如 pathname / 分区 id），触发重新渲染 */
  resetKeys?: unknown[];
  /** 错误上报钩子（可选）；生产可接监控 */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** 边界名称，便于日志定位 */
  name?: string;
  className?: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 控制台保留完整堆栈便于开发调试；生产由 onError 决定上报
    console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ""}]`, error, info);
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // resetKeys 任一变化即自动恢复（浅比较）
    if (!this.state.error) return;
    const prev = prevProps.resetKeys;
    const next = this.props.resetKeys;
    if (
      prev?.length !== next?.length ||
      (next && next.some((key, index) => !Object.is(key, prev?.[index])))
    ) {
      this.setState({ error: null });
    }
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback !== undefined) return <>{this.props.fallback}</>;
      // 内置兜底：内联最小样式（不用业务 token / Tailwind 类，保证即使 CSS 加载失败也能显示）
      return (
        <div
          role="alert"
          className={cn("p-6 text-center", this.props.className)}
          style={{
            border: "1px solid rgba(128,128,128,0.35)",
            borderRadius: "8px",
            margin: "12px 0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p style={{ fontWeight: 600, margin: "0 0 8px" }}>
            {this.props.name ? `「${this.props.name}」` : "此区域"}渲染失败
          </p>
          <p style={{ fontSize: "13px", opacity: 0.75, margin: "0 0 12px", wordBreak: "break-all" }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            style={{
              padding: "4px 14px",
              fontSize: "13px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid rgba(128,128,128,0.45)",
              background: "transparent",
              color: "inherit",
            }}
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };

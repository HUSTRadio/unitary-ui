import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * LoadMoreButton — 全宽「加载更多」按钮（docs/geist-markdown-refs/components/load-more-button.md 官方语义）。
 * 导出：LoadMoreButton。
 * 官方实测（2026-08）：
 * - 几何：h:36px · pad:0px 10px · 500 14px/21px（即 Button variant="secondary" 默认 size）
 * - loading 态：Spinner + "Loading..."，禁用；fg:#8f8f8f · bg:#f2f2f2（暗色 bg:#1a1a1a）
 * - noGap / noBorderRadius 变体
 */

export interface LoadMoreButtonProps extends ButtonProps {
  /** 加载态：显示 Spinner + "Loading..." 并禁用按钮 */
  loading?: boolean;
  /** 无间距变体：Spinner 与文字之间不留间隙 */
  noGap?: boolean;
  /** 无圆角变体：按钮直角 */
  noBorderRadius?: boolean;
}

function LoadMoreButton({
  className,
  loading = false,
  disabled,
  noGap = false,
  noBorderRadius = false,
  children,
  ...props
}: LoadMoreButtonProps) {
  const { t } = useI18n();
  return (
    <Button
      typeName="button"
      type="secondary"
      loading={loading}
      // 官方 h:36px · pad:0px 10px = Button 默认 size（medium），勿改回 sm
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-slot="load-more-button"
      className={cn(
        "w-full",
        // loading 态官方禁用色：fg #8f8f8f · bg #f2f2f2（暗色 bg #1a1a1a），
        // 覆盖 Button 默认的 disabled:opacity-50 同色透明方案。
        // 使用主题感知语义 token：gray-100（light #f2f2f2 / dark #1a1a1a）、gray-700（#8f8f8f 双主题恒定）。
        loading &&
          "border-gray-100 bg-gray-100 text-gray-700 hover:border-gray-100 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-100",
        noBorderRadius && "rounded-none",
        noGap && "[&_[data-slot=loading-icon]]:mr-0",
        className,
      )}
      {...props}
    >
      {loading ? t("Loading...") : children}
    </Button>
  );
}

export { LoadMoreButton };

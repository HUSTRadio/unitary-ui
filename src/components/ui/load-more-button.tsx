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
        // 覆盖 Button 默认的 disabled:opacity-50 同色透明方案
        loading &&
          "border-[#f2f2f2] bg-[#f2f2f2] text-[#8f8f8f] hover:border-[#f2f2f2] hover:bg-[#f2f2f2] hover:text-[#8f8f8f] disabled:opacity-100 dark:border-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:border-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:hover:text-[#8f8f8f]",
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

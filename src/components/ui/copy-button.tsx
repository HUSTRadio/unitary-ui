import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { callWithCancelGuard } from "@/lib/cancel-guard";
import { useI18n } from "@/lib/i18n";

interface CopyButtonProps extends Omit<React.ComponentProps<"button">, "onCopy" | "onError"> {
  /** 要复制的文本。 */
  textToCopy: string;
  /** 可访问名称；不渲染可见文本。 */
  label?: string;
  /** 文本复制成功后触发。 */
  onCopy?: (text: string) => void;
  /** Clipboard API 与兼容回退均失败时触发。 */
  onError?: (error: unknown) => void;
}

/**
 * CopyButton — 复制反馈动效：
 * 1. 点按：复制图标缩小淡出；延迟 60ms 后，单独的对勾以轻微 scale + 描边绘制进入。
 *    不再将 CopyCheck 的文档轮廓与对勾一起切换，避免图形跳变。
 * 2. 约 1.2s 后：对勾淡出、复制图标还原。
 * reduced-motion 下所有过渡降级为瞬时切换。
 */
function CopyButton({
  className,
  textToCopy,
  label = "Copy",
  onClick,
  onCopy,
  onError,
  ...props
}: CopyButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!callWithCancelGuard(event, onClick)) return;

    try {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable");
        await navigator.clipboard.writeText(textToCopy);
      } catch (clipboardError) {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        try {
          textarea.select();
          if (typeof document.execCommand !== "function" || !document.execCommand("copy")) {
            throw clipboardError;
          }
        } finally {
          textarea.remove();
        }
      }
    } catch (error) {
      onError?.(error);
      return;
    }

    setCopied(true);
    onCopy?.(textToCopy);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? t("Copied") : label === "Copy" ? t(label) : label}
      onClick={handleCopy}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-background p-0 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--color-gray-400)] outline-none transition-colors duration-(--uni-duration-fast) hover:bg-gray-200 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {/* 双图标常驻叠加，仅变换 opacity / transform，避免状态切换导致布局跳动。 */}
      <span className="relative flex size-4 items-center justify-center" aria-hidden>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform] ease-out motion-reduce:transition-none",
            copied
              ? "scale-75 -rotate-6 opacity-0 duration-(--uni-duration-fast)"
              : "scale-100 rotate-0 opacity-100 duration-(--uni-duration-fast)",
          )}
        >
          <Copy className="size-4" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform] ease-out motion-reduce:transition-none",
            copied
              ? "scale-100 rotate-0 opacity-100 delay-[60ms] duration-(--uni-duration-base)"
              : "scale-75 -rotate-6 opacity-0 duration-(--uni-duration-fast)",
            copied && "[&_svg_path:first-child]:animate-copy-check-draw",
          )}
        >
          <Check className="size-4" />
        </span>
      </span>
    </button>
  );
}

export { CopyButton };
export type { CopyButtonProps };

import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface CopyButtonProps extends React.ComponentProps<"button"> {
  /** 要复制的文本。 */
  textToCopy: string;
  /** 可访问名称；不渲染可见文本。 */
  label?: string;
}

/**
 * CopyButton — 复制反馈动效：
 * 1. 点按：复制图标快速 fade out（120ms），同时对勾以描边绘制动画「打出来」（200ms，
 *    keyframes copy-check-draw 驱动 stroke-dashoffset，不修改 lucide SVG 内容）
 * 2. 约 1.2s 后：对勾 fade out，复制图标 fade in 还原
 * reduced-motion 下所有过渡降级为瞬时切换。
 */
function CopyButton({ className, textToCopy, label = "Copy", ...props }: CopyButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
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
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-background p-0 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--color-gray-400)] outline-none transition-colors duration-150 hover:bg-gray-200 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {/* 双图标常驻叠加，靠 opacity / 描边动画切换 */}
      <span className="relative flex size-4 items-center justify-center" aria-hidden>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity ease-in-out motion-reduce:transition-none",
            copied ? "opacity-0 duration-100" : "opacity-100 duration-150",
          )}
        >
          <Copy className="size-4" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-in-out motion-reduce:transition-none",
            copied ? "opacity-100" : "opacity-0",
            copied && "[&_svg_path:first-child]:animate-copy-check-draw",
          )}
        >
          <CopyCheck className="size-4" />
        </span>
      </span>
    </button>
  );
}

export { CopyButton };

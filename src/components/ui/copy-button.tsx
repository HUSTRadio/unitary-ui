import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ComponentProps<"button"> {
  /** 要复制的文本。 */
  textToCopy: string;
  /** 可访问名称；不渲染可见文本。 */
  label?: string;
}

/**
 * CopyButton — 官方 vercel.com/geist/copy-button 实时实测对齐。
 *
 * 官方动效机制（2026-08-20 官方页面 CDP 实测）：
 * - 按钮内**同时渲染两个图标**（copy 16px + check 8px 中心叠加），不是条件替换 DOM
 * - 点击复制：check 从 scale-50 放大到 100%、copy 从 100% 缩小到 50% 并淡出，
 *   过渡 150ms（t+120ms 实测中间帧 13.2px/10.8px，t+220ms 完成）
 * - 约 1000ms 后自动还原（官方 t+700ms 仍为 check 态、t+1200ms 已还原）
 * - check 图标继承前景色，**不变绿**；按钮 hover 背景 gray-200（dark 实测 #1f1f1f）
 */
function CopyButton({ className, textToCopy, label = "Copy", ...props }: CopyButtonProps) {
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
    timer.current = window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? "Copied" : label}
      onClick={handleCopy}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-background p-0 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--color-gray-400)] outline-none transition-colors duration-150 hover:bg-gray-200 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {/* 官方双图标 scale 交叉：copy 与 check 常驻叠加，靠 scale/opacity 过渡切换 */}
      <span className="relative flex size-4 items-center justify-center" aria-hidden>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-150 ease-in-out motion-reduce:transition-none",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <Copy className="size-4" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-150 ease-in-out motion-reduce:transition-none",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <CopyCheck className="size-4" />
        </span>
      </span>
    </button>
  );
}

export { CopyButton };

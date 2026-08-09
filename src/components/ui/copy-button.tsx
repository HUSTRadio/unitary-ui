import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * CopyButton — 复制按钮（docs/geist-markdown-refs/components/copy-button.md 官方语义）。
 * 导出：CopyButton。
 * 点击后用 navigator.clipboard.writeText 复制 text，成功后 1.5s 显示 CopyCheck 反馈。
 * 样式：ghost icon-sm 按钮。
 */

interface CopyButtonProps extends React.ComponentProps<"button"> {
  /** 要复制的文本 */
  text: string;
}

function CopyButton({ className, text, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 降级：隐藏 textarea + execCommand（无 clipboard 权限的环境仍可复制并给出反馈）
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      aria-label="Copy"
      onClick={handleCopy}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-gray-alpha-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {copied ? (
        <CopyCheck className="text-success" aria-hidden />
      ) : (
        <Copy aria-hidden />
      )}
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export { CopyButton };

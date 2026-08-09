import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * TextWithCopyButton — 官方 Text With Copy Button（docs/geist-markdown-refs/components/text-with-copy-button.md 实测）。
 * 导出：TextWithCopyButton。
 * 官方实测结构：整行是一个 <button>，内含 textLabel 文本（400 16px/24px，light #333 / dark #eaeaea）
 * + 16px 复制图标；props 为 textToCopy / textLabel / successMessage / ellipsis。
 * 点击后图标交叉淡入 CopyCheck，1.5s 还原；successMessage 作为复制成功的 title 反馈。
 * ellipsis 为 true 时文本省略号截断（官方 geist-ellipsis 语义）。
 */

interface TextWithCopyButtonProps extends React.ComponentProps<"button"> {
  /** 要复制的文本（官方 textToCopy） */
  textToCopy: string;
  /** 可见文本标签（官方 textLabel） */
  textLabel: string;
  /** 复制成功反馈文案（官方 successMessage，渲染为 title） */
  successMessage?: string;
  /** 超长文本省略号截断（官方 ellipsis） */
  ellipsis?: boolean;
}

function TextWithCopyButton({
  className,
  textToCopy,
  textLabel,
  successMessage = "Copied",
  ellipsis,

  ...props
}: TextWithCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // 降级：隐藏 textarea + execCommand（无 clipboard 权限的环境仍可复制并给出反馈）
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
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      data-slot="text-with-copy-button"
      title={copied ? successMessage : undefined}
      onClick={handleCopy}
      className={cn(
        "flex w-full cursor-pointer items-center justify-start gap-1.5 border-none bg-none p-0 text-[16px] leading-6 text-[#333333] outline-none transition-colors duration-100 ease-in-out hover:text-foreground",
        "[&_svg]:shrink-0 [&_svg]:text-gray-600 [&_svg]:transition-all [&_svg]:duration-100 [&_svg]:ease-in-out hover:[&_svg]:text-foreground",
        "dark:text-[#eaeaea]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "min-w-0 flex-1 text-inherit",
          ellipsis ? "truncate whitespace-nowrap" : "whitespace-nowrap",
        )}
      >
        {textLabel}
      </span>
      <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden>
        <span
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-100"
          style={{ opacity: copied ? 0 : 1 }}
        >
          <Copy className="size-4" />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-100"
          style={{ opacity: copied ? 1 : 0 }}
        >
          <CopyCheck className="size-4" />
        </span>
      </span>
      <span className="sr-only">{copied ? successMessage : "Copy"}</span>
    </button>
  );
}

export { TextWithCopyButton };

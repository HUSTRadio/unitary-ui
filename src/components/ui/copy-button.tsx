import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ComponentProps<"button"> {
  /** 要复制的文本。 */
  textToCopy: string;
  /** 可访问名称；不渲染可见文本。 */
  label?: string;
}

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
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? "Copied" : label}
      onClick={handleCopy}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-background p-0 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--color-gray-400)] outline-none transition-colors hover:bg-gray-100 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {copied ? <CopyCheck className="text-success" aria-hidden /> : <Copy aria-hidden />}
    </button>
  );
}

export { CopyButton };

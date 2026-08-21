import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Snippet — 代码片段展示（docs/geist-markdown-refs/components/snippet.md 官方语义）。
 * 导出：Snippet。
 *
 * 官方 API：
 * - text：string | string[]（数组渲染为多行）
 * - width：容器宽度（number 视为 px）
 * - dark：反色（浅色主题深底 / 深色主题浅底）
 * - prompt：是否渲染 "$ " 提示符（默认 true，复制载荷不含 $）
 * - onCopy：复制成功回调
 * - type："default" | "success" | "error" | "warning"（文字着色）
 * - copied：受控复制成功态（外部控制勾选反馈）
 * - copyText：复制载荷（text 含富节点时指定纯文本）

 * 材质对齐 Geist 实测（2026-08）：
 * - 容器：flex items-center gap-2 rounded-[8px] border border-gray-alpha-400
 *   bg-background p-3
 * - 文本：font-mono text-copy-13 text-foreground
 * - 复制按钮：h-32px r-6px；点击→Copied + CopyCheck 图标→1.5s 还原
 */

type SnippetType = "default" | "success" | "error" | "warning";

interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 官方 API：要展示（并复制）的代码，数组为多行 */
  text: string | string[];
  /** 官方 API：容器宽度（number 视为 px） */
  width?: number | string;
  /** 官方 API：反色 */
  dark?: boolean;
  /** 官方 API：是否渲染 "$ " 提示符（默认 true，复制内容不含 $） */
  prompt?: boolean;
  /** 官方 API：复制成功回调 */
  onCopy?: () => void;
  /** 官方 API：类型（文字着色） */
  type?: SnippetType;
  /** 官方 API：受控复制成功态 */
  copied?: boolean;
  /** 官方 API：复制载荷（text 含富节点时指定纯文本） */
  copyText?: string;
}

const typeColor: Record<SnippetType, string> = {
  default: "text-foreground",
  success: "text-success",
  error: "text-[#cb2a2f] dark:text-[#ff6166]",
  warning: "text-warning-action",
};

const darkClasses =
  "border-[#ffffff24] bg-[#0a0a0a] text-[#f2f2f2] dark:border-[#00000014] dark:bg-[#ffffff] dark:text-[#171717]";

const toSize = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

function Snippet({
  className,
  text,

  width,
  dark,
  prompt = true,
  onCopy,
  type = "default",
  copied: copiedProp,
  copyText,

  ...props
}: SnippetProps) {
  const { t } = useI18n();
  const [internalCopied, setInternalCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const copied = copiedProp ?? internalCopied;
  const lines = Array.isArray(text) ? text : [text];
  const payload = copyText ?? lines.join("\n");

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // 降级：隐藏 textarea + execCommand（无 clipboard 权限的环境仍可复制并给出反馈）
      const textarea = document.createElement("textarea");
      textarea.value = payload;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    if (copiedProp === undefined) {
      setInternalCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setInternalCopied(false), 1500);
    }
    onCopy?.();
  };

  return (
    <div
      data-slot="snippet"
      className={cn(
        "flex items-center gap-2 rounded-[8px] border border-gray-alpha-400 bg-background p-3",
        dark && darkClasses,
        className,
      )}
      style={width != null ? { width: toSize(width) } : undefined}
      {...props}
    >
      <div
        className={cn("min-w-0 flex-1", lines.length > 1 && "flex flex-col items-start gap-0.5")}
      >
        {lines.map((line, index) => (
          <code key={index} className={cn("block font-mono text-copy-13", typeColor[type])}>
            {prompt && (
              <span aria-hidden className="select-none">
                {"$ "}
              </span>
            )}
            {line}
          </code>
        ))}
      </div>
      <button
        type="button"
        data-slot="snippet-copy"
        aria-label={t("Copy")}
        onClick={handleCopy}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-foreground transition-colors outline-none hover:bg-gray-alpha-200 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {copied ? <CopyCheck className="text-success" aria-hidden /> : <Copy aria-hidden />}
        <span className="sr-only">{copied ? t("Copied") : t("Copy")}</span>
      </button>
    </div>
  );
}

export { Snippet };

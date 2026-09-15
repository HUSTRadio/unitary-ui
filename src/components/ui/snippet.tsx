import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn, toCssSize } from "@/lib/utils";
import { copyTextToClipboard } from "@/lib/clipboard";
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
 *
 * dark（反色）= 整棵子树切换到相反 theme mode 的 color scheme（官方实测：
 * 浅色主题反色为深底 #0a0a0a + 浅字 #f2f2f2；深色主题反色为浅底 #ffffff + 深字 #1a1a1a）。
 * 主题级 token（--foreground / --gray-alpha-*）只随页面 scheme 解析、不会跟着容器翻转，
 * 所以反色时内部一律 text-inherit 走容器色链，hover 用相反 scheme 的 gray-alpha-200 硬编码：
 * 浅色页(#ffffff17 = dark --gray-alpha-200) / 深色页(#00000014 = light --gray-alpha-200)。
 * 已知边界：type="success|error|warning" 的语义色 token 不随反色翻转（官方同为非翻转语义色）。
 */

export type SnippetType = "default" | "success" | "error" | "warning";

export interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
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
  error: "text-error-foreground",
  warning: "text-warning-action",
};

const darkClasses =
  "border-[#ffffff24] bg-[#0a0a0a] text-[#f2f2f2] dark:border-[#00000014] dark:bg-[#ffffff] dark:text-[#1a1a1a]";

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
      await copyTextToClipboard(payload);
    } catch {
      // 尽力复制语义：无任何剪贴板通道时仍继续播报已复制（与 CopyButton 的"不谎报"策略相异，为组件各自产品语义）
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
        "flex items-center gap-2 rounded-lg border border-gray-alpha-400 bg-background p-3",
        dark && darkClasses,
        className,
      )}
      style={width != null ? { width: toCssSize(width) } : undefined}
      {...props}
    >
      <div
        className={cn("min-w-0 flex-1", lines.length > 1 && "flex flex-col items-start gap-0.5")}
      >
        {lines.map((line, index) => (
          <code
            key={index}
            className={cn(
              "block font-mono text-copy-13",
              dark && type === "default" ? "text-inherit" : typeColor[type],
            )}
          >
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
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-sm transition-colors outline-none focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
          dark ? "text-inherit hover:bg-[#ffffff17] dark:hover:bg-[#00000014]" : "text-foreground hover:bg-gray-alpha-200",
        )}
      >
        {copied ? <CopyCheck className="text-success" aria-hidden /> : <Copy aria-hidden />}
        <span className="sr-only">{copied ? t("Copied") : t("Copy")}</span>
      </button>
    </div>
  );
}

export { Snippet };

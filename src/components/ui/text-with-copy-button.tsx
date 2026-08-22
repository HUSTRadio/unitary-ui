import * as React from "react";
import { Copy, CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { useToasts } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

/**
 * TextWithCopyButton — 官方 Text With Copy Button（docs/geist-markdown-refs/components/text-with-copy-button.md 实测）。
 * 导出：TextWithCopyButton。
 * 官方实测结构：整行是一个 <button>，内含 textLabel 文本（400 16px/24px，light #333 / dark #eaeaea）
 * + 16px 复制图标；props 为 textToCopy / textLabel / successMessage / ellipsis / showTooltip / as / style。
 * 点击后图标立即切换为 CopyCheck，1000ms 还原；反馈走 toast：成功 toast.message(successMessage)，
 * 失败 toast.error("Failed to copy to clipboard")（无 title / sr-only / execCommand 降级）。
 * ellipsis 为 true 时文本省略号截断（官方 geist-ellipsis 语义）；showTooltip 为 true 时按钮外包 Tooltip(text=textToCopy)。
 */

export interface TextWithCopyButtonProps extends Omit<
  React.ComponentProps<"button">,
  "onClick" | "onCopy" | "onError" | "type"
> {
  /** 要复制的文本（官方 textToCopy）；为空时渲染 null */
  textToCopy: string;
  /** 可见文本标签（官方 textLabel） */
  textLabel: string;
  /** 复制成功反馈文案（官方 successMessage，toast.message 展示） */
  successMessage?: string;
  /** 超长文本省略号截断（官方 ellipsis，默认 false） */
  ellipsis?: boolean;
  /** 是否在按钮外包 Tooltip（官方 showTooltip，默认 false） */
  showTooltip?: boolean;
  /** 文本元素标签（官方 as，默认 "p"） */
  as?: React.ElementType;
  /** 文本元素样式（官方 style，作用于文本元素） */
  style?: React.CSSProperties;
  /**
   * 按钮点击回调。组件先调用此回调；若回调 `preventDefault()`，则跳过复制与反馈。
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** 剪贴板写入成功后的回调。 */
  onCopy?: (text: string) => void;
  /** 剪贴板写入失败后的回调。 */
  onError?: (error: unknown) => void;
}

function TextWithCopyButton({
  className,
  textToCopy,
  textLabel,
  successMessage,
  ellipsis = false,
  showTooltip = false,
  as: Tag = "p",
  style,
  onClick,
  onCopy,
  onError,

  ...props
}: TextWithCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const toast = useToasts();
  const { t } = useI18n();
  const resolvedSuccessMessage = successMessage ?? t("Copied");

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !textToCopy) return;

    window.clearTimeout(timer.current);
    // 官方：点击立即显示成功图标（不等待 promise）；成功 toast.message，失败 toast.error。
    setCopied(true);

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.message({ text: resolvedSuccessMessage });
        onCopy?.(textToCopy);
      })
      .catch((error: unknown) => {
        toast.error(t("Failed to copy to clipboard"));
        onError?.(error);
      });

    // 官方 revert = 1000ms
    timer.current = window.setTimeout(() => setCopied(false), 1000);
  };

  const button = (
    <button
      {...props}
      type="button"
      data-slot="text-with-copy-button"
      onClick={handleCopy}
      className={cn(
        "flex w-full cursor-pointer items-center justify-start gap-1.5 border-none bg-none p-0 text-[16px] leading-6 text-[#333333] outline-none transition-colors duration-100 ease-in-out hover:text-foreground",
        "[&_svg]:shrink-0 [&_svg]:text-gray-600 [&_svg]:transition-all [&_svg]:duration-100 [&_svg]:ease-in-out hover:[&_svg]:text-foreground",
        "dark:text-[#eaeaea]",
        className,
      )}
    >
      <Tag className={cn("text-inherit whitespace-nowrap", ellipsis && "truncate")} style={style}>
        {textLabel}
      </Tag>
      <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-150",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <Copy className="size-4" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-150",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <CopyCheck className="size-4" />
        </span>
      </span>
    </button>
  );

  // 官方：textToCopy 为空时渲染 null；showTooltip 为 false 时 Tooltip disableTriggers（仅透传 children）
  if (!textToCopy) return null;

  return (
    <Tooltip disableTriggers={!showTooltip} text={textToCopy}>
      {button}
    </Tooltip>
  );
}

export { TextWithCopyButton };

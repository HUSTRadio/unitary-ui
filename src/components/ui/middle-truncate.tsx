
import { cn } from "@/lib/utils";

/**
 * MiddleTruncate — Geist 中间截断文本。
 * 保留字符串首尾信息（文件路径 / URL / ID / hash），中段溢出时以省略号截断。
 * 实现：flex 容器 + 首段 truncate（溢出显示 …）+ 尾段 shrink-0 固定可见。
 * 完整字符串通过 title 暴露，便于悬停查看与辅助技术读取。
 */

interface MiddleTruncateProps {
  text: string;
  className?: string;
}

function MiddleTruncate({ text, className }: MiddleTruncateProps) {
  const mid = Math.ceil(text.length / 2);
  const head = text.slice(0, mid);
  const tail = text.slice(mid);

  return (
    <span
      data-slot="middle-truncate"
      title={text}
      className={cn("flex min-w-0 max-w-full items-baseline", className)}
    >
      <span className="truncate">{head}</span>
      <span className="shrink-0">{tail}</span>
    </span>
  );
}

export { MiddleTruncate };

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * JsonView — JSON 展示组件（对应官方 JsonView，docs/geist-markdown-refs/components/json-view.md 简化版）。
 * 用 <pre> + font-mono 递归渲染：key 用 text-foreground，string 用 text-success，
 * number 用 text-info，boolean 用 text-warning，null 用 text-info。
 * 官方最佳实践：data 传对象/数组，不要预先 stringify；保留可选中文本方便复制。
 */
interface JsonViewProps {
  data: unknown;
  className?: string;
}

function JsonValue({ value }: { value: unknown }): React.ReactNode {
  if (value === null) {
    return <span className="text-info">null</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-warning">{String(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-info">{String(value)}</span>;
  }
  if (typeof value === "string") {
    return <span className="text-success">{JSON.stringify(value)}</span>;
  }
  if (Array.isArray(value)) {
    return (
      <span>
        <span className="text-muted-foreground">[</span>
        {value.map((item, i) => (
          <span key={i}>
            {i > 0 ? <span className="text-muted-foreground">, </span> : null}
            <JsonValue value={item} />
          </span>
        ))}
        <span className="text-muted-foreground">]</span>
      </span>
    );
  }
  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <span>
      <span className="text-muted-foreground">{"{"}</span>
      {entries.map(([k, v], i) => (
        <span key={k}>
          {i > 0 ? <span className="text-muted-foreground">, </span> : null}
          <span className="text-foreground">{JSON.stringify(k)}</span>
          <span className="text-muted-foreground">: </span>
          <JsonValue value={v} />
        </span>
      ))}
      <span className="text-muted-foreground">{"}"}</span>
    </span>
  );
}

function JsonView({ data, className }: JsonViewProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-[8px] border border-gray-alpha-400 bg-background p-4 font-mono text-copy-13 leading-relaxed text-foreground",
        className,
      )}
    >
      <JsonValue value={data} />
    </pre>
  );
}

export { JsonView };

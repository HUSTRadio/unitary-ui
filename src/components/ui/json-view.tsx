import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * JsonView — JSON 展示组件（对应官方 JsonView，docs/geist-markdown-refs/components/json-view.md）。
 *
 * 官方行为（vercel.com/geist/json-view 实测）：
 * - 可折叠树：defaultExpandDepth 控制默认展开层级（level <= defaultExpandDepth 展开，
 *   默认 1：顶层展开、嵌套折叠；0 = 全部折叠）
 * - 无障碍：role="tree" + treeitem（aria-level/posinset/setsize/expanded），
 *   箭头键移动、Enter/Space 切换展开、Home/End 首尾节点（官方 Accessibility）
 * - highlightPattern：makeJsonViewHighlightPattern(terms) 生成，高亮字段名与原始值
 *   （官方 <mark> 为 highlight-yellow 底 + 黑字）
 * - 文本可选中（复制可用）；颜色沿用官方实测（key=#c41562/dark:#ff518d、string=success、
 *   number/info、boolean=amber-900、null=info、标点=muted-foreground、chevron=gray-500/dark:gray-700）
 */

interface JsonNode {
  /** 字段名（数组项为索引字符串），根节点为 null */
  key: string | null;
  value: unknown;
  /** 唯一路径，用于展开/焦点状态 */
  path: string;
  type: "object" | "array" | "primitive";
  /** 1 起始的树层级（根 = 1） */
  level: number;
  posinset: number;
  setsize: number;
  parentPath: string | null;
  children: JsonNode[];
}

interface JsonViewProps {
  data: unknown;
  className?: string;
  /** 默认展开层级：level <= defaultExpandDepth 的节点展开（默认 1） */
  defaultExpandDepth?: number;
  /** 搜索高亮正则，用 makeJsonViewHighlightPattern 生成 */
  highlightPattern?: RegExp | null;
}

function buildTree(data: unknown): JsonNode {
  function build(
    value: unknown,
    key: string | null,
    path: string,
    level: number,
    parentPath: string | null,
    posinset: number,
  ): JsonNode {
    const type: JsonNode["type"] =
      value === null || typeof value !== "object"
        ? "primitive"
        : Array.isArray(value)
          ? "array"
          : "object";

    let children: JsonNode[] = [];
    if (type === "object") {
      children = Object.entries(value as Record<string, unknown>).map(([k, v], i) =>
        build(v, k, `${path}/${i}`, level + 1, path, i + 1),
      );
    } else if (type === "array") {
      children = (value as unknown[]).map((v, i) =>
        build(v, String(i), `${path}/${i}`, level + 1, path, i + 1),
      );
    }

    return {
      key,
      value,
      path,
      type,
      level,
      posinset,
      setsize: type === "primitive" ? 1 : children.length,
      parentPath,
      children,
    };
  }

  return build(data, null, "root", 1, null, 1);
}

function initExpanded(root: JsonNode, depth: number): Set<string> {
  const set = new Set<string>();
  const walk = (node: JsonNode) => {
    if (node.type !== "primitive" && node.level <= depth) {
      set.add(node.path);
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return set;
}

function flattenVisible(root: JsonNode, expanded: Set<string>): JsonNode[] {
  const out: JsonNode[] = [];
  const walk = (node: JsonNode) => {
    out.push(node);
    if (node.type !== "primitive" && expanded.has(node.path)) {
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return out;
}

function highlightText(text: string, pattern?: RegExp | null): React.ReactNode {
  if (!pattern) return text;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(
      <mark key={`mark-${index}`} className="rounded-[2px] bg-[#ffe381] text-black">
        {match[0]}
      </mark>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length > 0 ? nodes : text;
}

/**
 * 由搜索词生成高亮正则（官方 makeJsonViewHighlightPattern）。
 * 匹配字段名与原始值；terms 为空时返回 null（官方：无搜索时不传 pattern）。
 */
function makeJsonViewHighlightPattern(terms: string[]): RegExp | null {
  const escaped = terms
    .filter((term) => term.length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join("|")})`, "gi");
}

function JsonPrimitiveValue({ value, pattern }: { value: unknown; pattern?: RegExp | null }) {
  if (value === null) return <span className="text-info">null</span>;
  if (typeof value === "boolean") return <span className="text-amber-900">{String(value)}</span>;
  if (typeof value === "number") return <span className="text-info">{String(value)}</span>;
  return <span className="text-success">{highlightText(JSON.stringify(value), pattern)}</span>;
}

function JsonView({ data, className, defaultExpandDepth = 1, highlightPattern }: JsonViewProps) {
  const tree = React.useMemo(() => buildTree(data), [data]);
  const [expanded, setExpanded] = React.useState<Set<string>>(() =>
    initExpanded(tree, defaultExpandDepth),
  );
  const [focusedPath, setFocusedPath] = React.useState<string | null>(null);
  const rowRefs = React.useRef(new Map<string, HTMLElement>());

  const visible = React.useMemo(() => flattenVisible(tree, expanded), [tree, expanded]);

  const toggle = React.useCallback((path: string, force?: boolean) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const shouldExpand = force ?? !next.has(path);
      if (shouldExpand) next.add(path);
      else next.delete(path);
      return next;
    });
  }, []);

  const moveFocus = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < visible.length) {
        setFocusedPath(visible[index].path);
      }
    },
    [visible],
  );

  React.useEffect(() => {
    if (focusedPath) rowRefs.current.get(focusedPath)?.focus();
  }, [focusedPath]);

  function handleKeyDown(event: React.KeyboardEvent) {
    const currentIndex = focusedPath ? visible.findIndex((node) => node.path === focusedPath) : -1;
    const current = currentIndex >= 0 ? visible[currentIndex] : null;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(currentIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(currentIndex - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (!current) break;
        if (current.type !== "primitive" && !expanded.has(current.path)) {
          toggle(current.path, true);
        } else {
          const next = visible[currentIndex + 1];
          if (next && next.parentPath === current.path) moveFocus(currentIndex + 1);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (!current) break;
        if (current.type !== "primitive" && expanded.has(current.path)) {
          toggle(current.path, false);
        } else if (current.parentPath) {
          const parentIndex = visible.findIndex((node) => node.path === current.parentPath);
          if (parentIndex >= 0) moveFocus(parentIndex);
        }
        break;
      case "Home":
        event.preventDefault();
        moveFocus(0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(visible.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (current && current.type !== "primitive") {
          toggle(current.path, !expanded.has(current.path));
        }
        break;
    }
  }

  function renderNode(node: JsonNode): React.ReactNode {
    const isExpandable = node.type !== "primitive";
    const isOpen = isExpandable && expanded.has(node.path);
    const isFocused = focusedPath === node.path;
    const openingBrace = node.type === "array" ? "[" : "{";
    const closingBrace = node.type === "array" ? "]" : "}";

    return (
      <span
        key={node.path}
        role="treeitem"
        aria-level={node.level}
        aria-posinset={node.posinset}
        aria-setsize={node.setsize}
        aria-expanded={isExpandable ? isOpen : undefined}
        aria-label={node.key != null ? `${node.key}: ${node.type}` : `JSON ${node.type}`}
        tabIndex={isFocused ? 0 : -1}
        ref={(el) => {
          if (el) rowRefs.current.set(node.path, el);
          else rowRefs.current.delete(node.path);
        }}
        onClick={() => {
          setFocusedPath(node.path);
          if (isExpandable) toggle(node.path, !isOpen);
        }}
        className={cn(
          "block py-0 pr-0 pl-2 outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-progress",
        )}
      >
        <span className="block">
          {isExpandable ? (
            <span
              aria-hidden
              className="mr-0.5 inline-flex size-4 translate-y-0.5 items-center justify-center align-top text-gray-500 dark:text-gray-700"
            >
              <svg
                viewBox="0 0 16 16"
                className={cn("size-4 transition-transform", !isOpen && "-rotate-90")}
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : (
            <span className="inline-block w-4" aria-hidden />
          )}
          {node.key != null ? (
            <>
              <span className="text-[#c41562] dark:text-[#ff518d]">
                {highlightText(node.key ?? "", highlightPattern)}
              </span>
              <span className="text-foreground">: </span>
            </>
          ) : null}
          {isOpen ? (
            <span className="text-foreground">{openingBrace}</span>
          ) : (
            <>
              <span className="text-foreground">{openingBrace}</span>
              <span className="text-foreground"> … </span>
              <span className="text-foreground">{closingBrace}</span>
            </>
          )}
          {!isExpandable ? (
            <JsonPrimitiveValue value={node.value} pattern={highlightPattern} />
          ) : null}
        </span>
        {isOpen && node.children.length > 0 ? (
          <span role="group" className="block">
            {node.children.map((child) => renderNode(child))}
          </span>
        ) : null}
        {isOpen ? <span className="block text-foreground">{closingBrace}</span> : null}
      </span>
    );
  }

  return (
    <pre
      className={cn(
        "block w-max max-w-full overflow-x-auto align-top font-mono text-copy-13 leading-5",
        className,
      )}
    >
      <span
        role="tree"
        aria-label="JSON"
        onKeyDown={handleKeyDown}
        className="block w-max max-w-full whitespace-pre-wrap [overflow-wrap:anywhere]"
      >
        {renderNode(tree)}
      </span>
    </pre>
  );
}

export { JsonView, makeJsonViewHighlightPattern };

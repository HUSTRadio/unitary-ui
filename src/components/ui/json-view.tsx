import * as React from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type JsonNodeType = "object" | "array" | "primitive";
type JsonDiagnostic = "invalid-date" | "circular" | "max-depth" | "reading-keys" | "reading-value";

interface JsonNode {
  key: string | null;
  value: unknown;
  primitiveText?: string;
  diagnostic?: JsonDiagnostic;
  path: string;
  type: JsonNodeType;
  level: number;
  posinset: number;
  setsize: number;
  parentPath: string | null;
  children: JsonNode[];
}

const MAX_TREE_DEPTH = 512;

function escapeJsonPointer(segment: string): string {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

function specialObjectText(value: unknown): string | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "Invalid Date" : JSON.stringify(value.toISOString());
  }
  if (value instanceof RegExp) return String(value);
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Map) return `[Map(${value.size})]`;
  if (value instanceof Set) return `[Set(${value.size})]`;
  return undefined;
}

export interface JsonViewProps {
  data: unknown;
  className?: string;
  /** Root is level 1. Zero collapses the root; one expands only the root. */
  defaultExpandDepth?: number;
  /** Highlights matching keys and primitive values. Global and non-global regexes are accepted. */
  highlightPattern?: RegExp | null;
}

function isContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === "object" && specialObjectText(value) === undefined;
}

function buildTree(data: unknown): JsonNode {
  const ancestors = new Set<object>();
  const makeNode = (
    value: unknown,
    key: string | null,
    path: string,
    level: number,
    parentPath: string | null,
    posinset: number,
    setsize: number,
    diagnostic?: JsonDiagnostic,
  ): JsonNode => {
    const type: JsonNodeType = !isContainer(value)
      ? "primitive"
      : Array.isArray(value)
        ? "array"
        : "object";

    const node: JsonNode = {
      key,
      value,
      path,
      type,
      level,
      posinset,
      setsize,
      parentPath,
      children: [],
      diagnostic,
    };
    node.primitiveText = diagnostic ? undefined : specialObjectText(value);
    if (value instanceof Date && Number.isNaN(value.getTime())) node.diagnostic = "invalid-date";
    return node;
  };

  const root = makeNode(data, null, "", 1, null, 1, 1);
  type Frame = { kind: "visit"; node: JsonNode } | { kind: "leave"; value: object };
  const stack: Frame[] = [{ kind: "visit", node: root }];

  while (stack.length > 0) {
    const frame = stack.pop()!;
    if (frame.kind === "leave") {
      ancestors.delete(frame.value);
      continue;
    }

    const { node } = frame;
    if (node.type === "primitive") continue;
    const container = node.value as Record<string, unknown> | unknown[];
    if (ancestors.has(container as object)) {
      node.type = "primitive";
      node.diagnostic = "circular";
      continue;
    }
    if (node.level >= MAX_TREE_DEPTH) {
      node.type = "primitive";
      node.diagnostic = "max-depth";
      continue;
    }

    ancestors.add(container as object);
    stack.push({ kind: "leave", value: container as object });

    let keys: string[];
    try {
      keys = Array.isArray(container)
        ? Array.from({ length: container.length }, (_, index) => String(index))
        : Object.keys(container);
    } catch {
      node.type = "primitive";
      node.diagnostic = "reading-keys";
      ancestors.delete(container as object);
      stack.pop();
      continue;
    }

    node.children = keys.map((childKey, index) => {
      let childValue: unknown;
      let childDiagnostic: JsonDiagnostic | undefined;
      try {
        childValue = container[childKey as keyof typeof container];
      } catch {
        childValue = undefined;
        childDiagnostic = "reading-value";
      }
      const segment = Array.isArray(container) ? childKey : escapeJsonPointer(childKey);
      return makeNode(
        childValue,
        childKey,
        `${node.path}/${segment}`,
        node.level + 1,
        node.path,
        index + 1,
        keys.length,
        childDiagnostic,
      );
    });

    for (let index = node.children.length - 1; index >= 0; index -= 1) {
      stack.push({ kind: "visit", node: node.children[index] });
    }
  }

  return root;
}

function initExpanded(root: JsonNode, depth: number): Set<string> {
  const expanded = new Set<string>();
  const walk = (node: JsonNode) => {
    if (node.type !== "primitive" && node.children.length > 0 && node.level <= depth) {
      expanded.add(node.path);
      node.children.forEach(walk);
    }
  };
  walk(root);
  return expanded;
}

function flattenVisible(root: JsonNode, expanded: Set<string>): JsonNode[] {
  const visible: JsonNode[] = [];
  const walk = (node: JsonNode) => {
    visible.push(node);
    if (node.type !== "primitive" && expanded.has(node.path)) {
      node.children.forEach(walk);
    }
  };
  walk(root);
  return visible;
}

function collectPaths(root: JsonNode): Set<string> {
  const paths = new Set<string>();
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    paths.add(node.path);
    stack.push(...node.children);
  }
  return paths;
}

function collectExpandablePaths(root: JsonNode): Set<string> {
  const paths = new Set<string>();
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.type !== "primitive" && node.children.length > 0) paths.add(node.path);
    stack.push(...node.children);
  }
  return paths;
}

function highlightText(text: string, pattern?: RegExp | null): React.ReactNode {
  if (!pattern) return text;
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(matcher)) {
    if (match[0].length === 0) continue;
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

function primitiveDisplay(value: unknown, override?: string): string {
  if (override !== undefined) return override;
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "number" && !Number.isFinite(value)) return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "symbol" || typeof value === "function") return String(value);
  return String(value);
}

function diagnosticDisplay(diagnostic: JsonDiagnostic, t: ReturnType<typeof useI18n>["t"]): string {
  switch (diagnostic) {
    case "invalid-date":
      return t("Invalid Date");
    case "circular":
      return t("[Circular]");
    case "max-depth":
      return t("[Max depth {maxDepth} reached]", { maxDepth: MAX_TREE_DEPTH });
    case "reading-keys":
      return t("[Thrown while reading keys]");
    case "reading-value":
      return t("[Thrown while reading value]");
  }
}

function nodePrimitiveDisplay(node: JsonNode, t: ReturnType<typeof useI18n>["t"]): string {
  return node.diagnostic
    ? diagnosticDisplay(node.diagnostic, t)
    : primitiveDisplay(node.value, node.primitiveText);
}

function getInlinePrimitiveChild(
  node: JsonNode,
  t: ReturnType<typeof useI18n>["t"],
): JsonNode | null {
  if (node.type !== "object" || node.children.length !== 1) return null;
  const child = node.children[0];
  if (child.type !== "primitive") return null;
  const display = nodePrimitiveDisplay(child, t);
  if (display.includes("\n") || (child.key?.length ?? 0) + display.length > 64) return null;
  return child;
}

function JsonPrimitiveValue({
  value,
  text,
  diagnostic,
  display,
  pattern,
}: {
  value: unknown;
  text?: string;
  diagnostic?: JsonDiagnostic;
  display: string;
  pattern?: RegExp | null;
}) {
  if (value === null || typeof value === "number" || typeof value === "bigint") {
    return <span className="text-info">{highlightText(display, pattern)}</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-amber-900">{highlightText(display, pattern)}</span>;
  }
  if (diagnostic || value === undefined || text?.startsWith("[")) {
    return <span className="text-gray-900">{highlightText(display, pattern)}</span>;
  }
  return <span className="text-success">{highlightText(display, pattern)}</span>;
}

function makeJsonViewHighlightPattern(terms: string[]): RegExp | null {
  const escaped = terms
    .filter((term) => term.length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return escaped.length === 0 ? null : new RegExp(`(${escaped.join("|")})`, "gi");
}

function JsonView({ data, className, defaultExpandDepth = 1, highlightPattern }: JsonViewProps) {
  const { t } = useI18n();
  const tree = React.useMemo(() => buildTree(data), [data]);
  const depth = Math.max(0, Math.floor(defaultExpandDepth));
  const [expanded, setExpanded] = React.useState<Set<string>>(() => initExpanded(tree, depth));
  const [focusedPath, setFocusedPath] = React.useState("");
  const pendingFocus = React.useRef<string | null>(null);
  const rowRefs = React.useRef(new Map<string, HTMLSpanElement>());
  const previousDepth = React.useRef(depth);
  const previousExpandablePaths = React.useRef(collectExpandablePaths(tree));

  React.useEffect(() => {
    if (previousDepth.current !== depth) {
      previousDepth.current = depth;
      setExpanded(initExpanded(tree, depth));
      setFocusedPath("");
      previousExpandablePaths.current = collectExpandablePaths(tree);
      return;
    }

    const validPaths = collectPaths(tree);
    const expandablePaths = collectExpandablePaths(tree);
    const defaultPaths = initExpanded(tree, depth);
    setExpanded((current) => {
      const next = new Set([...current].filter((path) => validPaths.has(path)));
      for (const path of defaultPaths) {
        if (!previousExpandablePaths.current.has(path)) next.add(path);
      }
      if (next.size === current.size && [...next].every((path) => current.has(path)))
        return current;
      return next;
    });
    setFocusedPath((current) => (validPaths.has(current) ? current : ""));
    previousExpandablePaths.current = expandablePaths;
  }, [tree, depth]);

  const visible = React.useMemo(() => flattenVisible(tree, expanded), [tree, expanded]);

  const toggle = React.useCallback((path: string, force?: boolean) => {
    setExpanded((current) => {
      const next = new Set(current);
      const shouldExpand = force ?? !next.has(path);
      if (shouldExpand) next.add(path);
      else next.delete(path);
      return next;
    });
  }, []);

  const moveFocus = React.useCallback(
    (index: number) => {
      const node = visible[index];
      if (!node) return;
      pendingFocus.current = node.path;
      setFocusedPath(node.path);
    },
    [visible],
  );

  React.useLayoutEffect(() => {
    const path = pendingFocus.current;
    if (path === null) return;
    rowRefs.current.get(path)?.focus();
    pendingFocus.current = null;
  }, [focusedPath, visible]);

  function handleKeyDown(event: React.KeyboardEvent) {
    const currentIndex = visible.findIndex((node) => node.path === focusedPath);
    const current = visible[currentIndex];
    if (!current) return;

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
        if (current.type === "primitive" || current.children.length === 0) break;
        if (!expanded.has(current.path)) toggle(current.path, true);
        else if (visible[currentIndex + 1]?.parentPath === current.path) {
          moveFocus(currentIndex + 1);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (
          current.type !== "primitive" &&
          current.children.length > 0 &&
          expanded.has(current.path)
        ) {
          toggle(current.path, false);
        } else if (current.parentPath !== null) {
          moveFocus(visible.findIndex((node) => node.path === current.parentPath));
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
        if (current.type !== "primitive" && current.children.length > 0) {
          event.preventDefault();
          toggle(current.path);
        }
        break;
    }
  }

  function renderNode(node: JsonNode, inline = false): React.ReactNode {
    const container = node.type !== "primitive";
    const expandable = container && node.children.length > 0;
    const open = expandable && expanded.has(node.path);
    const inlineChild = open ? getInlinePrimitiveChild(node, t) : null;
    const openingBrace = node.type === "array" ? "[" : "{";
    const closingBrace = node.type === "array" ? "]" : "}";
    const comma = node.parentPath !== null && node.posinset < node.setsize ? "," : "";

    return (
      <span
        key={node.path}
        ref={(element) => {
          if (element) rowRefs.current.set(node.path, element);
          else rowRefs.current.delete(node.path);
        }}
        role="treeitem"
        data-path={node.path || "root"}
        aria-level={node.level}
        aria-posinset={node.posinset}
        aria-setsize={node.setsize}
        aria-expanded={expandable ? open : undefined}
        aria-label={
          node.type === "primitive"
            ? node.key === null
              ? nodePrimitiveDisplay(node, t)
              : `${node.key}: ${nodePrimitiveDisplay(node, t)}`
            : node.key === null
              ? t("JSON {type}", { type: t(`JSON ${node.type}`) })
              : `${node.key}: ${t(`JSON ${node.type}`)}`
        }
        tabIndex={focusedPath === node.path ? 0 : -1}
        onFocus={(event) => {
          if (event.currentTarget === event.target) setFocusedPath(node.path);
        }}
        className={cn("focus-ring rounded-sm outline-none", inline ? "inline" : "block")}
      >
        <span
          data-slot="json-view-row"
          className={cn(
            "whitespace-pre-wrap [overflow-wrap:anywhere]",
            inline ? "inline" : "block",
          )}
          style={{ paddingLeft: inline ? 0 : 8 }}
        >
          {expandable ? (
            <button
              type="button"
              tabIndex={-1}
              data-slot="json-view-toggle"
              aria-label={t(open ? "Collapse JSON node" : "Expand JSON node")}
              onClick={(event) => {
                event.stopPropagation();
                pendingFocus.current = node.path;
                setFocusedPath(node.path);
                toggle(node.path);
              }}
              className="mr-0.5 inline-flex size-4 translate-y-0.5 cursor-pointer items-center justify-center rounded-[3px] border-0 bg-transparent p-0 align-top text-gray-500 outline-none hover:bg-gray-alpha-200 dark:text-gray-700"
            >
              <svg
                viewBox="0 0 16 16"
                className={cn("size-4 transition-transform", !open && "-rotate-90")}
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : inline ? null : (
            <span className="inline-block w-4" aria-hidden />
          )}
          {node.key !== null ? (
            <>
              <span className="text-[#c41562] dark:text-[#ff518d]">
                {highlightText(node.key, highlightPattern)}
              </span>
              <span className="text-foreground">: </span>
            </>
          ) : null}
          {container ? (
            <>
              <span className="text-foreground">{openingBrace}</span>
              {inlineChild ? (
                <>
                  <span aria-hidden> </span>
                  <span role="group" className="inline">
                    {renderNode(inlineChild, true)}
                  </span>
                  <span className="text-foreground"> {closingBrace}</span>
                  {comma ? <span className="text-foreground">{comma}</span> : null}
                </>
              ) : null}
              {!open && expandable ? <span className="text-foreground"> … </span> : null}
              {!open ? <span className="text-foreground">{closingBrace}</span> : null}
              {!open && comma ? <span className="text-foreground">{comma}</span> : null}
            </>
          ) : (
            <>
              <JsonPrimitiveValue
                value={node.value}
                text={node.primitiveText}
                diagnostic={node.diagnostic}
                display={nodePrimitiveDisplay(node, t)}
                pattern={highlightPattern}
              />
              {comma ? <span className="text-foreground">{comma}</span> : null}
            </>
          )}
        </span>
        {open && !inlineChild ? (
          <>
            {node.children.length > 0 ? (
              <span role="group" className="block pl-4">
                {node.children.map((child) => renderNode(child))}
              </span>
            ) : null}
            <span
              className="block whitespace-pre-wrap pl-6 text-foreground [overflow-wrap:anywhere]"
              aria-hidden
            >
              {closingBrace}
              {comma}
            </span>
          </>
        ) : null}
      </span>
    );
  }

  return (
    <pre
      role="tree"
      aria-label={t("JSON")}
      onKeyDown={handleKeyDown}
      className={cn(
        "block w-full max-w-full whitespace-pre-wrap align-top font-mono text-copy-13 leading-5 [overflow-wrap:anywhere]",
        className,
      )}
    >
      {renderNode(tree)}
    </pre>
  );
}

export { JsonView, makeJsonViewHighlightPattern };

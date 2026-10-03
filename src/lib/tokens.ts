import { useMemo, useSyncExternalStore } from "react";

import {
  GLOBAL_TOKENS,
  RUNTIME_TOKEN_NAMES,
  type RuntimeTokenName,
  type TokenName,
} from "./token-catalog";

export type TokenTarget = HTMLElement | SVGElement;
export interface TokenOptions {
  /** 默认作用于 document.documentElement；null 表示尚无目标。 / Defaults to the root; null means no target. */
  target?: TokenTarget | null;
}
export interface TokenWriteOptions extends TokenOptions {
  priority?: "" | "important";
}
export type TokenValues<Name extends TokenName = RuntimeTokenName> = Readonly<Record<Name, string>>;

const changeEvent = "unitary:tokens-change";

function resolveTarget(options: TokenOptions): TokenTarget | null {
  if (options.target !== undefined) return options.target;
  return typeof document === "undefined" ? null : document.documentElement;
}

function validateName(name: string, writable = false): asserts name is TokenName {
  if (!Object.hasOwn(GLOBAL_TOKENS, name)) throw new TypeError(`Unknown global token: ${name}`);
  if (writable && GLOBAL_TOKENS[name as TokenName].kind !== "runtime") {
    throw new TypeError(`Build-time mapping cannot be overridden by this API: ${name}`);
  }
}

/** 读取当前 CSS 级联值（不是源码表达式）。 / Reads the current cascaded value, not its source expression. */
export function getToken(name: TokenName, options: TokenOptions = {}): string {
  return getTokens([name], options)[name];
}

export function getTokens<Name extends TokenName = RuntimeTokenName>(
  names: readonly Name[] = RUNTIME_TOKEN_NAMES as unknown as readonly Name[],
  options: TokenOptions = {},
): TokenValues<Name> {
  names.forEach((name) => validateName(name));
  const target = resolveTarget(options);
  const style = target?.ownerDocument.defaultView?.getComputedStyle(target);
  return Object.freeze(
    Object.fromEntries(names.map((name) => [name, style?.getPropertyValue(name).trim() ?? ""])),
  ) as TokenValues<Name>;
}

function announce(target: TokenTarget) {
  const view = target.ownerDocument.defaultView;
  if (view)
    target.ownerDocument.dispatchEvent(new view.CustomEvent(changeEvent, { detail: target }));
}

export function setToken(
  name: RuntimeTokenName,
  value: string,
  options: TokenWriteOptions = {},
): boolean {
  return setTokens({ [name]: value }, options);
}

/** 批量先校验再写入，只移除/修改指定 token。 / Validates the entire batch before writing only selected tokens. */
export function setTokens(
  values: Partial<Record<RuntimeTokenName, string>>,
  options: TokenWriteOptions = {},
): boolean {
  const entries = Object.entries(values);
  const target = resolveTarget(options);
  if (
    options.priority !== undefined &&
    options.priority !== "" &&
    options.priority !== "important"
  ) {
    throw new TypeError("Token priority must be empty or important");
  }
  for (const [name, value] of entries) {
    validateName(name, true);
    if (typeof value !== "string" || !value.trim() || /!\s*important\b/i.test(value)) {
      throw new TypeError(
        `Token values must be non-empty CSS strings; use priority for !important: ${name}`,
      );
    }
    const css = target?.ownerDocument.defaultView?.CSS;
    if (css?.supports && !css.supports(name, value))
      throw new TypeError(`Invalid CSS value for token: ${name}`);
  }
  if (!target) return false;
  for (const [name, value] of entries)
    target.style.setProperty(name, value.trim(), options.priority);
  if (entries.length) announce(target);
  return true;
}

export function resetToken(name: RuntimeTokenName, options: TokenOptions = {}): boolean {
  return resetTokens([name], options);
}

/** 恢复当前主题的 CSS 级联，而不是强制浅色默认值。 / Restores the current theme's cascade, not light defaults. */
export function resetTokens(
  names: readonly RuntimeTokenName[] = RUNTIME_TOKEN_NAMES,
  options: TokenOptions = {},
): boolean {
  names.forEach((name) => validateName(name, true));
  const target = resolveTarget(options);
  if (!target) return false;
  names.forEach((name) => target.style.removeProperty(name));
  if (names.length) announce(target);
  return true;
}

/** 订阅 API 写入、祖先主题/样式属性及媒体查询变化。 / Subscribes to API writes, ancestor attributes and media changes. */
export function subscribeTokens(listener: () => void, options: TokenOptions = {}): () => void {
  const target = resolveTarget(options);
  const view = target?.ownerDocument.defaultView;
  if (!target || !view) return () => {};
  const doc = target.ownerDocument;
  const affectsTarget = (node: Node) => node === target || node.contains(target);
  const onChange = (event: Event) => {
    const changed = (event as CustomEvent<TokenTarget>).detail;
    if (changed && affectsTarget(changed)) listener();
  };
  const observer = new view.MutationObserver((records) => {
    if (records.some((record) => affectsTarget(record.target))) listener();
  });
  observer.observe(doc.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "data-theme", "data-font-tier"],
  });
  doc.addEventListener(changeEvent, onChange);
  view.addEventListener("resize", listener);
  const media = ["(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)"].map((query) =>
    view.matchMedia?.(query),
  );
  media.forEach((query) => query?.addEventListener("change", listener));
  return () => {
    observer.disconnect();
    doc.removeEventListener(changeEvent, onChange);
    view.removeEventListener("resize", listener);
    media.forEach((query) => query?.removeEventListener("change", listener));
  };
}

export function useTokens<Name extends TokenName = RuntimeTokenName>(
  names: readonly Name[] = RUNTIME_TOKEN_NAMES as unknown as readonly Name[],
  options: TokenOptions = {},
): TokenValues<Name> {
  const namesKey = JSON.stringify(names);
  const target = resolveTarget(options);
  const store = useMemo(() => {
    const selected = JSON.parse(namesKey) as Name[];
    selected.forEach((name) => validateName(name));
    const server = Object.freeze(
      Object.fromEntries(selected.map((name) => [name, ""])),
    ) as TokenValues<Name>;
    let snapshot = server;
    return {
      subscribe: (listener: () => void) => subscribeTokens(listener, { target }),
      getServerSnapshot: () => server,
      getSnapshot: () => {
        const next = getTokens(selected, { target });
        if (selected.some((name) => next[name] !== snapshot[name])) snapshot = next;
        return snapshot;
      },
    };
  }, [namesKey, target]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

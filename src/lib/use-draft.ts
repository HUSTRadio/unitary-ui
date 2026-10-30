"use client";

import * as React from "react";

/**
 * useDraft — 可持久化的表单草稿状态（M2-03）。
 *
 * 语义边界：
 * - **opt-in**：不传 `key` 时完全不触碰存储；`storage` 不可用时退化为普通 state。
 * - **命名空间 + schema version**：存储键固定为 `unitary-draft/v<version>/<key>`，
 *   版本升级不会读到旧结构；`reset()` 只清理本命名空间的旧版本残留。
 * - **dirty 才写入**：序列化结果与基线一致时删除记录，与上次落盘一致时不重复写。
 * - **SSR 确定性**：服务端渲染返回 `initial` 且 `isHydrated=false`，恢复前不产生任何写入。
 * - 损坏 JSON、旧版本记录、配额异常、存储禁用都只影响持久化，不抛给调用方。
 */

export interface DraftStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  /** 可选：支持枚举时 `reset()` 才能清理同命名空间的旧版本残留。 */
  readonly length?: number;
  key?(index: number): string | null;
}

export interface UseDraftOptions<T> {
  /** 命名空间（如 "feedback-form"）。省略时 hook 不持久化。 */
  key?: string;
  /** schema version，默认 1；变更后旧记录不会被读取。 */
  version?: number;
  /** 基线默认值：回到该值即删除存储记录。 */
  initial: T | (() => T);
  /** 注入存储（默认浏览器 localStorage）；传 null 关闭持久化。 */
  storage?: DraftStorage | null;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

export interface UseDraftResult<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  /** 基线默认值（不随编辑变化）。 */
  baseline: T;
  /** 当前值是否与基线不同。 */
  isDirty: boolean;
  /** 是否已完成客户端恢复（SSR 首帧为 false）。 */
  isHydrated: boolean;
  /** 回到基线并删除存储记录（含本命名空间的旧版本残留）。 */
  reset: () => void;
}

const PREFIX = "unitary-draft";

export const DRAFT_KEY_PREFIX = PREFIX;

/** 存储键：`unitary-draft/v<version>/<namespace>`。 */
export function draftStorageKey(key: string, version: number): string {
  return `${PREFIX}/v${version}/${key}`;
}

function resolveInitial<T>(initial: T | (() => T)): T {
  return typeof initial === "function" ? (initial as () => T)() : initial;
}

function resolveStorage(storage: DraftStorage | null | undefined): DraftStorage | null {
  if (storage === null) return null;
  if (storage) return storage;
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    // 隐私模式或安全策略下访问 localStorage 会抛错。
    return null;
  }
}

/** 清理本命名空间的旧版本残留；不支持枚举的 adapter 直接跳过。 */
function removeStaleVersions(storage: DraftStorage, namespace: string, keep: string): void {
  if (typeof storage.length !== "number" || typeof storage.key !== "function") return;
  const stale: string[] = [];
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const name = storage.key(index);
      if (!name || name === keep) continue;
      const match = /^unitary-draft\/v\d+\/(.+)$/.exec(name);
      if (match && match[1] === namespace) stale.push(name);
    }
    for (const name of stale) storage.removeItem(name);
  } catch {
    // 枚举失败不影响主流程。
  }
}

export function useDraft<T>(options: UseDraftOptions<T>): UseDraftResult<T> {
  const { key, version = 1, initial, storage, serialize, deserialize } = options;
  const baseline = React.useRef<T>(resolveInitial(initial)).current;
  const serializeValue = React.useCallback(
    (value: T) => (serialize ? serialize(value) : JSON.stringify(value)),
    [serialize],
  );
  const baselineText = React.useMemo(() => serializeValue(baseline), [baseline, serializeValue]);

  const [value, setValue] = React.useState<T>(baseline);
  const [isHydrated, setIsHydrated] = React.useState(false);
  // 上次落盘的内容：用于跳过重复写入（含恢复后原样回写）。
  const persisted = React.useRef<string | null>(null);
  const storageKey = key ? draftStorageKey(key, version) : null;

  React.useEffect(() => {
    const target = resolveStorage(storage);
    if (!storageKey || !target) {
      persisted.current = null;
      setIsHydrated(true);
      return;
    }
    let restored: T | undefined;
    try {
      const raw = target.getItem(storageKey);
      if (raw !== null) {
        persisted.current = raw;
        restored = deserialize ? deserialize(raw) : (JSON.parse(raw) as T);
      } else {
        persisted.current = null;
      }
    } catch {
      // 损坏 JSON / 反序列化失败 / 读取异常：按无草稿处理。
      persisted.current = null;
      restored = undefined;
    }
    if (restored !== undefined) setValue(restored);
    else setValue(baseline);
    setIsHydrated(true);
    // 基线在会话内稳定；key 或 version 变化时重新恢复。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, storage, deserialize]);

  React.useEffect(() => {
    if (!isHydrated || !storageKey) return;
    const target = resolveStorage(storage);
    if (!target) return;
    const text = serializeValue(value);
    if (text === persisted.current) return;
    try {
      if (text === baselineText) {
        target.removeItem(storageKey);
        persisted.current = null;
      } else {
        target.setItem(storageKey, text);
        persisted.current = text;
      }
    } catch {
      // 配额超限或存储禁用：保留内存态，不抛给调用方。
    }
  }, [value, isHydrated, storageKey, storage, serializeValue, baselineText]);

  const reset = React.useCallback(() => {
    const target = resolveStorage(storage);
    setValue(baseline);
    if (!storageKey || !target || !key) return;
    try {
      target.removeItem(storageKey);
      removeStaleVersions(target, key, storageKey);
      persisted.current = null;
    } catch {
      // 清理失败不影响内存态。
    }
  }, [baseline, key, storage, storageKey]);

  return {
    value,
    setValue,
    baseline,
    isDirty: serializeValue(value) !== baselineText,
    isHydrated,
    reset,
  };
}

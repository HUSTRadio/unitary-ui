export type PrefetchSnapshot<T> = Readonly<
  | { status: "idle" | "loading"; data: undefined; error: undefined }
  | { status: "ready"; data: T; error: undefined }
  | { status: "error"; data: undefined; error: unknown }
>;

export interface PrefetchResource<T> {
  load(): Promise<T>;
  prefetch(): Promise<void>;
  invalidate(): void;
  getSnapshot(): PrefetchSnapshot<T>;
  subscribe(listener: () => void): () => void;
}

/** 独立资源缓存，不在创建或渲染时加载。 / Caller-owned cache; creation starts no work. */
export function createPrefetch<T>(loader: (signal: AbortSignal) => T | PromiseLike<T>): PrefetchResource<T> {
  let snapshot: PrefetchSnapshot<T> = { status: "idle", data: undefined, error: undefined };
  let pending: Promise<T> | undefined;
  let controller: AbortController | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: PrefetchSnapshot<T>) => {
    snapshot = next;
    for (const listener of [...listeners]) listener();
  };
  const load = (): Promise<T> => {
    if (pending) return pending;
    const request = new AbortController();
    controller = request;
    // 先保存 Promise，再通知订阅者；重入或多个触发共享同一次工作。
    // Store the promise before notifying; reentrant and concurrent calls reuse it.
    const result = Promise.resolve().then(() => {
      if (request.signal.aborted) throw request.signal.reason;
      return loader(request.signal);
    }).then(
      (data) => {
        if (pending === result) {
          controller = undefined;
          publish({ status: "ready", data, error: undefined });
        }
        return data;
      },
      (error: unknown) => {
        if (pending === result) {
          pending = undefined;
          controller = undefined;
          publish({ status: "error", data: undefined, error });
        }
        throw error;
      },
    );
    pending = result;
    publish({ status: "loading", data: undefined, error: undefined });
    return result;
  };
  return {
    load,
    prefetch: () => load().then(() => undefined, () => undefined),
    invalidate() {
      const previous = controller;
      pending = undefined;
      controller = undefined;
      publish({ status: "idle", data: undefined, error: undefined });
      previous?.abort();
    },
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

/** 内部自动触发共用的省流量检查；手动 load 始终可用。
 * Shared automatic-trigger check; explicit load remains available. */
export function allowAutomaticPrefetch(respectDataSaver = true): boolean {
  if (!respectDataSaver || typeof navigator === "undefined") return true;
  return !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
}

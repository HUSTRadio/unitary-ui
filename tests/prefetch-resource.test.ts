import { describe, expect, test, vi } from "vitest";
import { createPrefetch } from "../src/lib/prefetch";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

describe("prefetch resource", () => {
  test("starts lazily, shares pending work and reuses a successful promise", async () => {
    const task = deferred<string>();
    const loader = vi.fn(() => task.promise);
    const resource = createPrefetch(loader);
    expect(loader).not.toHaveBeenCalled();
    const initial = resource.getSnapshot();
    expect(resource.getSnapshot()).toBe(initial);
    const prefetch = resource.prefetch();
    const first = resource.load();
    expect(resource.load()).toBe(first);
    expect(resource.getSnapshot().status).toBe("loading");
    task.resolve("result");
    await prefetch;
    expect(await first).toBe("result");
    expect(resource.load()).toBe(first);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(resource.getSnapshot()).toEqual({ status: "ready", data: "result", error: undefined });
  });

  test("handles background failure, exposes the error and retries on demand", async () => {
    const error = new Error("offline");
    const loader = vi.fn().mockRejectedValueOnce(error).mockResolvedValue("retry");
    const resource = createPrefetch(loader);
    await expect(resource.prefetch()).resolves.toBeUndefined();
    expect(resource.getSnapshot().error).toBe(error);
    expect(await resource.load()).toBe("retry");
    expect(loader).toHaveBeenCalledTimes(2);
  });

  test("explicit loading rejects synchronous loader errors", async () => {
    const resource = createPrefetch(() => { throw new Error("invalid input"); });
    await expect(resource.load()).rejects.toThrow("invalid input");
    expect(resource.getSnapshot().status).toBe("error");
  });

  test("invalidation aborts old work and ignores stale completion", async () => {
    const old = deferred<string>();
    const fresh = deferred<string>();
    const signals: AbortSignal[] = [];
    const loader = vi.fn((signal: AbortSignal) => {
      signals.push(signal);
      return signals.length === 1 ? old.promise : fresh.promise;
    });
    const resource = createPrefetch(loader);
    const oldLoad = resource.load();
    await Promise.resolve();
    resource.invalidate();
    expect(signals[0].aborted).toBe(true);
    const freshLoad = resource.load();
    expect(freshLoad).not.toBe(oldLoad);
    fresh.resolve("fresh");
    await freshLoad;
    old.resolve("old");
    expect(await oldLoad).toBe("old");
    expect(resource.getSnapshot().data).toBe("fresh");
  });

  test("a stale rejection cannot evict a newer successful result", async () => {
    const old = deferred<string>();
    const resource = createPrefetch(vi.fn().mockReturnValueOnce(old.promise).mockResolvedValue("fresh"));
    const background = resource.prefetch();
    await Promise.resolve();
    resource.invalidate();
    await resource.load();
    old.reject(new Error("stale"));
    await background;
    expect(resource.getSnapshot().status).toBe("ready");
    expect(await resource.load()).toBe("fresh");
  });

  test("invalidation before the loader starts cancels that attempt", async () => {
    const loader = vi.fn(() => "value");
    const resource = createPrefetch(loader);
    const background = resource.prefetch();
    resource.invalidate();
    await background;
    expect(loader).not.toHaveBeenCalled();
    expect(resource.getSnapshot().status).toBe("idle");
  });

  test("notifies shared subscribers and releases unsubscribed listeners", async () => {
    const resource = createPrefetch(() => "value");
    const observer = vi.fn();
    const unsubscribe = resource.subscribe(observer);
    await resource.load();
    expect(observer).toHaveBeenCalledTimes(2);
    unsubscribe();
    resource.invalidate();
    expect(observer).toHaveBeenCalledTimes(2);
  });

  test("a subscriber loading the same resource reuses the original request", async () => {
    const loader = vi.fn(() => "value");
    const resource = createPrefetch(loader);
    let reentrant: Promise<string> | undefined;
    resource.subscribe(() => {
      if (resource.getSnapshot().status === "loading") reentrant = resource.load();
    });
    const first = resource.load();
    expect(reentrant).toBe(first);
    await first;
    expect(loader).toHaveBeenCalledTimes(1);
  });
});

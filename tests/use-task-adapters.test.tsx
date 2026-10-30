// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  nextBackoffDelay,
  useEventStream,
  usePolling,
  type EventStreamLike,
  type UseEventStreamOptions,
  type UseEventStreamResult,
  type UsePollingOptions,
  type UsePollingResult,
} from "@/lib/use-task";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;
let polling: UsePollingResult<number>;
let streaming: UseEventStreamResult;

function PollingHarness({ options }: { options: UsePollingOptions<number> }) {
  polling = usePolling(options);
  return null;
}

function StreamHarness({ options }: { options: UseEventStreamOptions<unknown> }) {
  streaming = useEventStream(options);
  return null;
}

async function mount(node: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(node);
    await Promise.resolve();
  });
}

async function flush(ms = 0) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("nextBackoffDelay", () => {
  test("grows exponentially and caps at maxDelay", () => {
    expect(nextBackoffDelay(0)).toBe(1000);
    expect(nextBackoffDelay(1)).toBe(1000);
    expect(nextBackoffDelay(2)).toBe(2000);
    expect(nextBackoffDelay(3)).toBe(4000);
    expect(nextBackoffDelay(99)).toBe(30_000);
    expect(nextBackoffDelay(3, { initialDelay: 100, factor: 3, maxDelay: 500 })).toBe(500);
    expect(nextBackoffDelay(Number.NaN)).toBe(1000);
  });
});

describe("usePolling", () => {
  test("fetches immediately, then on the interval", async () => {
    const fetcher = vi.fn(async () => 1);
    await mount(createElement(PollingHarness, { options: { fetcher, interval: 1000 } }));

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(polling.data).toBe(1);
    expect(polling.isPolling).toBe(true);

    await flush(1000);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test("stops once isDone reports a terminal value", async () => {
    const fetcher = vi.fn(async () => 5);
    await mount(
      createElement(PollingHarness, { options: { fetcher, interval: 1000, isDone: (v) => v === 5 } }),
    );

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(polling.isPolling).toBe(false);

    await flush(5000);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("backs off exponentially after failures", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    });
    await mount(
      createElement(PollingHarness, {
        options: { fetcher, interval: 1000, backoff: { initialDelay: 100, factor: 2, maxDelay: 400 } },
      }),
    );

    expect(fetcher).toHaveBeenCalledTimes(1);
    await flush(100);
    expect(fetcher).toHaveBeenCalledTimes(2);
    await flush(200);
    expect(fetcher).toHaveBeenCalledTimes(3);
    await flush(400);
    expect(fetcher).toHaveBeenCalledTimes(4);
    // 封顶后保持 400ms。
    await flush(400);
    expect(fetcher).toHaveBeenCalledTimes(5);
    expect(polling.error).toBeInstanceOf(Error);
  });

  test("aborts the in-flight request on unmount", async () => {
    let received: AbortSignal | undefined;
    const fetcher = vi.fn(
      (signal: AbortSignal) =>
        new Promise<number>(() => {
          received = signal;
        }),
    );
    await mount(createElement(PollingHarness, { options: { fetcher } }));

    expect(received?.aborted).toBe(false);
    await act(async () => root?.unmount());
    root = undefined;
    expect(received?.aborted).toBe(true);
  });

  test("stays idle when disabled and resumes through refresh", async () => {
    const fetcher = vi.fn(async () => 2);
    await mount(createElement(PollingHarness, { options: { fetcher, enabled: false } }));
    expect(fetcher).not.toHaveBeenCalled();
    expect(polling.isPolling).toBe(false);
    await flush(5000);
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("stops on demand and resumes on refresh", async () => {
    const fetcher = vi.fn(async () => 3);
    await mount(createElement(PollingHarness, { options: { fetcher, interval: 1000 } }));
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => polling.stop());
    expect(polling.isPolling).toBe(false);
    await flush(5000);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => polling.refresh());
    await flush(0);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(polling.isPolling).toBe(true);
  });

  test("never overlaps requests while one is in flight", async () => {
    let resolve: ((value: number) => void) | undefined;
    const fetcher = vi.fn(() => new Promise<number>((done) => (resolve = done)));
    await mount(createElement(PollingHarness, { options: { fetcher, interval: 100 } }));

    await flush(500);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve?.(1);
      await Promise.resolve();
    });
    await flush(100);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});

describe("useEventStream", () => {
  function createStream() {
    const listeners = new Map<string, (event: unknown) => void>();
    const stream = {
      closed: false as boolean,
      addEventListener(type: "open" | "message" | "error", listener: (event: unknown) => void) {
        listeners.set(type, listener);
      },
      close() {
        stream.closed = true;
      },
      emit(type: "open" | "message" | "error", event: unknown) {
        listeners.get(type)?.(event);
      },
    } satisfies EventStreamLike & { closed: boolean; emit: (type: "open" | "message" | "error", event: unknown) => void };
    return stream;
  }

  test("parses messages and reports connection state", async () => {
    const stream = createStream();
    const onMessage = vi.fn();
    await mount(
      createElement(StreamHarness, {
        options: {
          url: "/events",
          onMessage,
          eventSourceFactory: () => stream,
        },
      }),
    );

    await act(async () => stream.emit("open", {}));
    expect(streaming.isConnected).toBe(true);

    await act(async () => stream.emit("message", { data: JSON.stringify({ id: 7 }) }));
    expect(onMessage).toHaveBeenCalledWith({ id: 7 });
    expect(streaming.error).toBeNull();
  });

  test("reconnects with backoff after a disconnect", async () => {
    const streams: ReturnType<typeof createStream>[] = [];
    const factory = vi.fn(() => {
      const stream = createStream();
      streams.push(stream);
      return stream;
    });
    await mount(
      createElement(StreamHarness, {
        options: { url: "/events", onMessage: vi.fn(), eventSourceFactory: factory, backoff: { initialDelay: 100 } },
      }),
    );
    expect(factory).toHaveBeenCalledTimes(1);

    await act(async () => streams[0].emit("error", { type: "error" }));
    expect(streams[0].closed).toBe(true);
    expect(streaming.isConnected).toBe(false);

    await flush(100);
    expect(factory).toHaveBeenCalledTimes(2);

    await flush(200);
    await act(async () => streams[1].emit("error", { type: "error" }));
    await flush(200);
    expect(factory).toHaveBeenCalledTimes(3);
  });

  test("closes the stream on unmount", async () => {
    const stream = createStream();
    await mount(
      createElement(StreamHarness, {
        options: { url: "/events", onMessage: vi.fn(), eventSourceFactory: () => stream },
      }),
    );
    await act(async () => root?.unmount());
    root = undefined;
    expect(stream.closed).toBe(true);
  });

  test("stops reconnecting after close and revives on reconnect", async () => {
    const factory = vi.fn(() => createStream());
    await mount(
      createElement(StreamHarness, {
        options: { url: "/events", onMessage: vi.fn(), eventSourceFactory: factory, backoff: { initialDelay: 50 } },
      }),
    );

    await act(async () => streaming.close());
    expect(streaming.isConnected).toBe(false);
    await flush(1000);
    expect(factory).toHaveBeenCalledTimes(1);

    await act(async () => streaming.reconnect());
    expect(factory).toHaveBeenCalledTimes(2);
  });

  test("reports a parse failure without dropping the connection", async () => {
    const stream = createStream();
    const onError = vi.fn();
    const onMessage = vi.fn();
    await mount(
      createElement(StreamHarness, {
        options: { url: "/events", onMessage, onError, eventSourceFactory: () => stream },
      }),
    );

    await act(async () => stream.emit("open", {}));
    await act(async () => stream.emit("message", { data: "{not json" }));

    expect(onMessage).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(streaming.isConnected).toBe(true);
  });

  test("supports a custom parser and skips non-string payloads", async () => {
    const stream = createStream();
    const onMessage = vi.fn();
    await mount(
      createElement(StreamHarness, {
        options: {
          url: () => "/events",
          onMessage,
          parse: (raw) => raw.toUpperCase(),
          eventSourceFactory: () => stream,
        },
      }),
    );

    await act(async () => stream.emit("message", { data: "ping" }));
    expect(onMessage).toHaveBeenCalledWith("PING");

    await act(async () => stream.emit("message", { data: new Uint8Array([1]) }));
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});

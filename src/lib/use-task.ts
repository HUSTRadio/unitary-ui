"use client";

import * as React from "react";

/**
 * Task 数据适配器（M2-05）。
 *
 * 只提供「怎么拿数据」的两个最小适配器：轮询与事件流。它们不缓存、不共享状态、
 * 不引入通用 async store——每个 hook 实例只管理自己的一次订阅生命周期。
 *
 * 共同约定：
 * - 统一退避（`nextBackoffDelay`），失败后按指数增长并封顶；
 * - 每次请求/连接都受清理保护：卸载、`stop`/`close`、参数变化都会 abort 或 close；
 * - 终态或 `enabled=false` 时不发请求，也不残留定时器。
 */

export interface BackoffOptions {
  /** 首次重试延迟（ms），默认 1000。 */
  initialDelay?: number;
  /** 延迟上限（ms），默认 30000。 */
  maxDelay?: number;
  /** 增长因子，默认 2。 */
  factor?: number;
}

const DEFAULT_BACKOFF: Required<BackoffOptions> = {
  initialDelay: 1000,
  maxDelay: 30_000,
  factor: 2,
};

/** 第 `attempt` 次失败后的等待时间（attempt 从 1 开始），指数增长并封顶。 */
export function nextBackoffDelay(attempt: number, options: BackoffOptions = {}): number {
  const { initialDelay, maxDelay, factor } = { ...DEFAULT_BACKOFF, ...options };
  if (!Number.isFinite(attempt) || attempt <= 1) return initialDelay;
  const raw = initialDelay * Math.pow(factor, attempt - 1);
  if (!Number.isFinite(raw)) return maxDelay;
  return Math.min(maxDelay, Math.round(raw));
}

export interface UsePollingOptions<T> {
  /** 拉取一次数据；收到 AbortSignal 时应尽快放弃。 */
  fetcher: (signal: AbortSignal) => Promise<T>;
  /** 正常间隔（ms），默认 2000。 */
  interval?: number;
  /** 失败退避参数。 */
  backoff?: BackoffOptions;
  /** 返回 true 时停止轮询（例如已到达终态）。 */
  isDone?: (value: T) => boolean;
  onData?: (value: T) => void;
  onError?: (error: unknown) => void;
  /** 挂载后立即拉取一次，默认 true。 */
  immediate?: boolean;
  /** false 时不发请求，默认 true。 */
  enabled?: boolean;
}

export interface UsePollingResult<T> {
  data: T | undefined;
  /** 最近一次失败；成功后清空。 */
  error: unknown;
  /** 是否仍在调度下一次请求。 */
  isPolling: boolean;
  /** 立刻拉取一次并恢复轮询。 */
  refresh: () => void;
  /** 停止轮询（保留已获得的数据，不再发请求）。 */
  stop: () => void;
}

/** 轮询：单飞请求 + 失败退避 + 卸载 abort。 */
export function usePolling<T>(options: UsePollingOptions<T>): UsePollingResult<T> {
  const {
    fetcher,
    interval = 2000,
    backoff,
    isDone,
    onData,
    onError,
    immediate = true,
    enabled = true,
  } = options;

  const [data, setData] = React.useState<T | undefined>(undefined);
  const [error, setError] = React.useState<unknown>(null);
  const [isPolling, setIsPolling] = React.useState(false);
  const [stopped, setStopped] = React.useState(false);
  const [nonce, setNonce] = React.useState(0);

  // 回调与判定放进 ref，避免每次渲染都重启调度。
  const latest = React.useRef({ fetcher, isDone, onData, onError });
  latest.current = { fetcher, isDone, onData, onError };

  React.useEffect(() => {
    if (!enabled || stopped) {
      setIsPolling(false);
      return;
    }
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let attempts = 0;
    let inFlight = false;
    setIsPolling(true);

    const schedule = (delay: number) => {
      if (disposed) return;
      timer = setTimeout(run, delay);
    };

    const run = async () => {
      if (disposed || inFlight) return;
      inFlight = true;
      controller = new AbortController();
      const { fetcher: fetchOnce, isDone: done, onData: emit, onError: fail } = latest.current;
      try {
        const value = await fetchOnce(controller.signal);
        if (disposed) return;
        attempts = 0;
        setData(value);
        setError(null);
        emit?.(value);
        if (done?.(value)) {
          setIsPolling(false);
          return;
        }
        schedule(interval);
      } catch (caught) {
        if (disposed) return;
        attempts += 1;
        setError(caught);
        fail?.(caught);
        schedule(nextBackoffDelay(attempts, backoff));
      } finally {
        inFlight = false;
      }
    };

    if (immediate) void run();
    else schedule(interval);

    return () => {
      disposed = true;
      if (timer !== undefined) clearTimeout(timer);
      controller?.abort();
    };
  }, [
    enabled,
    stopped,
    interval,
    immediate,
    backoff?.initialDelay,
    backoff?.maxDelay,
    backoff?.factor,
    nonce,
  ]);

  const refresh = React.useCallback(() => {
    setStopped(false);
    setNonce((value) => value + 1);
  }, []);

  const stop = React.useCallback(() => {
    setStopped(true);
    setIsPolling(false);
  }, []);

  return { data, error, isPolling, refresh, stop };
}

/** 事件流最小接口：便于注入 mock，无需依赖真实 EventSource。 */
export interface EventStreamLike {
  addEventListener(type: "open" | "message" | "error", listener: (event: unknown) => void): void;
  close(): void;
}

export interface UseEventStreamOptions<T> {
  /** 流地址；返回字符串的函数便于随会话变化。 */
  url: string | (() => string);
  /** 解析一条消息；默认 JSON.parse。 */
  parse?: (raw: string) => T;
  onMessage: (value: T) => void;
  onOpen?: () => void;
  onError?: (error: unknown) => void;
  /** 注入流实现；默认使用全局 EventSource。 */
  eventSourceFactory?: (url: string) => EventStreamLike;
  /** 断连退避参数。 */
  backoff?: BackoffOptions;
  /** false 时不建立连接，默认 true。 */
  enabled?: boolean;
}

export interface UseEventStreamResult {
  /** 当前是否已连接。 */
  isConnected: boolean;
  /** 最近一次连接或解析错误。 */
  error: unknown;
  /** 立即重连（重置退避与关闭状态）。 */
  reconnect: () => void;
  /** 主动关闭，不再重连。 */
  close: () => void;
}

function defaultEventSourceFactory(url: string): EventStreamLike {
  return new EventSource(url) as unknown as EventStreamLike;
}

/** 事件流订阅：断连退避重连 + 卸载关闭。 */
export function useEventStream<T>(options: UseEventStreamOptions<T>): UseEventStreamResult {
  const {
    url,
    parse,
    onMessage,
    onOpen,
    onError,
    eventSourceFactory,
    backoff,
    enabled = true,
  } = options;

  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [closed, setClosed] = React.useState(false);
  const [nonce, setNonce] = React.useState(0);

  const latest = React.useRef({ parse, onMessage, onOpen, onError, eventSourceFactory });
  latest.current = { parse, onMessage, onOpen, onError, eventSourceFactory };

  const resolvedUrl = typeof url === "function" ? url() : url;

  React.useEffect(() => {
    if (!enabled || closed) {
      setIsConnected(false);
      return;
    }
    const factory = latest.current.eventSourceFactory ?? defaultEventSourceFactory;
    let disposed = false;
    let stream: EventStreamLike | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const connect = () => {
      if (disposed) return;
      stream = factory(resolvedUrl);
      stream.addEventListener("open", () => {
        if (disposed) return;
        attempts = 0;
        setError(null);
        setIsConnected(true);
        latest.current.onOpen?.();
      });
      stream.addEventListener("message", (event) => {
        if (disposed) return;
        const raw = (event as { data?: unknown }).data;
        if (typeof raw !== "string") return;
        try {
          const value = latest.current.parse ? latest.current.parse(raw) : (JSON.parse(raw) as T);
          latest.current.onMessage(value);
        } catch (caught) {
          setError(caught);
          latest.current.onError?.(caught);
        }
      });
      stream.addEventListener("error", (event) => {
        if (disposed) return;
        setIsConnected(false);
        setError(event);
        latest.current.onError?.(event);
        stream?.close();
        attempts += 1;
        timer = setTimeout(connect, nextBackoffDelay(attempts, backoff));
      });
    };

    connect();

    return () => {
      disposed = true;
      if (timer !== undefined) clearTimeout(timer);
      stream?.close();
    };
  }, [enabled, closed, resolvedUrl, backoff?.initialDelay, backoff?.maxDelay, backoff?.factor, nonce]);

  const reconnect = React.useCallback(() => {
    setClosed(false);
    setNonce((value) => value + 1);
  }, []);

  const close = React.useCallback(() => {
    setClosed(true);
    setIsConnected(false);
  }, []);

  return { isConnected, error, reconnect, close };
}

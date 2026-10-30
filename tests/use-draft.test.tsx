// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vitest";

import { draftStorageKey, useDraft, type UseDraftOptions, type UseDraftResult } from "@/lib/use-draft";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** 内存 storage：记录调用次数与内容，并支持枚举（模拟 Web Storage）。 */
function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  const calls = { get: 0, set: [] as Array<[string, string]>, remove: [] as string[] };
  const storage = {
    calls,
    getItem(name: string) {
      calls.get += 1;
      return map.has(name) ? (map.get(name) as string) : null;
    },
    setItem(name: string, value: string) {
      calls.set.push([name, value]);
      map.set(name, value);
    },
    removeItem(name: string) {
      calls.remove.push(name);
      map.delete(name);
    },
    get length() {
      return map.size;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    dump: () => Object.fromEntries(map),
  };
  return storage;
}

let container: HTMLDivElement;
let root: Root | undefined;
let latest: UseDraftResult<string>;

function Harness({ options }: { options: UseDraftOptions<string> }) {
  latest = useDraft(options);
  return null;
}

function mount(options: UseDraftOptions<string>) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(createElement(Harness, { options }));
  });
  return root;
}

function rerender(options: UseDraftOptions<string>) {
  act(() => {
    root?.render(createElement(Harness, { options }));
  });
}

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("useDraft persistence semantics", () => {
  test("never writes before the first change", () => {
    const storage = memoryStorage();
    mount({ key: "feedback", initial: "", storage });

    expect(latest.isHydrated).toBe(true);
    expect(latest.value).toBe("");
    expect(storage.calls.set).toEqual([]);
    expect(storage.calls.remove).toEqual([draftStorageKey("feedback", 1)]);
  });

  test("restores a stored draft without writing it back", () => {
    const storage = memoryStorage({ "unitary-draft/v1/feedback": JSON.stringify("half written") });
    mount({ key: "feedback", initial: "", storage });

    expect(latest.value).toBe("half written");
    expect(latest.isDirty).toBe(true);
    expect(storage.calls.set).toEqual([]);
  });

  test("writes on change and deletes when returning to the baseline", () => {
    const storage = memoryStorage();
    mount({ key: "feedback", initial: "", storage });

    act(() => latest.setValue("first"));
    expect(storage.calls.set).toEqual([["unitary-draft/v1/feedback", JSON.stringify("first")]]);
    expect(latest.isDirty).toBe(true);

    act(() => latest.setValue(""));
    expect(storage.dump()).toEqual({});
    expect(latest.isDirty).toBe(false);
  });

  test("treats corrupt JSON as no draft and keeps working", () => {
    const storage = memoryStorage({ "unitary-draft/v1/feedback": "{oops" });
    mount({ key: "feedback", initial: "start", storage });

    expect(latest.value).toBe("start");
    expect(latest.isHydrated).toBe(true);

    act(() => latest.setValue("later"));
    expect(storage.dump()).toEqual({ "unitary-draft/v1/feedback": JSON.stringify("later") });
  });

  test("ignores records from another schema version", () => {
    const storage = memoryStorage({ "unitary-draft/v1/feedback": JSON.stringify("old shape") });
    mount({ key: "feedback", version: 2, initial: "", storage });

    expect(latest.value).toBe("");
    expect(storage.calls.set).toEqual([]);
  });

  test("reset returns to the baseline and drops every version of its own namespace", () => {
    const storage = memoryStorage({
      "unitary-draft/v1/feedback": JSON.stringify("old"),
      "unitary-draft/v2/feedback": JSON.stringify("current"),
      "unitary-draft/v2/other-form": JSON.stringify("keep me"),
      "unrelated-key": "keep me too",
    });
    mount({ key: "feedback", version: 2, initial: "", storage });
    expect(latest.value).toBe("current");

    act(() => latest.reset());

    expect(latest.value).toBe("");
    expect(latest.isDirty).toBe(false);
    expect(storage.dump()).toEqual({
      "unitary-draft/v2/other-form": JSON.stringify("keep me"),
      "unrelated-key": "keep me too",
    });
  });

  test("survives a quota failure without losing the in-memory value", () => {
    const storage = memoryStorage();
    storage.setItem = vi.fn(() => {
      throw new Error("QuotaExceededError");
    });
    mount({ key: "feedback", initial: "", storage });

    expect(() => act(() => latest.setValue("blocked"))).not.toThrow();
    expect(latest.value).toBe("blocked");
    expect(latest.isDirty).toBe(true);
  });

  test("falls back to plain state without touching storage when disabled", () => {
    const storage = memoryStorage();
    mount({ key: "feedback", initial: "draft", storage: null });

    act(() => latest.setValue("edited"));
    expect(latest.value).toBe("edited");
    expect(storage.calls.get).toBe(0);
    expect(storage.calls.set).toEqual([]);
  });

  test("rehydrates when the namespace changes and leaves the old record alone", () => {
    const storage = memoryStorage({
      "unitary-draft/v1/first": JSON.stringify("first draft"),
      "unitary-draft/v1/second": JSON.stringify("second draft"),
    });
    mount({ key: "first", initial: "", storage });
    expect(latest.value).toBe("first draft");

    rerender({ key: "second", initial: "", storage });
    expect(latest.value).toBe("second draft");

    act(() => latest.setValue("second edited"));
    expect(storage.dump()["unitary-draft/v1/first"]).toBe(JSON.stringify("first draft"));
  });

  test("stays deterministic on the server and reads nothing", () => {
    const storage = memoryStorage({ "unitary-draft/v1/feedback": JSON.stringify("stored") });
    const markup = renderToStaticMarkup(
      createElement(Harness, { options: { key: "feedback", initial: "server default", storage } }),
    );

    expect(markup).toBe("");
    expect(latest.value).toBe("server default");
    expect(latest.isHydrated).toBe(false);
    expect(storage.calls.get).toBe(0);
    expect(storage.calls.set).toEqual([]);
  });

  test("never persists without a namespace", () => {
    const storage = memoryStorage();
    mount({ initial: "", storage });

    act(() => latest.setValue("anonymous"));
    expect(latest.value).toBe("anonymous");
    expect(storage.calls.get).toBe(0);
    expect(storage.calls.set).toEqual([]);
  });

  test("supports a custom serializer", () => {
    const storage = memoryStorage();
    mount({
      key: "feedback",
      initial: "",
      storage,
      serialize: (value) => `raw:${value}`,
      deserialize: (raw) => raw.replace(/^raw:/, ""),
    });

    act(() => latest.setValue("csv"));
    expect(storage.dump()).toEqual({ "unitary-draft/v1/feedback": "raw:csv" });
    rerender({
      key: "feedback",
      initial: "",
      storage,
      serialize: (value) => `raw:${value}`,
      deserialize: (raw) => raw.replace(/^raw:/, ""),
    });
    expect(latest.value).toBe("csv");
  });
});

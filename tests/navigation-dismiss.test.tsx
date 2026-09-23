// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { useDismissOnNavigate } from "@/lib/navigation";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  document.body.innerHTML = "";
  root = undefined;
  container = undefined;
});

function Probe({ onDismiss, enabled }: { onDismiss: () => void; enabled?: boolean }) {
  useDismissOnNavigate(onDismiss, enabled);
  return null;
}

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(node));
}

const fireHashChange = () => act(() => void window.dispatchEvent(new HashChangeEvent("hashchange")));
const firePopState = () => act(() => void window.dispatchEvent(new PopStateEvent("popstate")));

/**
 * HIG-AUD-017：库层「导航即关闭」原语（不耦合路由库，监听 hashchange + popstate）。
 */
describe("useDismissOnNavigate", () => {
  test("fires for both hashchange and popstate", () => {
    const onDismiss = vi.fn();
    mount(<Probe onDismiss={onDismiss} />);

    fireHashChange();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    firePopState();
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  test("does not subscribe while disabled", () => {
    const onDismiss = vi.fn();
    mount(<Probe onDismiss={onDismiss} enabled={false} />);

    fireHashChange();
    firePopState();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test("unsubscribes on unmount", () => {
    const onDismiss = vi.fn();
    mount(<Probe onDismiss={onDismiss} />);
    act(() => root?.unmount());
    root = undefined;

    fireHashChange();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test("always calls the latest callback (no stale closure)", () => {
    const first = vi.fn();
    const second = vi.fn();
    mount(<Probe onDismiss={first} />);
    act(() => root?.render(<Probe onDismiss={second} />));

    firePopState();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

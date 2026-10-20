// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { waitForExitMotion } from "../src/lib/exit-motion";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); document.body.innerHTML = ""; });

function pendingMotion() {
  let resolve!: () => void;
  let reject!: () => void;
  const finished = new Promise<void>((yes, no) => { resolve = yes; reject = () => no(new Error("cancelled")); });
  return { finished, resolve, reject, playState: "running", effect: { getTiming: () => ({ iterations: 1 }) } };
}

test("waits for every actual effect, including a locally extended exit", async () => {
  const node = document.createElement("div");
  const first = pendingMotion(), last = pendingMotion();
  node.getAnimations = () => [first, last] as unknown as Animation[];
  const done = vi.fn();
  waitForExitMotion(node, done);
  first.resolve();
  await Promise.resolve(); await Promise.resolve();
  expect(done).not.toHaveBeenCalled();
  last.resolve();
  await Promise.resolve(); await Promise.resolve();
  expect(done).toHaveBeenCalledTimes(1);
});

test("a cancelled old exit cannot remove a reopened element", async () => {
  const node = document.createElement("div"), motion = pendingMotion(), done = vi.fn();
  node.getAnimations = () => [motion] as unknown as Animation[];
  const stop = waitForExitMotion(node, done);
  stop(); motion.reject();
  await Promise.resolve(); await Promise.resolve();
  expect(done).not.toHaveBeenCalled();
});

test("zero motion completes without a fixed wait", async () => {
  const node = document.createElement("div"), done = vi.fn();
  node.getAnimations = () => [];
  waitForExitMotion(node, done);
  await Promise.resolve();
  expect(done).toHaveBeenCalledOnce();
});

test("fallback reads seconds, milliseconds and delays and ignores child events", () => {
  vi.useFakeTimers();
  const node = document.createElement("div"), child = node.appendChild(document.createElement("span"));
  Object.assign(node.style, { transitionDuration: ".4s, 150ms", transitionDelay: "50ms" });
  const done = vi.fn();
  waitForExitMotion(node, done);
  child.dispatchEvent(new Event("transitionend", { bubbles: true }));
  vi.advanceTimersByTime(449);
  expect(done).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(done).toHaveBeenCalledOnce();
});

test("enabling reduced motion completes an in-flight exit immediately", () => {
  const media = new EventTarget() as EventTarget & { matches: boolean };
  media.matches = false;
  vi.stubGlobal("matchMedia", () => media);
  const node = document.createElement("div"), done = vi.fn(), motion = pendingMotion();
  node.getAnimations = () => [motion] as unknown as Animation[];
  waitForExitMotion(node, done);
  media.matches = true;
  media.dispatchEvent(new Event("change"));
  expect(done).toHaveBeenCalledOnce();
  vi.unstubAllGlobals();
});

// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/**
 * HIG-AUD-034：胶囊的「退场驻留」是一个**跨文件不变量**——JS 用 `CAPSULE_EXIT_MS`
 * 决定节点在退场动画播放期间保留多久，CSS 用 `duration-(--uni-duration-fast)` 决定
 * 动画时长。两者一旦漂移（例如把 token 从 150ms 调到 250ms 而常量没跟），节点会在
 * 动画播完前被卸载，退场被截断——这正是本条要防的「闪现消失」形态之一。
 *
 * 断言的是「常量 == token 值」与「胶囊确实消费该 token」，而不是源码字符串本身。
 */
const editMenu = readFileSync(
  new URL("../src/components/ui/edit-menu.tsx", import.meta.url),
  "utf8",
);
const styles = readFileSync(new URL("../src/styles/index.css", import.meta.url), "utf8");

function exitResidencyMs() {
  const match = /CAPSULE_EXIT_MS\s*=\s*(\d+)/.exec(editMenu);
  expect(match, "edit-menu.tsx 必须定义 CAPSULE_EXIT_MS").not.toBeNull();
  return Number(match![1]);
}

function fastDurationMs() {
  const match = /--uni-duration-fast:\s*(\d+)ms/.exec(styles);
  expect(match, "index.css 必须定义 --uni-duration-fast").not.toBeNull();
  return Number(match![1]);
}

describe("EditMenu 退场驻留时长与动画时长同源（HIG-AUD-034）", () => {
  test("退场驻留常量等于胶囊所消费的时长 token", () => {
    expect(exitResidencyMs()).toBe(fastDurationMs());
  });

  test("胶囊把该 token 同时用于动画时长，并保留 reduced-motion 免动画", () => {
    // 只有两个值同源，"驻留一个动画时长"这句话才成立
    expect(editMenu).toContain("duration-(--uni-duration-fast)");
    expect(editMenu).toContain("motion-reduce:animate-none!");
  });

  test("退场分支同时声明退场动画与事件穿透，避免退场期间拦住新选区", () => {
    // 退场节点仍在 DOM 中且覆盖在选区之上，必须 pointer-events-none
    const exitClasses = /exiting\s*\?\s*"([^"]+)"/.exec(editMenu);
    expect(exitClasses, "胶囊必须有 exiting 分支").not.toBeNull();
    expect(exitClasses![1]).toContain("animate-out");
    expect(exitClasses![1]).toContain("pointer-events-none");
  });

  test("退场状态对测试可观测（data-exiting）", () => {
    expect(editMenu).toContain('data-exiting={exiting ? "" : undefined}');
  });
});

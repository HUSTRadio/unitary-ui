// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const editMenu = readFileSync(new URL("../src/components/ui/edit-menu.tsx", import.meta.url), "utf8");

describe("EditMenu 退场驻留时长与动画时长同源（HIG-AUD-034）", () => {
  test("uses actual motion completion rather than a fixed residency", () => {
    expect(editMenu).toContain("waitForExitMotion(capsuleRef.current, complete)");
    expect(editMenu).not.toContain("CAPSULE_EXIT_MS");
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

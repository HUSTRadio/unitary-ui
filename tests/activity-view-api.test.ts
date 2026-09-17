import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/activity-view.tsx", import.meta.url),
  "utf8",
);

/** ActivityView —— HIG 活动视图（分享面板）：目标网格 + 操作列表，复用 BottomSheet 容器。 */
describe("Activity View contract", () => {
  test("reuses the bottom sheet container instead of a second dialog", () => {
    expect(source).toContain('import { BottomSheet } from "@/components/ui/bottom-sheet"');
    expect(source).toContain("detents={[0.6]}");
    expect(source).toContain("showIndicator={false}");
    expect(source).toContain("gestures={{ resize: false, expandUp: false }}");
  });

  test("renders targets, actions, and a cancel row", () => {
    expect(source).toContain('data-slot="activity-view-targets"');
    expect(source).toContain('data-slot="activity-view-actions"');
    expect(source).toContain('data-slot="activity-view-cancel"');
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("size-12");
  });

  test("closes after a one-shot activity and localizes its labels", () => {
    expect(source).toContain("const close = React.useCallback(() => onOpenChange(false)");
    expect(source).toMatch(/action\(\);\s+close\(\);/);
    expect(source).toContain('t("Share")');
    expect(source).toContain('t("Cancel")');
  });

  test("marks destructive actions in red", () => {
    expect(source).toContain('action.destructive ? "text-[#ee0000]" : "text-gray-1000"');
  });
});

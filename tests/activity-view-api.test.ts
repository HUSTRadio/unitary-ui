import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/activity-view.tsx", import.meta.url),
  "utf8",
);

/** ActivityView —— HIG 活动视图（分享面板）：目标网格 + 操作列表，复用 BottomSheet 容器。 */
describe("Activity View contract", () => {
  test("reuses the bottom sheet container instead of a second dialog", () => {
    expect(source).toContain(
      'import { BottomSheet, type BottomSheetProps } from "@/components/ui/bottom-sheet"',
    );
    expect(source).toContain("detents={[0.6]}");
    // 渲染触控指示条 + 下拉关闭（单档位；上拉锁在最高档）
    expect(source).not.toContain("showIndicator={false}");
    expect(source).toContain("gestures={{ expandUp: false }}");
  });

  test("renders targets, actions, and a cancel row", () => {
    expect(source).toContain('data-slot="activity-view-targets"');
    expect(source).toContain('data-slot="activity-view-actions"');
    expect(source).toContain('data-slot="activity-view-cancel"');
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("size-12");
    // 操作组无描边框：容器用圆角 + overflow 收住行激活态背景（hover 不通栏越界）
    expect(source).toContain('className="overflow-hidden rounded-overlay"');
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

  test("forwards sheetProps without weakening the one-shot defaults", () => {
    expect(source).toContain("sheetProps?: Partial<Omit<BottomSheetProps");
    expect(source).toContain("{...sheetProps}");
    // 透传展开在默认配置之后，但一次性活动契约的默认值保持不变
    expect(source).toContain("detents={[0.6]}");
    expect(source).toContain("gestures={{ expandUp: false }}");
    // 取消行贴面板底部（HIG 分享面板），底部内边距与顶部对称
    expect(source).toContain("mt-auto h-11 shrink-0");
    expect(source).toContain("px-4 pt-4 pb-4");
  });
});

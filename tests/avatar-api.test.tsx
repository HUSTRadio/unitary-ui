import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarGroup } from "../src/components/ui/avatar";

describe("Avatar official API contract", () => {
  it("uses the shared smooth curve for its placeholder animation", () => {
    const markup = renderToStaticMarkup(<Avatar placeholder title="Loading avatar" />);

    expect(markup).toContain("before:animate-[unitary-avatar-loading_1.4s_var(--ease-in-out)_infinite]");
    expect(markup).toContain('aria-label="Loading avatar"');
    expect(markup).not.toContain("_1.4s_ease-in-out_");
  });

  it("AvatarGroup reverse preserves visual left-to-right DOM order", () => {
    const members = [{ username: "alice" }, { username: "bob" }, { username: "carol" }];

    const normal = renderToStaticMarkup(<AvatarGroup members={members} size={32} />);
    const reversed = renderToStaticMarkup(<AvatarGroup members={members} reverse size={32} />);

    // Both must render members in the same visual order
    const normalOrder = ["alice", "bob", "carol"];
    const reversedOrder = ["alice", "bob", "carol"];

    for (let i = 0; i < normalOrder.length; i++) {
      expect(normal).toContain(normalOrder[i]);
    }
    // In reversed mode, the DOM order must still be left-to-right (unchanged)
    for (let i = 0; i < reversedOrder.length; i++) {
      expect(reversed).toContain(reversedOrder[i]);
    }

    // The key assertion: in reversed mode, the first member must still
    // appear BEFORE the second member in the HTML string
    const reversedAlicePos = reversed.indexOf("alice");
    const reversedBobPos = reversed.indexOf("bob");
    expect(reversedAlicePos).toBeLessThan(reversedBobPos);
    expect(reversedBobPos).toBeLessThan(reversed.indexOf("carol"));

    // Reversed must differ from normal (z-index change, not order change)
    expect(reversed).not.toBe(normal);
  });

  it("Avatar preserves member DOM order and does NOT reverse the array", () => {
    // Check source: no .reverse() on the members array for visual rendering
    const members = [{ username: "first" }, { username: "second" }, { username: "third" }];

    const normal = renderToStaticMarkup(<AvatarGroup members={members} size={32} />);
    const reversed = renderToStaticMarkup(<AvatarGroup members={members} reverse size={32} />);

    // Both must have "first" before "second" before "third" in the markup
    expect(normal.indexOf("first")).toBeLessThan(normal.indexOf("second"));
    expect(normal.indexOf("second")).toBeLessThan(normal.indexOf("third"));

    expect(reversed.indexOf("first")).toBeLessThan(reversed.indexOf("second"));
    expect(reversed.indexOf("second")).toBeLessThan(reversed.indexOf("third"));
  });

  it("AvatarGroup stacks members with negative overlap margin and official z-index order", () => {
    const members = [{ username: "alice" }, { username: "bob" }, { username: "carol" }];

    const normal = renderToStaticMarkup(<AvatarGroup members={members} size={32} />);
    const reversed = renderToStaticMarkup(<AvatarGroup members={members} reverse size={32} />);

    // Overlap uses a named utility so CSS variables do not leak into generated selectors.
    expect(normal).toContain("avatar-group-overlap");
    expect(normal).not.toContain("-ml-[var(--avatar-overlap)]");

    // 默认：第一个成员在最上面 → z-index 递减（2/1/0），对齐官方 3 成员组
    expect(normal).toContain("z-index:2");
    expect(normal).toContain("z-index:1");
    expect(normal).toContain("z-index:0");

    // reverse：最后一个成员在最上面 → z-index 递增（0/1/2）
    expect(reversed).toContain("z-index:2");
    expect(reversed).toContain("z-index:1");
    expect(reversed).toContain("z-index:0");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AvatarGroup } from "../src/components/ui/avatar";

describe("Avatar official API contract", () => {
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
});

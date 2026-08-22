import { describe, expect, it, vi } from "vitest";

import { callWithCancelGuard } from "@/lib/cancel-guard";

describe("callWithCancelGuard", () => {
  it("calls handler first, returns false when defaultPrevented", () => {
    const event = { defaultPrevented: false };
    const handler = vi.fn((e: { defaultPrevented: boolean }) => {
      e.defaultPrevented = true;
    });

    const proceed = callWithCancelGuard(event, handler);

    expect(handler).toHaveBeenCalledWith(event);
    expect(proceed).toBe(false);
  });

  it("returns true when no handler or no preventDefault", () => {
    expect(callWithCancelGuard({ defaultPrevented: false }, undefined)).toBe(true);

    let called = false;
    const proceed = callWithCancelGuard({ defaultPrevented: false }, () => {
      called = true;
    });
    expect(called).toBe(true);
    expect(proceed).toBe(true);
  });
});

// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";
import {
  getToken,
  getTokens,
  setToken,
  resetTokens,
  subscribeTokens,
  useTokens,
} from "../src/lib/tokens";

describe("token API without a browser", () => {
  it("provides safe reads, writes and subscriptions", () => {
    expect(getToken("--radius")).toBe("");
    expect(getTokens(["--radius"])).toEqual({ "--radius": "" });
    expect(setToken("--radius", "8px")).toBe(false);
    expect(resetTokens()).toBe(false);
    expect(() => subscribeTokens(() => {})()).not.toThrow();
  });
  it("renders a stable empty server snapshot", () => {
    function Value() {
      const tokens = useTokens(["--radius"]);
      return <output>{tokens["--radius"]}</output>;
    }
    expect(renderToString(<Value />)).toBe("<output></output>");
  });
  it("validates selected names during server rendering", () => {
    function Invalid() {
      useTokens(["--unknown"] as never);
      return null;
    }
    expect(() => renderToString(<Invalid />)).toThrow(TypeError);
  });
});

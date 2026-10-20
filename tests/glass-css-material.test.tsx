// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { getTokens, resetTokens, setTokens } from "../src/lib/tokens";
import { GLOBAL_TOKENS, type RuntimeTokenName } from "../src/lib/token-catalog";

const removed = [
  "ior", "roughness", "thickness", "absorption", "light-azimuth", "light-intensity",
  "ambient-intensity", "ambient-color", "refraction", "edge-width",
].map(suffix => `--material-texture-glass-${suffix}`);
const opacity = "--material-texture-glass-opacity";

afterEach(() => {
  document.documentElement.style.removeProperty(opacity);
  vi.restoreAllMocks();
});

test("Glass retains visual controls and removes the obsolete physical inputs from the public catalog", () => {
  expect(Object.keys(GLOBAL_TOKENS).filter(name => name.startsWith("--material-texture-glass-")).sort()).toEqual([
    "--material-texture-glass-blur", "--material-texture-glass-opacity", "--material-texture-glass-overlay-blur",
  ]);
});

test.each(removed)("removed %s fails the entire write before changing an existing value", name => {
  setTokens({ [opacity]: "55%" });
  const changed = vi.fn();
  document.addEventListener("unitary:tokens-change", changed);
  try {
    const input = { [opacity]: "25%", [name]: "1" } as Partial<Record<RuntimeTokenName, string>>;
    expect(() => setTokens(input)).toThrow(new TypeError(`Unknown global token: ${name}`));
    expect(document.documentElement.style.getPropertyValue(opacity)).toBe("55%");
    expect(changed).not.toHaveBeenCalled();
  } finally {
    document.removeEventListener("unitary:tokens-change", changed);
  }
});

test.each(removed)("removed %s cannot be read or reset through the public token API", name => {
  setTokens({ [opacity]: "55%" });
  const names = [opacity, name] as RuntimeTokenName[];
  expect(() => getTokens(names)).toThrow(`Unknown global token: ${name}`);
  expect(() => resetTokens(names)).toThrow(`Unknown global token: ${name}`);
  expect(document.documentElement.style.getPropertyValue(opacity)).toBe("55%");
});

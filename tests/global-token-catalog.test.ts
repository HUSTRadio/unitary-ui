import { readFile } from "node:fs/promises";
import { describe, expect, expectTypeOf, it } from "vitest";
import { collectGlobalTokens, renderTokenCatalog } from "../scripts/generate-token-catalog.mjs";
import { GLOBAL_TOKENS, RUNTIME_TOKEN_NAMES, type RuntimeTokenName } from "../src/lib/token-catalog";

describe("global token catalog generation", () => {
  it("captures themes and font tiers, distinguishes mappings and excludes component-local variables", () => {
    const tokens = collectGlobalTokens(`
      @theme inline { --color-primary: var(--primary); --font-sans: "Test Font", sans-serif; }
      @theme static { --uni-duration-fast: 150ms; }
      :root { --primary: #171717; --radius: .375rem; }
      [data-theme="dark"] { --primary: #ededed; }
      html[data-font-tier="system"] { --font-sans: system-ui; }
      body { font-family: var(--font-sans); }
      [data-slot="carousel"] { --uni-page-transform: none; }
    `);
    expect(tokens["--primary"]).toMatchObject({
      value: "#171717",
      darkValue: "#ededed",
      kind: "runtime",
      group: "colors",
    });
    expect(tokens["--color-primary"].kind).toBe("mapping");
    expect(tokens["--font-sans"]).toMatchObject({
      value: '"Test Font", sans-serif',
      kind: "runtime",
      variants: { "font:system": "system-ui" },
    });
    expect(tokens["--uni-duration-fast"].group).toBe("motion");
    expect(tokens["--uni-page-transform"]).toBeUndefined();
  });
  it("keeps emitted breakpoints read-only even when declarations reference their variables", () => {
    const tokens = collectGlobalTokens(`
      @theme static { --breakpoint-panel: 60rem; --uni-duration-fast: 150ms; }
      :root { --breakpoint-panel: 60rem; }
      .panel { max-width: var(--breakpoint-panel); }
    `);
    expect(tokens["--breakpoint-panel"].kind).toBe("mapping");
    expect(tokens["--uni-duration-fast"].kind).toBe("runtime");
    const breakpoints = Object.keys(GLOBAL_TOKENS).filter((name) => name.startsWith("--breakpoint-"));
    expect(breakpoints).toHaveLength(7);
    for (const name of breakpoints) {
      expect(RUNTIME_TOKEN_NAMES).not.toContain(name);
    }
    expectTypeOf<Extract<RuntimeTokenName, `--breakpoint-${string}`>>().toBeNever();
  });
  it("is deterministic and matches the canonical stylesheet", async () => {
    const css = await readFile("src/styles/index.css", "utf8");
    const tokens = collectGlobalTokens(css);
    expect(renderTokenCatalog(tokens)).toBe(await readFile("src/lib/token-catalog.ts", "utf8"));
    expect(renderTokenCatalog(collectGlobalTokens(css))).toBe(renderTokenCatalog(tokens));
  });
});

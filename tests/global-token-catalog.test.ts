import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { collectGlobalTokens, renderTokenCatalog } from "../scripts/generate-token-catalog.mjs";

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
  it("is deterministic and matches the canonical stylesheet", async () => {
    const css = await readFile("src/styles/index.css", "utf8");
    const tokens = collectGlobalTokens(css);
    expect(renderTokenCatalog(tokens)).toBe(await readFile("src/lib/token-catalog.ts", "utf8"));
    expect(renderTokenCatalog(collectGlobalTokens(css))).toBe(renderTokenCatalog(tokens));
  });
});

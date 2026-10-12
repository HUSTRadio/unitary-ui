// @vitest-environment node
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { expect, it } from "vitest";
import { startDocsPreview } from "../scripts/lib/docs-preview.mjs";

it("serves the built artifact and range requests without source fallback", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "unitary-docs-preview-"));
  writeFileSync(path.join(directory, "index.html"), "<main>Built docs</main>");
  writeFileSync(path.join(directory, "demo.mp4"), "0123456789");
  const preview = await startDocsPreview(directory);
  try {
    const index = await fetch(preview.url);
    expect(await index.text()).toContain("Built docs");
    expect((await fetch(`${preview.url}/site/src/main.tsx`)).status).toBe(404);
    expect((await fetch(`${preview.url}/%2e%2e%2fpackage.json`)).status).toBe(404);
    const range = await fetch(`${preview.url}/demo.mp4`, { headers: { Range: "bytes=2-5" } });
    expect(range.status).toBe(206);
    expect(range.headers.get("content-range")).toBe("bytes 2-5/10");
    expect(await range.text()).toBe("2345");
    expect((await fetch(`${preview.url}/demo.mp4`, { headers: { Range: "bytes=20-" } })).status).toBe(416);
  } finally {
    await preview.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

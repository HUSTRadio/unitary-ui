import { describe, expect, test } from "vitest";

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

async function exists(relativePath: string): Promise<boolean> {
  try {
    const s = await stat(path.join(root, relativePath));
    return s.isFile();
  } catch {
    return false;
  }
}

describe("Video official single-track API contract", () => {
  test("video.tsx exports Video", async () => {
    const src = await read("src/components/ui/video.tsx");
    expect(src).toMatch(/export\s*\{[^}]*Video\b[^}]*\}/);
  });

  test("Video props cover official surface (src/poster/controls/loop/muted/lazy/autoPlay/width/height/preload)", async () => {
    const src = await read("src/components/ui/video.tsx");
    for (const prop of [
      "src",
      "poster",
      "controls",
      "loop",
      "muted",
      "lazy",
      "autoPlay",
      "width",
      "height",
      "preload",
    ]) {
      expect(src).toMatch(new RegExp(`\\b${prop}\\??:`));
    }
  });

  test("control bar matches official geometry: h-12 w-[85%] bottom-[5%], 40px play button, no aria-label", async () => {
    const src = await read("src/components/ui/video.tsx");
    expect(src).toMatch(/h-12/);
    expect(src).toMatch(/w-\[85%\]/);
    expect(src).toMatch(/bottom-\[5%\]/);
    expect(src).toMatch(/size-10/);
    // official play button has NO aria-label (it is a control)
    expect(src).not.toMatch(/aria-label=\{playing \? "Pause" : "Play"\}/);
  });

  test("time is mm:ss ('00:00') 13px tabular-nums with padded minutes", async () => {
    const src = await read("src/components/ui/video.tsx");
    expect(src).toMatch(/tabular-nums/);
    expect(src).toMatch(/text-\[13px\]|text-label-13-mono/);
    expect(src).toMatch(/padStart\(2, "0"\)/);
  });

  test("control bar follows official child order and spacing", async () => {
    const src = await read("src/components/ui/video.tsx");
    const button = src.indexOf("<button");
    const current = src.indexOf("{formatTime(currentTime)}");
    const track = src.indexOf("ref={trackRef}");
    const duration = src.indexOf("{formatTime(duration)}");

    expect(button).toBeGreaterThan(-1);
    expect(button).toBeLessThan(current);
    expect(current).toBeLessThan(track);
    expect(track).toBeLessThan(duration);
    expect(src).not.toContain("<span aria-hidden>/</span>");
    expect(src).not.toMatch(/items-center gap-3 rounded-md/);
    expect(src).toContain(
      'className="pl-0 text-[13px] leading-10 px-3 flex-[0_0_auto] tabular-nums w-[60px] text-center"',
    );
    expect(src).toContain(
      'className="text-[13px] leading-10 px-3 flex-[0_0_auto] tabular-nums w-[60px] text-center"',
    );
  });

  test("progress is native <progress max={100}> + clickable track + thumb dot size-2.5 (no input range)", async () => {
    const src = await read("src/components/ui/video.tsx");
    expect(src).toMatch(/<progress/);
    expect(src).toMatch(/max=\{100\}/);
    expect(src).toMatch(/size-2\.5/);
    expect(src).not.toMatch(/type="range"/);
  });

  test("demo assets exist in public/: demo.mp4 and demo-poster.png (G12-VIDEO-01)", async () => {
    expect(await exists("public/demo.mp4")).toBe(true);
    expect(await exists("public/demo-poster.png")).toBe(true);
  });

  test("VideoDemo preserves the official 600x582 geometry and shrinks with its viewport", async () => {
    const demo = await read("docs/geist/src/components/docs-components-page.tsx");
    expect(demo.match(/w-full min-w-0 max-w-\[600px\]/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(demo.match(/height=\{582\}/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(demo.match(/width=\{600\}/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  test("VideoDemo references /demo.mp4 and /demo-poster.png which now resolve via public/", async () => {
    const demo = await read("docs/geist/src/components/docs-components-page.tsx");
    expect(demo).toMatch(/src="\/demo\.mp4"/);
    expect(demo).toMatch(/poster="\/demo-poster\.png"/);
  });
});

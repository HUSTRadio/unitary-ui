import { describe, expect, it } from "vitest";
import { attributeReopeningTasks } from "../scripts/lib/select-reopening.mjs";
import { SourceMap } from "node:module";
import { mappedCpuFrames } from "../scripts/diagnose-select-reopening.mjs";

describe("Select reopening attribution", () => {
  it("correlates trusted reopening input, portal, commits, position and focus without hiding other tasks", () => {
    const events = [
      { kind: "input", at: 110, trusted: true, type: "pointerdown" },
      { kind: "react-commit", at: 140 },
      { kind: "attached", at: 160, portalId: 2 },
      { kind: "positioned", at: 170, portalId: 2 },
      { kind: "focus", at: 180, portalId: 2 },
    ];
    const result = attributeReopeningTasks([{ startTime: 100, duration: 65 }, { startTime: 400, duration: 60 }], events);
    expect(result[0].reopening).toBe(true);
    expect(result[0].events.map((event: { kind: string }) => event.kind)).toEqual(events.map(event => event.kind));
    expect(result[0].portalId).toBe(2);
    expect(result[1].reopening).toBe(false);
    expect(result[1].duration).toBe(60);
  });
  it("does not attribute synthetic input, unrelated portals or distant mounts", () => {
    const task = { startTime: 100, duration: 65 };
    for (const events of [
      [{ kind: "input", at: 110, trusted: false, type: "pointerdown" }, { kind: "attached", at: 160, portalId: 1 }],
      [{ kind: "input", at: 110, trusted: true, type: "pointerdown" }, { kind: "attached", at: 270, portalId: 1 }],
      [{ kind: "attached", at: 110, portalId: 1 }],
    ]) expect(attributeReopeningTasks([task], events)[0].reopening).toBe(false);
  });
  it("retains generated frames and maps sampled self time to original sources", () => {
    const map = new SourceMap({ version: 3, file: "app.js", sourceRoot: "", sources: ["src/lib/layer-bridge.tsx"], sourcesContent: ["sync()"], names: [], mappings: "AAAA" });
    const frames = mappedCpuFrames({ nodes: [
      { id: 1, callFrame: { functionName: "sync", url: "http://local/assets/app.js", lineNumber: 0, columnNumber: 0 } },
      { id: 2, callFrame: { functionName: "native", url: "", lineNumber: 0, columnNumber: 0 } },
    ], samples: [1, 2, 1], timeDeltas: [1000, 3000, 2000] }, new Map([["http://local/assets/app.js", map]])) as Array<{ function: string; selfMs: number; original?: { originalSource?: string } }>;
    expect(frames).toHaveLength(2);
    expect(frames[0].selfMs).toBe(3);
    expect(frames.find(frame => frame.function === "sync")?.original?.originalSource).toBe("src/lib/layer-bridge.tsx");
    expect(frames.find(frame => frame.function === "native")?.original).toBeUndefined();
  });
});

// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { StatusDot } from "../src/components/ui/status-dot";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("StatusDot semantic visual states", () => {
  test("maps every state to the required token class without raw hex", async () => {
    const src = await read("src/components/ui/status-dot.tsx");

    expect(src).toContain('QUEUED: "bg-blue-700 animate-pulse"');
    expect(src).toContain('BUILDING: "bg-amber-900 animate-pulse"');
    expect(src).toContain('READY: "bg-green-700"');
    expect(src).toContain('ERROR: "bg-red-700"');
    expect(src).toContain('CANCELED: "bg-gray-700"');
    expect(src).toContain('DELETED: "bg-gray-900"');
    expect(src).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  test("retains the state label and accessible name", () => {
    const markup = renderToStaticMarkup(<StatusDot state="READY" label />);

    expect(markup).toContain('aria-label="Ready"');
    expect(markup).toContain(">Ready</span>");
  });
});

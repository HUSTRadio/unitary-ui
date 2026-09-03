// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { StepPoint } from "../src/components/ui/step-point";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("StepPoint state geometry", () => {
  test("uses matching border and fill tokens for colored states", async () => {
    const src = await read("src/components/ui/step-point.tsx");

    expect(src).toContain('active: "border-progress bg-progress text-white"');
    expect(src).toContain('done: "border-success bg-success text-white"');
    expect(src).toContain('failed: "border-danger bg-danger text-white"');
  });

  test("renders stable slots and the constrained active inner point", () => {
    const markup = renderToStaticMarkup(<StepPoint status="active">Build</StepPoint>);

    expect(markup).toContain('data-slot="step-point"');
    expect(markup).toContain('data-slot="step-dot"');
    expect(markup).toContain("block size-1.5 aspect-square shrink-0 rounded-full bg-white");
  });
});

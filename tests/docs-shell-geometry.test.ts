import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const app = readFileSync(resolve(process.cwd(), "docs/geist/src/App.tsx"), "utf8");
const shell = readFileSync(
  resolve(process.cwd(), "docs/geist/src/components/docs-shell.tsx"),
  "utf8",
);

describe("docs shell geometry — official Geist layout", () => {
  it("limits width on <main> itself, not an inner wrapper", () => {
    // official: <main class="... max-w-[1220px] mx-auto ...">
    expect(app).toContain("max-w-[1220px]");
    expect(app).not.toContain("max-w-[1280px]");
    expect(app).toContain("mx-auto");
  });

  it("uses xl:grid with sidebar + content columns at the official breakpoint", () => {
    expect(app).toContain("xl:grid xl:grid-cols-[260px_1fr]");
  });

  it("puts 48px gutter on the content column, not on <main>", () => {
    expect(app).toContain("xl:px-12");
    expect(app).not.toContain("px-6 py-10 lg:px-12");
    // main itself should NOT have horizontal padding
    expect(app).not.toContain('px-6 py-10 xl:px-12"');
  });

  it("uses the official 260px sidebar at xl breakpoint", () => {
    expect(shell).toContain("w-[260px]");
    expect(shell).not.toContain("w-[272px]");
    expect(shell).toContain("xl:block");
    expect(shell).not.toContain("lg:block");
  });

  it("caps banner width to match main", () => {
    expect(shell).toContain("max-w-[1220px]");
  });
});

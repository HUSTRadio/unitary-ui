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
    expect(app).toContain("max-w-[1220px]");
    expect(app).not.toContain("max-w-[1280px]");
  });

  it("uses xl:grid with sidebar + content columns at the official breakpoint", () => {
    expect(app).toContain("xl:grid xl:grid-cols-[260px_1fr]");
  });

  it("keeps vertical padding off <main> so sidebar borders start at banner bottom", () => {
    // py-10 must be on the content column, NOT on main
    expect(app).not.toContain("flex-1 py-10 xl:grid");
    expect(app).toContain("border-gray-alpha-400 py-10");
  });

  it("puts 48px gutter on the content column, not on <main>", () => {
    expect(app).toContain("xl:px-12");
  });

  it("draws the view's right vertical boundary on the full content column", () => {
    expect(app).toContain('className="min-w-0 border-r border-gray-alpha-400 py-10"');
  });

  it("uses the official 260px sidebar with dual borders at xl breakpoint", () => {
    expect(shell).toContain("w-[260px]");
    expect(shell).toContain("border-l border-r border-gray-alpha-400");
    expect(shell).toContain("xl:sticky");
    expect(shell).toContain("xl:top-16");
    expect(shell).toContain("xl:bottom-0");
  });

  it("uses full-size theme switcher (not small) in the banner", () => {
    expect(shell).toContain("<ThemeSwitcher />");
    expect(shell).not.toContain("ThemeSwitcher small");
  });

  it("caps banner width to match main", () => {
    expect(shell).toContain("max-w-[1220px]");
  });
});

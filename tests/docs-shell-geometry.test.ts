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

  it("uses lg:grid with sidebar + content columns at the shell breakpoint", () => {
    expect(app).toContain("lg:grid lg:grid-cols-[260px_1fr]");
  });

  it("keeps vertical padding off <main> so sidebar borders start at banner bottom", () => {
    // py-10 must be on the content column, NOT on main
    expect(app).not.toContain("flex-1 py-10 lg:grid");
    expect(app).toContain("border-gray-alpha-400 py-10");
  });

  it("uses the page canvas separately from Background 1 surfaces", () => {
    expect(app).toContain("bg-background");
    expect(shell).toContain("bg-background");
  });

  it("uses the official dark page canvas and surface values", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/index.css"), "utf8");
    expect(styles).toContain("--color-bg-canvas: #000000;");
    expect(styles).toContain("--color-bg-surface: #0a0a0a;");
  });

  it("keeps sidebar state colors on the official gray-alpha scale", () => {
    expect(shell).toContain("bg-gray-alpha-100");
    expect(shell).toContain("hover:bg-gray-alpha-100");
  });

  it("puts 48px gutter on the content column, not on <main>", () => {
    expect(app).toContain("lg:px-12");
  });

  it("draws the view's right vertical boundary on the full content column", () => {
    expect(app).toContain('className="min-w-0 border-r border-gray-alpha-400 py-10"');
  });

  it("places the language menu immediately before the theme switcher", () => {
    expect(shell).toContain("LANGUAGE_OPTIONS");
    expect(shell).toContain("<ThemeSwitcher />");
    expect(shell.indexOf("LANGUAGE_OPTIONS")).toBeLessThan(shell.indexOf("<ThemeSwitcher />"));
    expect(shell).toContain("flex items-center gap-2");
  });

  it("uses the official 260px sidebar with dual borders at the lg breakpoint", () => {
    expect(shell).toContain("w-[260px]");
    expect(shell).toContain("border-l border-r border-gray-alpha-400");
    expect(shell).toContain("lg:sticky");
    expect(shell).toContain("lg:top-16");
    expect(shell).toContain("lg:bottom-0");
  });

  it("uses full-size theme switcher (not small) in the banner", () => {
    expect(shell).toContain("<ThemeSwitcher />");
    expect(shell).not.toContain("ThemeSwitcher small");
  });

  it("caps banner width to match main", () => {
    expect(shell).toContain("max-w-[1220px]");
  });

  it("locks the hamburger menu to narrow screens so desktop never shows it", () => {
    // 桌面端（lg 起）不得出现汉堡按钮：汉堡按钮必须携带 lg:hidden，
    // 且 menuOpen 只能被该汉堡按钮置真（桌面端按钮不可见即无任何打开 Drawer 的路径）。
    const hamburger = shell.match(
      /<button[\s\S]*?aria-label=\{copy\.menuOpenAria\}[\s\S]*?<\/button>/,
    )?.[0];
    expect(hamburger).toBeDefined();
    expect(hamburger).toContain("lg:hidden");
    expect(hamburger).toContain("onClick={() => setMenuOpen(true)}");

    const setMenuOpenTrue = shell.match(/setMenuOpen\(true\)/g);
    expect(setMenuOpenTrue).toEqual(["setMenuOpen(true)"]);

    // 窄屏搜索图标同样 lg:hidden（桌面端用 lg:block 的搜索框）
    const searchIconBlock = shell.match(
      /<button[\s\S]*?aria-label=\{copy\.searchAria\}[\s\S]*?<\/button>/,
    )?.[0];
    expect(searchIconBlock).toContain("lg:hidden");
    expect(searchIconBlock).toContain("onClick={onSearchOpen}");
  });
});

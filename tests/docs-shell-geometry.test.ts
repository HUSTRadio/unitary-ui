import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const app = readFileSync(resolve(process.cwd(), "docs/geist/src/App.tsx"), "utf8");
const shell = readFileSync(
  resolve(process.cwd(), "docs/geist/src/components/docs-shell.tsx"),
  "utf8",
);

describe("docs shell geometry — framework shell assembly", () => {
  it("limits width on the navbar/main/footer containers, not an inner wrapper", () => {
    expect(app).toContain("max-w-[1220px]");
    expect(app).not.toContain("max-w-[1280px]");
    expect(shell).toContain("max-w-[1220px]");
  });

  it("wide navbar is a centered 1220 block (official architecture), not full-width", () => {
    // 官方架构：Navbar 容器本身 sticky mx-auto max-w-[1220px]（非全宽条），
    // 留白区透出页面底色；内层 div 不再重复 mx-auto/max-w（回退 f08fd84 全宽化）。
    expect(shell).toMatch(/<Navbar[^>]*max-w-\[1220px\]/);
    const inner = shell.slice(shell.indexOf("<Navbar"), shell.indexOf("</Navbar>"));
    expect(inner).not.toMatch(/className="mx-auto flex h-full w-full max-w-\[1220px\]/);
  });

  it("wraps the banner content in <Navbar scrollBehavior=\"pinned\"> (framework component)", () => {
    expect(shell).toContain('<Navbar scrollBehavior="pinned"');
    // 顶栏内容仍保留：Logo / 搜索框 / 语言菜单 / 主题切换
    expect(shell).toContain("<ThemeSwitcher />");
    expect(shell).toContain("LANGUAGE_OPTIONS");
    expect(shell.indexOf("LANGUAGE_OPTIONS")).toBeLessThan(shell.indexOf("<ThemeSwitcher />"));
    expect(shell).toContain("flex items-center gap-2");
    // 不再手写 sticky header 壳层（由 Navbar 组件负责）
    expect(shell).not.toContain('header className="sticky top-0 z-40');
  });

  it("uses lg:grid with sidebar + content columns at the lg breakpoint", () => {
    // 断点铁律：桌面/移动分界一律 lg:（1024px），禁止 xl
    expect(app).toContain("lg:grid lg:grid-cols-[260px_1fr]");
    expect(app).not.toMatch(/\bxl:/);
    expect(shell).not.toMatch(/\bxl:/);
  });

  it("keeps vertical padding off <main> so sidebar borders start at navbar bottom", () => {
    expect(app).not.toContain("flex-1 py-10 lg:grid");
    // 内容列只留纵向 padding（分割线由 sidebar 双线承担，见下方连续主分割线契约）
    expect(app).toContain('"min-w-0 py-10"');
  });

  it("uses the page canvas separately from Background 1 surfaces", () => {
    expect(app).toContain("bg-background");
  });

  it("uses the official dark page canvas and surface values", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/index.css"), "utf8");
    expect(styles).toContain("--color-bg-canvas: #000000;");
    expect(styles).toContain("--color-bg-surface: #0a0a0a;");
  });

  it("renders the desktop sidebar via SidebarNav inside the sticky 260px container", () => {
    expect(shell).toContain("<SidebarNav");
    expect(shell).toContain("activeTo={pathname}");
    // 容器结构保持：260px 宽 + 左右双边界 + lg sticky
    expect(shell).toContain("w-[260px]");
    expect(shell).toContain("border-l border-r border-gray-alpha-400");
    expect(shell).toContain("lg:sticky lg:top-16");
    expect(shell).toContain("lg:h-[calc(100vh-4rem)]");
    expect(shell).toContain("hidden w-[260px]");
  });

  it("keeps the sidebar as a real scroll owner with a visible native scrollbar", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/index.css"), "utf8");
    expect(shell).toMatch(/<aside[^>]*docs-sidebar[^>]*overflow-y-auto/);
    expect(styles).toMatch(/\.docs-sidebar\s*\{[\s\S]*scrollbar-width:\s*thin;[\s\S]*scrollbar-color:\s*var\(--gray-alpha-400\)\s+transparent;[\s\S]*scrollbar-gutter:\s*stable both-edges;/);
    expect(styles).toMatch(/\.docs-sidebar::\-webkit-scrollbar\s*\{[\s\S]*width:\s*8px;/);
    expect(styles).toMatch(/\.docs-sidebar::\-webkit-scrollbar-thumb\s*\{[\s\S]*background-color:\s*var\(--gray-alpha-400\);[\s\S]*background-clip:\s*content-box;/);
    expect(styles).not.toMatch(/\.docs-sidebar\s*\{[\s\S]*scrollbar-color:\s*transparent/);
    const thumb = styles.match(/\.docs-sidebar::\-webkit-scrollbar-thumb\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(thumb).not.toMatch(/opacity:\s*0/);
  });

  it("gives the scrollable sidebar equal 16px content insets at both ends", () => {
    expect(shell).toContain('className="min-h-full border-gray-alpha-400 px-6 py-4"');
    expect(shell).not.toContain('className="h-full min-h-0 border-gray-alpha-400 px-6 pb-3.5 pt-4"');
  });

  it("assembles HamburgerMenu as a left side-slide panel with grouped headings (Task 4)", () => {
    const menu = shell.match(/<HamburgerMenu(?![\w])[\s\S]*?\n {12}\/>/)?.[0];
    expect(menu).toBeDefined();
    expect(menu).toContain('anchor="topbar"');
    expect(menu).toContain('direction="left"');
    expect(menu).toContain("showCloseButton");
    expect(menu).toContain('maxExpandedHeight="100dvh"');
    expect(menu).toContain('maxExpandedWidth="292px"');
    expect(menu).toContain("anchorElement={navbarEl}");
    expect(menu).toContain("groups={menuGroups}");
    expect(menu).toContain("open={menuOpen}");
    expect(menu).toContain("onOpenChange={setMenuOpen}");
    // 导航后收回面板（受控 open）
    expect(menu).toContain("onNavigate={(to) => {");
    // 数据源：NAV_GROUPS 保留分组与标题
    expect(shell).toContain("NAV_GROUPS.map");
    expect(shell).not.toContain("NAV_GROUPS.flatMap");
  });

  it("双向锁：≥lg 无汉堡按钮、<lg 有汉堡按钮", () => {
    // 全文件唯一 HamburgerMenu 实例，且其触发器包在 lg:hidden 容器内 ——
    // 桌面端按钮不可见即无任何打开面板的路径；ExpandPanel 经 Portal 渲染不受显隐影响。
    expect(shell.match(/<HamburgerMenu(?![\w])/g)).toHaveLength(1);
    const triggerWrap = shell.match(/<div[\s\S]{0,200}?className="lg:hidden"[\s\S]*?>\s*<HamburgerMenu/);
    expect(triggerWrap).not.toBeNull();

    // 无遗留的旧汉堡/Drawer 打开路径
    expect(shell).not.toContain("setMenuOpen(true)");
    expect(shell).not.toContain("@/components/ui/drawer");

    // 窄屏搜索图标 lg:hidden；桌面搜索框仅 lg 显示（工具行内的搜索按钮不算顶栏入口）
    const searchIconBlock = shell.match(
      /<button[\s\S]*?aria-label=\{copy\.searchAria\}[\s\S]*?lg:hidden[\s\S]*?<\/button>/,
    )?.[0];
    expect(searchIconBlock).toContain("lg:hidden");
    expect(searchIconBlock).toContain("onClick={onSearchOpen}");
    expect(shell).toContain('relative hidden lg:block" role="search"');
  });

  it("language menu and theme switcher are hidden on mobile topbar (drawer hosts them)", () => {
    // 2026-08-24 新契约：移动端（<md）topbar 右区块只保留搜索入口，
    // 语言/主题收敛进汉堡抽屉工具行（toolbarRight 已有等价副本），
    // 消除 390px 视口下右簇 ~197px 的横向溢出。
    const rightBlock = shell.slice(shell.indexOf("右区块"), shell.indexOf("</Navbar>"));
    expect(rightBlock.match(/max-md:hidden/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("drawer toolbar theme switcher buttons get >=44px touch targets via hit-area wrapper", () => {
    // 2026-08-24 新契约：抽屉工具行的 <ThemeSwitcher small />（按钮实测 24×24）
    // 外包命中扩展容器，把可点目标提升到 ≥44×44（Apple HIG / WCAG 2.5.8）。
    const wrap = shell.match(
      /<div className="\[\&_button\]:min-h-11[^"]*">\s*<ThemeSwitcher small \/>/,
    );
    expect(wrap).not.toBeNull();
  });

  it("removes the static DocsMobileNav list (superseded by the HamburgerMenu panel)", () => {
    expect(shell).not.toContain("DocsMobileNav");
    // 死 i18n key 一并清理
    const catalog = readFileSync(resolve(process.cwd(), "docs/geist/src/i18n/catalog.ts"), "utf8");
    for (const dead of ["menuOpenAria", "menuCloseAria", "mobileSearchPlaceholder", "searchClearAria", "searchNoResults"]) {
      expect(catalog).not.toContain(dead);
    }
  });

  it("puts 48px gutter on the content column, not on <main>", () => {
    expect(app).toContain("lg:px-12");
  });

  it("joins navbar and main outer rails at lg+ without placing a border on the scrolling content column", () => {
    expect(shell).toMatch(/<Navbar[^>]*max-w-\[1220px\]/);
    expect(shell).toMatch(/flex h-full w-full[^"]*lg:border-l[^"]*lg:border-r/);
    expect(app).toMatch(/<main[\s\S]*?border-gray-alpha-400[\s\S]*?lg:border-r/);
    expect(app).not.toMatch(/className="min-w-0[^"]*border-r/);
  });

  it("uses one shared page background for margins, sidebar and content", () => {
    expect(app).toContain('className="flex min-h-screen flex-col bg-background"');
    expect(app).not.toMatch(/bg-background-200/);
    expect(app).not.toMatch(/className="min-w-0[^"]*bg-/);
  });

  it("continuous main divider @x=363: sidebar carries border-r (docks with navbar brand borderR)", () => {
    // 官方 x=363 是一条连续定线：navbar 段 = brand borderR（y=0..64），
    // 正文段 = sidebar borderR（y=64..页底）。aside 必须双线 border-l + border-r。
    expect(shell).toMatch(/<aside[^>]*border-l[^>]*border-r/);
  });

  it("no longer mounts the docs Footer below <main>（Task 8：页脚已移除，main flex-1 撑满 min-h-screen）", () => {
    expect(app).not.toContain("<Footer");
    expect(app).not.toContain("FOOTER_COLUMNS");
  });
});

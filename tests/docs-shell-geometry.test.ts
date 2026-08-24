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
    expect(app).toContain("border-gray-alpha-400 py-10");
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
    // 容器结构保持：260px 宽 + 双边界（aside border-l + nav border-r）+ lg sticky
    expect(shell).toContain("w-[260px]");
    expect(shell).toContain("border-l border-gray-alpha-400");
    expect(shell).toContain("lg:sticky lg:top-16");
    expect(shell).toContain("lg:h-[calc(100vh-4rem)]");
    expect(shell).toContain("hidden w-[260px]");
  });

  it("assembles HamburgerMenu as a left side-slide panel with flattened items (Task 4)", () => {
    const menu = shell.match(/<HamburgerMenu(?![\w])[\s\S]*?\n {12}\/>/)?.[0];
    expect(menu).toBeDefined();
    expect(menu).toContain('anchor="topbar"');
    expect(menu).toContain('direction="left"');
    expect(menu).toContain("showCloseButton");
    expect(menu).toContain('maxExpandedHeight="100dvh"');
    expect(menu).toContain('maxExpandedWidth="292px"');
    expect(menu).toContain("anchorElement={navbarEl}");
    expect(menu).toContain("items={menuItems}");
    expect(menu).toContain("open={menuOpen}");
    expect(menu).toContain("onOpenChange={setMenuOpen}");
    // 导航后收回面板（受控 open）
    expect(menu).toContain("onNavigate={(to) => {");
    // 数据源：NAV_GROUPS 扁平化 [{label, to}]
    expect(shell).toContain("NAV_GROUPS.flatMap");
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

  it("draws the view's right vertical boundary on the content column at lg+ only (Task 4: 窄档去竖线)", () => {
    expect(app).toContain('className="min-w-0 border-gray-alpha-400 py-10 lg:border-r"');
  });

  it("no longer mounts the docs Footer below <main>（Task 8：页脚已移除，main flex-1 撑满 min-h-screen）", () => {
    expect(app).not.toContain("<Footer");
    expect(app).not.toContain("FOOTER_COLUMNS");
  });
});

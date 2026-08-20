import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

it("exports the Geist Menu compound API", async () => {
  const source = await readFile(new URL("../src/components/ui/menu.tsx", import.meta.url), "utf8");

  for (const symbol of ["MenuContainer", "MenuButton", "Menu", "MenuItem"]) {
    expect(source).toMatch(new RegExp(`\\b${symbol}\\b`));
  }
  expect(source).toMatch(/export\s*\{[^}]*MenuContainer[^}]*MenuButton[^}]*Menu[^}]*MenuItem/s);
});

it("stateful declaration gates gap and active persistent state", async () => {
  const source = await readFile(new URL("../src/components/ui/menu.tsx", import.meta.url), "utf8");

  // Menu 显式声明 prop
  expect(source).toContain("stateful?: boolean");
  expect(source).toContain("stateful = false");
  // 声明后：flex-col 布局 + gap-1（4px，Geist 尺度）
  expect(source).toContain('stateful && "flex flex-col gap-1"');
  // MenuItem active 持久态仅在 stateful 上下文内生效
  expect(source).toContain("active?: boolean");
  expect(source).toContain("const isActive = stateful && active");
  expect(source).toContain('isActive && "bg-gray-alpha-100"');
  // 未声明默认保持官方零间隙（块级堆叠，无 gap）
  expect(source).toContain("官方 vercel.com/geist/menu 实测 items gap=0");
});

import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

it("exports the Geist Menu compound API", async () => {
  const source = await readFile(new URL("../src/components/ui/menu.tsx", import.meta.url), "utf8");

  for (const symbol of ["MenuContainer", "MenuButton", "Menu", "MenuItem"]) {
    expect(source).toMatch(new RegExp(`\\b${symbol}\\b`));
  }
  expect(source).toMatch(/export\s*\{[^}]*MenuContainer[^}]*MenuButton[^}]*Menu[^}]*MenuItem/s);
});

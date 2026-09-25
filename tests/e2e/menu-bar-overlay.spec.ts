import { expect, test } from "@playwright/test";

test.setTimeout(45_000);

for (const theme of ["light", "dark"] as const) {
  test(`MenuBar in a modal stays clickable above its overlay (${theme})`, async ({ page }) => {
    await page.addInitScript((preferredTheme) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preferredTheme);
    }, theme);
    await page.goto("/#/components/menu-bar");
    await page.getByRole("button", { name: "Open menu in modal" }).click();
    const dialog = page.getByRole("dialog", { name: "Document commands" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("menuitem", { name: "File" }).click();
    const content = page.locator('[data-slot="menu-bar-content"]:visible');
    await expect(content.getByRole("menuitem", { name: "Save" })).toBeVisible();
    await content.getByRole("menuitem", { name: "Save" }).click();
    await expect(dialog.getByText("Saved in modal")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Open menu in modal" }).click();
    await dialog.getByRole("menuitem", { name: "File" }).click();
    await expect(content.getByRole("menuitem", { name: "Export" })).toBeVisible();
    await content.getByRole("menuitem", { name: "Export" }).hover();
    await page.locator('[data-slot="menu-bar-sub-content"]:visible').getByRole("menuitem", { name: "PDF" }).click();
    await expect(dialog.getByText("Exported PDF in modal")).toBeVisible();
  });

  test(`MenuBar submenu stays inside narrow viewport (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.addInitScript((preferredTheme) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preferredTheme);
    }, theme);
    await page.goto("/#/components/menu-bar");
    await page.getByRole("menubar").first().getByRole("menuitem", { name: "File" }).click();
    await page.locator('[data-slot="menu-bar-content"]:visible').getByRole("menuitem", { name: "Export" }).hover();
    const submenu = page.locator('[data-slot="menu-bar-sub-content"]:visible');
    await expect(submenu).toBeVisible();
    await expect.poll(() => submenu.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= innerWidth;
    })).toBe(true);
    await submenu.getByRole("menuitem", { name: "PDF" }).click();
    await expect(page.getByText("Export PDF", { exact: true }).first()).toBeVisible();
  });

  test(`MenuBar demo advertises no keycaps for unbound shortcuts (${theme})`, async ({ page }) => {
    await page.addInitScript((preferredTheme) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preferredTheme);
    }, theme);
    await page.goto("/#/components/menu-bar");
    const bar = page.getByRole("menubar").first();

    // HIG-AUD-047：组件不绑定按键，演示不得出现让用户以为可按的键帽
    await bar.getByRole("menuitem", { name: "File" }).click();
    const fileMenu = page.locator('[data-slot="menu-bar-content"]:visible');
    await expect(fileMenu.getByRole("menuitem", { name: "New Window" })).toBeVisible();
    await expect(fileMenu.locator('[data-slot="menu-bar-shortcut"]')).toHaveCount(0);

    // 与同文件其它用例一致：换菜单前先 reload，避免上一条菜单的关闭状态干扰重开
    await page.reload();
    await bar.getByRole("menuitem", { name: "Edit" }).click();
    const editMenu = page.locator('[data-slot="menu-bar-content"]:visible');
    await expect(editMenu.getByRole("menuitem", { name: "Undo" })).toBeVisible();
    await expect(editMenu.locator('[data-slot="menu-bar-shortcut"]')).toHaveCount(0);

    // 命令本身仍可用：选择后写入日志
    await editMenu.getByRole("menuitem", { name: "Copy" }).click();
    await expect(page.getByText("Copy", { exact: true }).last()).toBeVisible();
  });

  test(`MenuBar narrow overflow signals hidden commands (${theme})`, async ({ page }) => {
    await page.addInitScript((preferredTheme) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preferredTheme);
    }, theme);
    await page.goto("/#/components/menu-bar");
    const bar = page.locator('[data-slot="menu-bar"]').first();
    await bar.evaluate((node) => {
      node.style.width = "112px";
    });
    await expect.poll(() => bar.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
    await expect(bar).toHaveAttribute("data-overflow-right", "true");
    await bar.evaluate((node) => {
      node.scrollLeft = node.scrollWidth;
      node.dispatchEvent(new Event("scroll"));
    });
    await expect(bar).toHaveAttribute("data-overflow-left", "true");
    await expect(bar).not.toHaveAttribute("data-overflow-right");
    await expect(bar.getByRole("menuitem", { name: "View" })).toBeVisible();
  });
}

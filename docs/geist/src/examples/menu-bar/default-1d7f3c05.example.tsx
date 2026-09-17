import * as React from "react";

import {
  MenuBar,
  MenuBarCheckboxItem,
  MenuBarContent,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubContent,
  MenuBarSubTrigger,
  MenuBarTrigger,
} from "@/components/ui/menu-bar";

/**
 * MenuBar —— 水平应用菜单栏：顶级菜单横向排列，菜单项支持右对齐快捷键、
 * 分隔线、勾选态与子菜单。键盘导航（左右切顶级菜单、Esc 逐级关闭）由 Radix 提供。
 */
export function MenuBarDefault1D7F3C05Example() {
  const [showHidden, setShowHidden] = React.useState(false);
  const [log, setLog] = React.useState("No command yet.");

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <MenuBar>
        <MenuBarMenu>
          <MenuBarTrigger>File</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem shortcut="⌘N" onSelect={() => setLog("New Window")}>
              New Window
            </MenuBarItem>
            <MenuBarItem shortcut="⌘O" onSelect={() => setLog("Open…")}>
              Open…
            </MenuBarItem>
            <MenuBarSeparator />
            <MenuBarSub>
              <MenuBarSubTrigger>Export</MenuBarSubTrigger>
              <MenuBarSubContent>
                <MenuBarItem onSelect={() => setLog("Export PDF")}>PDF</MenuBarItem>
                <MenuBarItem onSelect={() => setLog("Export PNG")}>PNG</MenuBarItem>
              </MenuBarSubContent>
            </MenuBarSub>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>Edit</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem shortcut="⌘Z" onSelect={() => setLog("Undo")}>
              Undo
            </MenuBarItem>
            <MenuBarItem shortcut="⌘⇧Z" onSelect={() => setLog("Redo")}>
              Redo
            </MenuBarItem>
            <MenuBarSeparator />
            <MenuBarItem shortcut="⌘C" onSelect={() => setLog("Copy")}>
              Copy
            </MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>View</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarCheckboxItem
              shortcut="⌘⇧."
              checked={showHidden}
              onCheckedChange={setShowHidden}
            >
              Show Hidden Files
            </MenuBarCheckboxItem>
            <MenuBarItem disabled>Enter Full Screen</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
      </MenuBar>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}

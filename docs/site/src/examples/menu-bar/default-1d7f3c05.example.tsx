import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTitle } from "@hustradio/unitary-ui";

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
} from "@hustradio/unitary-ui";

/**
 * MenuBar —— 水平应用菜单栏：顶级菜单横向排列，菜单项支持分隔线、勾选态与子菜单。
 * 键盘导航（左右切顶级菜单、Esc 逐级关闭）由 Radix 提供。
 *
 * HIG-AUD-047：`shortcut` 只负责展示、不绑定按键，因此本示例不渲染任何快捷键提示——
 * 演示里出现 ⌘N / ⌘O / ⌘Z / ⌘C 这类键帽会让用户以为可按（其中多数还是浏览器保留键，
 * 页面无法可靠拦截）。需要在真实产品里展示快捷键时，请由调用方自行绑定按键后传入。
 */
export function MenuBarDefault1D7F3C05Example() {
  const [showHidden, setShowHidden] = React.useState(false);
  const [log, setLog] = React.useState("No command yet.");
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <MenuBar>
        <MenuBarMenu>
          <MenuBarTrigger>File</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem onSelect={() => setLog("New Window")}>New Window</MenuBarItem>
            <MenuBarItem onSelect={() => setLog("Open…")}>Open…</MenuBarItem>
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
            <MenuBarItem onSelect={() => setLog("Undo")}>Undo</MenuBarItem>
            <MenuBarItem onSelect={() => setLog("Redo")}>Redo</MenuBarItem>
            <MenuBarSeparator />
            <MenuBarItem onSelect={() => setLog("Copy")}>Copy</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>View</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
              Show Hidden Files
            </MenuBarCheckboxItem>
            <MenuBarItem disabled>Enter Full Screen</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
      </MenuBar>
      <p className="text-copy-13 text-gray-900">{log}</p>
      <Button typeName="button" size="small" onClick={() => setModalOpen(true)}>
        Open menu in modal
      </Button>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent showCloseButton>
          <ModalTitle>Document commands</ModalTitle>
          <div className="mt-4 flex flex-col gap-3">
            <MenuBar>
              <MenuBarMenu>
                <MenuBarTrigger>File</MenuBarTrigger>
                <MenuBarContent>
                  <MenuBarItem onSelect={() => setLog("Saved in modal")}>Save</MenuBarItem>
                  <MenuBarSub>
                    <MenuBarSubTrigger>Export</MenuBarSubTrigger>
                    <MenuBarSubContent>
                      <MenuBarItem onSelect={() => setLog("Exported PDF in modal")}>PDF</MenuBarItem>
                    </MenuBarSubContent>
                  </MenuBarSub>
                </MenuBarContent>
              </MenuBarMenu>
            </MenuBar>
            <p className="text-copy-13 text-gray-900">{log}</p>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

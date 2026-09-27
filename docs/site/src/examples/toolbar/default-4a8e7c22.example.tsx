import * as React from "react";
import { Copy } from "lucide-react";

import { Toolbar, ToolbarGroup, ToolbarItem } from "@/components/ui/toolbar";

/**
 * Toolbar —— 窗口级工具操作组：leading / center / trailing 三段分组。
 * 空间不足时可折叠组收起，组内 ToolbarItem 进入尾部溢出菜单（缩小容器即可看到）。
 */
export function ToolbarDefault4A8E7C22Example() {
  const [mode, setMode] = React.useState("preview");
  const [log, setLog] = React.useState("No command yet.");

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Toolbar className="max-w-[420px]">
        <ToolbarGroup slot="leading">
          <ToolbarItem icon={<Copy className="size-4" />} label="Duplicate" onSelect={() => setLog("Duplicate")} />
          <ToolbarItem label="Rename" onSelect={() => setLog("Rename")} />
        </ToolbarGroup>
        <ToolbarGroup slot="center">
          <ToolbarItem label="Preview" active={mode === "preview"} onSelect={() => setMode("preview")} />
          <ToolbarItem label="Code" active={mode === "code"} onSelect={() => setMode("code")} />
        </ToolbarGroup>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Share" onSelect={() => setLog("Share")} />
          <ToolbarItem label="Publish" onSelect={() => setLog("Publish")} />
        </ToolbarGroup>
      </Toolbar>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}

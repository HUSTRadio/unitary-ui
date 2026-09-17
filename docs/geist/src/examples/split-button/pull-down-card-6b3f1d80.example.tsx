import * as React from "react";

import { SplitButton, SplitButtonMenuItem, type SplitButtonExpandCorner } from "@/components/ui/split-button";

const CORNERS: readonly SplitButtonExpandCorner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

/**
 * Pull-down Button —— split-button 的悬浮卡片变体：
 * 卡片锚定按钮的 expandCorner 角，向对向展开（动画原点即该角）。
 */
export function SplitButtonPullDownCard6B3F1D80Example() {
  const [corner, setCorner] = React.useState<SplitButtonExpandCorner>("top-left");
  const [log, setLog] = React.useState("No command yet.");

  const items = (
    <>
      <SplitButtonMenuItem
        title="New file"
        description="Create a blank file"
        menuItemProps={{ onClick: () => setLog("New file") }}
      />
      <SplitButtonMenuItem
        title="New folder"
        description="Create an empty folder"
        menuItemProps={{ onClick: () => setLog("New folder") }}
      />
      <SplitButtonMenuItem
        title="Import…"
        description="Bring in an existing project"
        menuItemProps={{ onClick: () => setLog("Import…") }}
      />
    </>
  );

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <SplitButton
        variant="pulldown"
        expandCorner={corner}
        buttonProps={{ type: "secondary", onClick: () => setLog("New file (default)") }}
        menuItems={items}
      >
        New
      </SplitButton>
      <div className="flex flex-wrap gap-1">
        {CORNERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCorner(value)}
            className={
              value === corner
                ? "rounded-md bg-gray-alpha-200 px-2 py-1 text-label-13 text-gray-1000"
                : "rounded-md px-2 py-1 text-label-13 text-gray-900 hover:bg-gray-alpha-100"
            }
          >
            {value}
          </button>
        ))}
      </div>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}

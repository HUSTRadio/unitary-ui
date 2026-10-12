import * as React from "react";

import { Select, SelectItem } from "@hustradio/unitary-ui";

/**
 * Pop-up Button（macOS NSPopUpButton）——Select 的 HIG 用法：
 * 触发器显示当前选中值，打开菜单即高亮当前项。无需单独的 pop-up 组件。
 */
export function SelectPopUpButton5C7E2A91Example() {
  const [value, setValue] = React.useState("automatic");

  return (
    <div className="flex w-full max-w-[240px] flex-col gap-2">
      <Select value={value} onValueChange={setValue} size="small" aria-label="Refresh interval">
        <SelectItem value="automatic">Automatic</SelectItem>
        <SelectItem value="every-hour">Every hour</SelectItem>
        <SelectItem value="every-day">Every day</SelectItem>
        <SelectItem value="manually">Manually</SelectItem>
      </Select>
      <p className="text-copy-13 text-gray-900">Current value: {value}</p>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import { Link } from "@hustradio/unitary-ui";
import { Select, SelectItem } from "@hustradio/unitary-ui";
import { Tabs } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";
import type { ScrollTrackingMode } from "@hustradio/unitary-ui";

export default function TabsScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [selected, setSelected] = useState("view-6");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [mount, setMount] = useState(0);
  const tabs = Array.from({ length: 12 }, (_, index) => ({
    title: `${zh ? "视图" : "View"} ${index + 1}`,
    value: `view-${index + 1}`,
  }));

  return (
    <div data-slot="tabs-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div data-slot="scroll-tracking-mode">
          <Select label={zh ? "跟踪模式" : "Tracking mode"} value={mode}
            onValueChange={(value) => setMode(value as ScrollTrackingMode)}>
            <SelectItem value="disabled">{zh ? "禁用" : "Disabled"}</SelectItem>
            <SelectItem value="on-reload">{zh ? "载入时" : "On reload"}</SelectItem>
            <SelectItem value="always">{zh ? "始终跟踪" : "Always"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-target">
          <Select label={zh ? "活动标签" : "Active tab"} value={selected} onValueChange={setSelected}>
            {tabs.map((tab) => <SelectItem key={tab.value} value={tab.value}>{tab.title}</SelectItem>)}
          </Select>
        </div>
        <div data-slot="scroll-tracking-direction">
          <Select label={zh ? "文字方向" : "Direction"} value={direction}
            onValueChange={(value) => setDirection(value as "ltr" | "rtl")}>
            <SelectItem value="ltr">{zh ? "从左到右" : "Left to right"}</SelectItem>
            <SelectItem value="rtl">{zh ? "从右到左" : "Right to left"}</SelectItem>
          </Select>
        </div>
        <Button data-slot="scroll-tracking-remount" type="secondary" typeName="button"
          onClick={() => setMount((value) => value + 1)}>
          {zh ? "重新载入演示" : "Reload demo"}
        </Button>
        <Button data-slot="scroll-tracking-reset" type="tertiary" typeName="button"
          onClick={() => {
            setMode("on-reload");
            setSelected("view-6");
            setDirection("ltr");
            setMount((value) => value + 1);
          }}>
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "从上方选择活动标签，比较跟踪模式；切换文字方向后重新载入，观察起始边对齐。你也可以手动滚动标签行。"
          : "Choose an active tab above to compare modes. Change direction and reload to observe start-edge alignment. You can also scroll the tab row manually."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "纵向活动项的相同能力参见 " : "For the vertical equivalent, see "}
        <Link href="#/components/sidebar-nav">{zh ? "侧栏导航文档" : "SidebarNav documentation"}</Link>{zh ? "。" : "."}
      </p>
      <div key={mount} data-slot="scroll-tracking-viewport" dir={direction} className="w-full max-w-xs min-w-0">
        <Tabs tabs={tabs} selected={selected} setSelected={setSelected}
          scrollTracking={mode} ariaLabel={zh ? "视图跟踪演示" : "View tracking demo"} />
      </div>
    </div>
  );
}

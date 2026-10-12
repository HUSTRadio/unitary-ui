import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import { Link } from "@hustradio/unitary-ui";
import { Select, SelectItem } from "@hustradio/unitary-ui";
import { SidebarNav } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";
import type { ScrollTrackingMode, SidebarNavScrollTrackingTarget } from "@hustradio/unitary-ui";

export default function SidebarNavScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [target, setTarget] = useState<SidebarNavScrollTrackingTarget>("item");
  const [activeTo, setActiveTo] = useState("/page-6");
  const [mount, setMount] = useState(0);
  const items = Array.from({ length: 12 }, (_, index) => ({
    label: `${zh ? "页面" : "Page"} ${index + 1}`,
    to: `/page-${index + 1}`,
  }));

  return (
    <div data-slot="sidebar-nav-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div data-slot="scroll-tracking-mode">
          <Select label={zh ? "跟踪模式" : "Tracking mode"} value={mode}
            onValueChange={(value) => setMode(value as ScrollTrackingMode)}>
            <SelectItem value="disabled">{zh ? "禁用" : "Disabled"}</SelectItem>
            <SelectItem value="on-reload">{zh ? "载入时" : "On reload"}</SelectItem>
            <SelectItem value="always">{zh ? "始终跟踪" : "Always"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-alignment">
          <Select label={zh ? "对齐目标" : "Alignment target"} value={target}
            onValueChange={(value) => setTarget(value as SidebarNavScrollTrackingTarget)}>
            <SelectItem value="item">{zh ? "当前条目" : "Current item"}</SelectItem>
            <SelectItem value="category">{zh ? "所属分类小标题" : "Category heading"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-target">
          <Select label={zh ? "活动条目" : "Active item"} value={activeTo} onValueChange={setActiveTo}>
            {items.map((item) => <SelectItem key={item.to} value={item.to}>{item.label}</SelectItem>)}
          </Select>
        </div>
        <Button data-slot="scroll-tracking-remount" type="secondary" typeName="button"
          onClick={() => setMount((value) => value + 1)}>
          {zh ? "重新载入演示" : "Reload demo"}
        </Button>
        <Button data-slot="scroll-tracking-reset" type="tertiary" typeName="button"
          onClick={() => {
            setMode("on-reload");
            setTarget("item");
            setActiveTo("/page-6");
            setMount((value) => value + 1);
          }}>
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "选择活动条目和对齐目标，比较跟踪模式。文档侧栏在载入时对齐所属分类小标题；此演示默认对齐条目。重新载入保留当前选择，你也可以手动滚动。"
          : "Choose an active item and alignment target to compare modes. The docs sidebar aligns its category heading on load; this demo starts with item alignment. Reload keeps your selection, and manual scrolling remains available."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "横向活动项的相同能力参见 " : "For the horizontal equivalent, see "}
        <Link href="#/components/tabs">{zh ? "标签页文档" : "Tabs documentation"}</Link>{zh ? "。" : "."}
      </p>
      <div key={mount} data-slot="scroll-tracking-viewport" tabIndex={0}
        aria-label={zh ? "侧栏跟踪演示" : "Sidebar tracking demo"}
        className="nav-scroll h-48 w-full max-w-64 overflow-y-auto rounded-xl border border-border bg-background p-4 focus-ring">
        <SidebarNav groups={[{ label: zh ? "页面导航" : "Pages", items,
          subgroups: [0, 1, 2].map((index) => ({
            label: `${zh ? "分类" : "Category"} ${index + 1}`,
            items: items.slice(index * 4, index * 4 + 4),
          })),
        }]}
          activeTo={activeTo} onNavigate={setActiveTo} scrollTracking={mode} scrollTrackingTarget={target} />
      </div>
    </div>
  );
}

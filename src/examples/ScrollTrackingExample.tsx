import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Tabs } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import type { ScrollTrackingMode, SidebarNavScrollTrackingTarget } from "@/lib";

export function ScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [target, setTarget] = useState<SidebarNavScrollTrackingTarget>("item");
  const [active, setActive] = useState("section-6");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [mount, setMount] = useState(0);
  const sections = Array.from({ length: 12 }, (_, index) => ({
    title: `${zh ? "视图" : "View"} ${index + 1}`,
    value: `section-${index + 1}`,
  }));

  return (
    <div data-slot="styleguide-scroll-tracking-demo" className="w-full space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Select label={zh ? "跟踪模式" : "Tracking mode"} value={mode}
          onValueChange={(value) => setMode(value as ScrollTrackingMode)}>
          <SelectItem value="disabled">{zh ? "禁用" : "Disabled"}</SelectItem>
          <SelectItem value="on-reload">{zh ? "载入时" : "On reload"}</SelectItem>
          <SelectItem value="always">{zh ? "始终跟踪" : "Always"}</SelectItem>
        </Select>
        <Select label={zh ? "侧栏对齐目标" : "Sidebar alignment target"} value={target}
          onValueChange={(value) => setTarget(value as SidebarNavScrollTrackingTarget)}>
          <SelectItem value="item">{zh ? "当前条目" : "Current item"}</SelectItem>
          <SelectItem value="category">{zh ? "所属分类小标题" : "Category heading"}</SelectItem>
        </Select>
        <Select label={zh ? "活动视图" : "Active view"} value={active} onValueChange={setActive}>
          {sections.map((section) => <SelectItem key={section.value} value={section.value}>{section.title}</SelectItem>)}
        </Select>
        <Select label={zh ? "文字方向" : "Direction"} value={direction}
          onValueChange={(value) => setDirection(value as "ltr" | "rtl")}>
          <SelectItem value="ltr">{zh ? "从左到右" : "Left to right"}</SelectItem>
          <SelectItem value="rtl">{zh ? "从右到左" : "Right to left"}</SelectItem>
        </Select>
        <Button type="secondary" typeName="button" onClick={() => setMount((value) => value + 1)}>
          {zh ? "重新载入演示" : "Reload demo"}
        </Button>
        <Button type="tertiary" typeName="button" onClick={() => {
          setMode("on-reload");
          setTarget("item");
          setActive("section-6");
          setDirection("ltr");
          setMount((value) => value + 1);
        }}>
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "切换活动视图，比较载入时定位和始终跟踪。导航区和标签行仍可手动滚动；重新载入会保留当前选择。"
          : "Change the active view to compare initial alignment and tracking on selection changes. You can still scroll both controls manually; reload keeps the current selection."}
      </p>
      <div key={mount} className="flex flex-wrap items-start gap-6">
        <div tabIndex={0} aria-label={zh ? "侧栏跟踪演示" : "Sidebar tracking demo"}
          className="nav-scroll h-48 w-full max-w-64 overflow-y-auto rounded-xl border border-border bg-background p-4 focus-ring">
          <SidebarNav groups={[{ label: zh ? "视图导航" : "Views", items: [],
            subgroups: [0, 1, 2].map((index) => ({
              label: `${zh ? "分类" : "Category"} ${index + 1}`,
              items: sections.slice(index * 4, index * 4 + 4).map((section) => ({
                label: section.title, to: `/${section.value}`,
              })),
            })),
          }]}
            activeTo={`/${active}`} onNavigate={(to) => setActive(to.slice(1))} scrollTracking={mode} scrollTrackingTarget={target} />
        </div>
        <div dir={direction} className="w-full max-w-xs min-w-0">
          <Tabs tabs={sections} selected={active} setSelected={setActive} scrollTracking={mode}
            ariaLabel={zh ? "视图跟踪演示" : "View tracking demo"} />
        </div>
      </div>
    </div>
  );
}

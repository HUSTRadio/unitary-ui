# 侧边面板

> Route: `/components/sheet`

在从屏幕边缘滑入的侧面面板中显示内容。

[返回组件](#/components)

# 侧边面板

Sheet

在从屏幕边缘滑入的侧面面板中显示内容。

## 何时使用

- 需要展示持久的关联上下文（如部署详情或成员档案）同时保持主页内容可交互时。
- 当需要一个有明确打开/关闭操作的侧边面板，比弹窗对话框更自然的展示方式。

## 何时不应使用

- 当需要完全阻塞页面的决策确认时，请使用模态对话框（Modal）。
- 当需要确认破坏性操作时，默认的保持页面可交互会削弱严重程度提示。

## 示例

### 默认侧边面板

从右侧滑出的基础面板，包含标题区域、内容主体和关闭按钮。

### 不同方向的侧边面板

展示侧边面板从左侧或右侧滑出的变体，可根据触发按钮的位置选择合适的方向。

## 无障碍

- Sheet 默认 modal=false：页面保持可交互、不锁滚动、outside-click 不关闭。焦点捕获与 Escape 关闭仅在显式 <Sheet modal> 时由 Radix Dialog 提供。
- 标题通过 aria-labelledby 关联，屏幕阅读器会在面板打开时播报标题内容。

## 受控行为

- 支持通过外部状态（如 isOpen 变量）或回调函数控制面板的打开与关闭，适合构建复杂的交互模式。

## 响应式行为

- 在大视口下固定在页面边缘展示，在小视口中可退化为全屏覆盖模式以适配移动端布局。

## 主题行为

- 面板的背景色、边框和阴影均可自定义，并且能与应用的暗色主题无缝配合。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetDefault37A8EEC1Example() {
  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button type="default" typeName="button">
          Open Sheet
        </Button>
      </SheetTrigger>
      <SheetContent className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col">
        <SheetHeader className="p-6 text-left">
          <SheetTitle>Sheet Title</SheetTitle>
          <p className="text-copy-14 text-foreground">Sheet description</p>
        </SheetHeader>
        <SheetDescription className="px-6 py-4 text-copy-14">Sheet body</SheetDescription>
        <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
          <SheetClose asChild>
            <Button type="secondary" typeName="button">
              Close
            </Button>
          </SheetClose>
          <Button typeName="button">Next</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## 四边弹出方向

```tsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SheetWithSideCF31B857Example() {
  const sides = ["top", "right", "bottom", "left"] as const;

  return (
    <div className="flex items-center justify-center gap-4">
      {sides.map((side) => (
        <Sheet key={side} modal>
          <SheetTrigger asChild>
            <Button type="default" typeName="button">
              Open {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <p className="text-copy-14 text-foreground">This sheet slides in from the {side}.</p>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控面板状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">modal</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">是否阻止外部交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SheetSide</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SheetContent 进入的屏幕边缘。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noOverlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">不渲染 SheetContent 遮罩层。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 部署详情、日志行检查或成员资料这类持久关联上下文、且底层页面保持有用的场合用 Sheet。
- 需要阻断的决定用 Modal。仅移动端的底部面板用 Drawer。
- 不要用 Sheet 确认破坏性动作。默认保持页面可交互会削弱删除或撤销的严重性。
- 按触发器位置选 side：行检查器从右侧滑入，全局过滤从左侧。会话中途不要换边。
- 外部点击不自动关闭，所以始终渲染明确的关闭控件并响应 Escape。
- 标题首字母大写并命名实体（Deployment Details、Member Profile），而非页面动作。正文是偏阅读的散文。
- Sheet 打开时困住焦点，关闭时还给触发器行，让键盘用户保持在列表中的位置。
- 用指向标题的 aria-labelledby 播报 sheet；仅当正文短且承载关键信息时配 aria-describedby。
- 提供标为 Close 的可见关闭按钮（或 aria-label="Close" 的图标按钮）；读屏用户需要稳定的关闭标签。

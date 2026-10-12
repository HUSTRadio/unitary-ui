# 抽屉

> Route: `/components/drawer`

从底部打开面板，在当前页面中完成短表单或辅助操作。

[返回组件](#/components)

# 抽屉

drawer

从底部打开面板，在当前页面中完成短表单或辅助操作。

## 何时使用

- 小视口中需要展示短聚焦动作，如单个表单、筛选面板或与 Cancel 配对的主 CTA。
- 需要在保留当前浏览上下文的同时呈现辅助内容，但不需要桌面端侧边栏那样的持久面板。

## 何时不应使用

- 确认危险操作时不要用 Drawer——缺乏完全遮挡的遮罩降低了删除和吊销流程所需的严重程度信号。
- 桌面端需要交互性侧面板时使用 Sheet 而非 Drawer。
- 长内容或多步骤表单应路由到独立页面而非塞入 Drawer。

## 示例

### 默认抽屉

从底部弹出填充视口大部分高度的默认 Drawer，用于短表单或信息面板。

### 自定义高度

通过自定义高度参数控制 Drawer 的具体占屏比例以适应不同的内容量需求。

## 无障碍

- Drawer 打开时捕获内部焦点，关闭后将焦点返回到触发器元素。
- Escape 键关闭 Drawer，确保键盘用户的完整退出路径。
- DrawerTitle 应为 Title Case 名词短语，命名所展示的资源实体。

## 受控行为

- open 状态由父组件完全控制，内部不自行管理打开与关闭。
- 关闭时通过回调通知父组件以同步外部状态。
- 打开时禁止页面滚动，关闭后恢复。

## 响应式行为

- 专为移动端设计——仅在小型视口中使用；桌面端替代为 Sheet。
- Swipe-down 手势支持默认关闭行为，确保触屏设备的自然交互。
- 自定义高度 prop 可根据视口大小灵活适配内容。

## 主题行为

- 背景层、阴影和分隔线颜色跟随应用主题。
- 滚动锁定与主题无关。

## 实时示例

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Drawer, DrawerDescription, DrawerTitle } from "@hustradio/unitary-ui";
import { useState } from "react";

export function DrawerDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="secondary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
        <div className="flex flex-col items-stretch justify-start gap-2 p-12">
          <DrawerTitle className="text-center">A drawer title</DrawerTitle>
          <DrawerDescription className="text-center">Drawer body</DrawerDescription>
        </div>
      </Drawer>
    </>
  );
}
```

## 自定义高度

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Drawer, DrawerDescription, DrawerTitle } from "@hustradio/unitary-ui";
import { useState } from "react";

export function DrawerCustomHeight986065F9Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer height={200} show={open} onDismiss={() => setOpen(false)} verticalScroll>
        <div className="flex flex-col items-stretch justify-start gap-2 p-12">
          <DrawerTitle className="text-center">A drawer title</DrawerTitle>
          <DrawerDescription className="text-center">Drawer body</DrawerDescription>
        </div>
      </Drawer>
    </>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Drawer, DrawerTitle, DrawerDescription } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">show</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控抽屉状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按 Escape、点击外部或执行关闭手势后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的面板像素高度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 仅在小视口使用 Drawer。桌面端保持页面可交互的侧栏用 Sheet；需要阻断的决定用 Modal。
- 不要用 Drawer 确认破坏性动作。缺少完全遮罩会削弱删除和撤销流程需要的严重性信号；改用 Modal。
- Drawer 适合简短聚焦的移动端动作：单个表单、过滤面板、主 CTA 配 Cancel。
- 默认支持点击外部与下滑关闭；除非表单有未保存输入，否则都保留。
- DrawerTitle 是命名实体的首字母大写陈述句（Deployment Details、Filter Logs）。正文是句首大写散文，配一个主 动词 + 名词 按钮和字面 Cancel。
- 打开时把焦点困在 drawer 内，关闭时还给触发器。Escape 关闭 drawer。
- 打开时锁定 body 滚动、关闭时恢复，避免 iOS 橡皮筋滚动泄漏。

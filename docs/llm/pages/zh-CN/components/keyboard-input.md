# 键盘输入

> Route: `/components/keyboard-input`

显示触发操作的键盘输入。

[返回组件](#/components)

# 键盘输入

Keyboard Input

显示触发操作的键盘输入。

## 何时使用

- 在正文文本、菜单项和按钮后缀中显示快捷键提示，让用户直观了解触发某个操作所需的键盘组合。
- 在长篇文档中叙述某个快捷操作时，用 Kbd 元素呈现按键样式使文档更加专业易读。

## 何时不应使用

- 不要将修饰键拼写出来放在 children 中——应通过 boolean props（meta、shift、alt、ctrl）明确选择要展示的符号；组件不会检测操作系统。
- 标点符号应放在 Kbd 元素之外，如句号、逗号和「或」分隔符保留在周围的正文中，以免屏幕阅读器将它们误报为按键名称。

## 示例

### 修饰键组合

使用 boolean props 明确传递修饰键：meta、shift、alt、ctrl 分别渲染 ⌘、⇧、⌥、⌃；调用方负责选择适合目标平台的提示。

### 多键组合

展示多个按键的组合序列，如在文档中显示 Shift + K 表示需要先按住 Shift 再按 K 键。

### 小型键盘输入

在密集表面（如菜单行、命令栏项目或表格单元格）中使用 small 尺寸，以避免挤压相邻文本的显示空间。

### 纯命令按键

用于展示不带修饰键的单个按键或命名键，如 Enter、Esc 等，children 应为单个按键名称而非句子。

## 无障碍

- Kbd 元素使用语义化的键盘角色，屏幕阅读器能正确播报按键名称及其修饰组合。
- 修饰键由调用方显式选择；在面向特定平台的界面中，应传入与该平台快捷键一致的组合。

## 受控行为

不适用: Keyboard Input (Kbd) 是一个纯展示的 UI 组件，用于呈现按键样式的文本。它没有内部状态、事件处理或用户交互能力，所有行为由传入的 props 决定。

## 响应式行为

不适用: Kbd 组件本身不涉及响应式布局逻辑。其尺寸变化由所在容器的上下文决定——在密集表面使用 small 变体即可适应空间约束。

## 主题行为

- 按键的背景色、边框和文字颜色均从主题令牌获取，确保在浅色和深色模式下都有良好的对比度和视觉效果。
- 激活状态（如果有的话）的颜色切换也遵循主题规范。

## 实时示例

⌘⇧⌥⌃

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

export function KeyboardInputModifiers8527867BExample() {
  return (
    <>
      <Kbd meta />
      <Kbd shift />
      <Kbd alt />
      <Kbd ctrl />
    </>
  );
}
```

## 组合按键

⌘⇧

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

export function KeyboardInputCombination5F3258EAExample() {
  return <Kbd meta shift />;
}
```

## 小

/

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

export function KeyboardInputSmall81DB8EBBExample() {
  return <Kbd small>/</Kbd>;
}
```

## 纯文本命令

⌘K

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

export function KeyboardInputPlainCommand4E2140C6Example() {
  return (
    <Kbd plain meta>
      K
    </Kbd>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { KeyboardInput, Kbd } from "@/components/ui/keyboard-input";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">快捷键按键和分隔符。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 散文、菜单项和按钮后缀中的快捷键提示用 Kbd。在叙述快捷键的长文文档里直接写 ⌘ K 快捷键，让页面复制到纯文本时也一致。
- 通过布尔 props（meta、shift、alt、ctrl）传修饰键。组件不检测操作系统，调用方应按目标平台选择 meta 或 ctrl。
- children 是一个键、数字或命名键（K、7、Enter、Esc）。不要小写它、不要把修饰键拼写进去、也不要把句子塞进元素。
- 密集表面（菜单行、命令栏项、表格单元格）里默认尺寸挤压相邻文本时用 small。
- 标点位于元素之外：句号、逗号、or 分隔符保留在周围散文里，避免屏幕阅读器把它们读成按键。

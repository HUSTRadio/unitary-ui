# 中间截断

> Route: `/components/middle-truncate`

保留长标识符的开头和结尾。

[返回组件](#/components)

# 中间截断

Middle Truncate

保留长标识符的开头和结尾。

## 何时使用

- 需要展示文件路径、URL、哈希值和标识符等长文本时，同时保留前缀和后缀以便用户识别来源和目标。
- 用户需要既能快速识别标识符的大致含义（通过两端关键字符），又不会因为过长文本破坏布局整齐度时。

## 何时不应使用

- 当整个字符串都需要被用户看到时（如需要精确复制粘贴），不应截断——应提供完整的副本按钮或其他展开机制。
- 对于不需要前缀后缀信息的纯文本内容，不需要使用截断——完整显示更友好。

## 示例

### 中间截断示例

展示 Middle Truncate 的典型用法：将长路径 /home/user/documents/project/index.tsx 截断为 /home/user/doc…index.tsx，既保留了起止信息又控制了宽度。

### 恢复完整值

通过 title 属性或旁边的复制按钮暴露截断前的原始完整值，确保截断不会彻底销毁用户对源值的访问能力。

## 无障碍

- 截断后的文本通过 title 属性或邻近的复制按钮暴露完整原始值，确保屏幕阅读用户可以获取被截断的部分。
- 省略号本身使用专门的 Unicode 字符或 CSS 样式呈现，使其在屏幕阅读时被正确跳过而不产生额外的朗读干扰。

## 受控行为

不适用: Middle Truncate 只接收一个 value 字符串，不提供受控值或事件回调；截断结果由组件按外层容器的实际可用宽度自动计算，调用方无法从外部指定截断长度。value 清空时，已渲染的首尾片段会同步清空。

## 响应式行为

不适用: Middle Truncate 不依赖视口断点：它观察直接父容器的宽度，容器尺寸变化时重新测量并重新截断。组件自身没有断点式响应式规则，宽度约束完全由外层布局决定。

## 主题行为

不适用: Middle Truncate 的视觉呈现完全继承自父元素的文本样式——颜色、字号、字体均来自上下文。组件自身不提供独立的主题定制能力。

## 实时示例

https://example…loyments/latesthttps://example.com/teams/hustradio/projects/unitary-ui/deployments/latest

```tsx
import { MiddleTruncate } from "@/components/ui/middle-truncate";

export function MiddleTruncateExamplesE68EE04DExample() {
  return (
    <div className="w-64 font-mono text-copy-13 text-foreground">
      <MiddleTruncate value="https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest" />
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { MiddleTruncate } from "@/components/ui/middle-truncate";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">从中间缩短的文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 路径、URL、哈希和标识符（前缀与后缀都承载含义）用 Middle Truncate。
- 通过 title 或相邻复制功能暴露完整值；截断绝不能破坏对源值的访问。

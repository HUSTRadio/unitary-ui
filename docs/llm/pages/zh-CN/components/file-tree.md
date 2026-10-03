# 文件树

> Route: `/components/file-tree`

显示文件和文件夹目录，支持展开文件夹。

[返回组件](#/components)

# 文件树

file-tree

显示文件和文件夹目录，支持展开文件夹。

## 何时使用

- 需要在文档、示例或预览面板中展示项目的文件或目录层级结构时使用。
- 当用户需要展开/折叠文件夹来浏览多层级文件系统，且结构是只读的展示用途时。
- 在技术文档中演示项目结构、配置文件位置或生成结果的层次关系。

## 何时不应使用

- 不要用于需要交互式文件操作（重命名、删除、上传）的场景——应使用专门的 File Manager 组件。
- 当文件数量极大（数百以上）时，考虑使用分页或懒加载的文件浏览器而非一次性渲染整棵树。
- 扁平化的单一文件展示不需要 File Tree——直接使用 CodeBlock 或 Snippet 即可。

## 示例

### 默认文件树

展示默认样式的文件树组件，包含可展开的文件夹节点和文件图标。

## 无障碍

- 每个可展开的文件夹节点应使用 button 元素并维护 aria-expanded 状态，以便屏幕阅读器识别当前展开/折叠状态。
- 文件夹触发器是原生 button，可通过 Tab 聚焦并用 Enter 或 Space 展开/折叠；当前组件未实现树形方向键导航。
- 文件名称文本应作为焦点元素的唯一可读标签，避免依赖颜色或图标传递有意义的信息。

## 受控行为

- FileTreeItem 用 open 和 onOpenChange 控制展开状态；defaultOpen 设置初始状态。
- 组件不提供选中值或多选 API；需要选择功能时由页面自行组合。
- onOpenChange 在展开或收起时通知新状态，可用于保存展开记录。

## 响应式行为

- 在窄屏上文件树可能启用水平滚动以容纳过长的文件名，同时保持缩进层级不变。
- 文件夹按钮固定为 28px 高；触屏场景需由页面扩大点击区域。
- 需要限制宽度或允许滚动时，在外层容器设置对应样式。

## 主题行为

- 文件图标和文件夹图标的颜色随主题变量变化，在暗色/亮色模式下保证可见性。
- 选中态的高亮颜色和悬停状态的背景色遵循应用的主题色彩规范，包括焦点指示器的对比度。

## 实时示例

- - main.tsx

- public

```tsx
import { FileTree, FileTreeIcon, FileTreeItem, FileTreeLabel } from "@/components/ui/file-tree";

export function FileTreeDefault21B111CBExample() {
  return (
    <div className="w-full max-w-xs">
      <FileTree>
        <FileTreeItem>
          <FileTreeIcon type="folder-open" />
          <FileTreeLabel>app</FileTreeLabel>
          <FileTreeItem>
            <FileTreeIcon type="file" />
            <FileTreeLabel>main.tsx</FileTreeLabel>
          </FileTreeItem>
        </FileTreeItem>
        <FileTreeItem>
          <FileTreeIcon type="folder" />
          <FileTreeLabel>public</FileTreeLabel>
        </FileTreeItem>
      </FileTree>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { FileTree, FileTreeItem, FileTreeLabel, FileTreeIcon } from "@/components/ui/file-tree";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">FileTreeItem 的受控展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">FileTreeItem 的初始展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收 FileTreeItem 展开状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将叶子 FileTreeItem 渲染为链接。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"file" | "folder" | "folder-open"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">FileTreeIcon 图标类型。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"file"</td></tr></tbody></table>

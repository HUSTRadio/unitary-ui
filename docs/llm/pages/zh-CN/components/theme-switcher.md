# 主题切换器

> Route: `/components/theme-switcher`

在浅色、深色和系统主题之间切换。

[返回组件](#/components)

# 主题切换器

Theme Switcher

在浅色、深色和系统主题之间切换。

## 何时使用

-   作为应用中唯一的官方主题切换入口，放置在页脚或设置页面，提供简洁的主题选择。
-   需要通过 next-themes 管理主题状态时，Theme Switcher 已内置了图标、语义标签和 System 模式检测。

## 何时不应使用

-   不要在页面上多次重复放置主题切换器——Theme Switcher 应在整个应用中只出现一次，而不是每页各一份。
-   不要自行用 Switch 或三个图标按钮重写主题选择器——Theme Switcher 已经处理了图标、aria-label 和 System 模式检测等细节。

## 示例

### 默认主题切换器

展示默认大小的三色主题选择控件（Light / System / Dark）。

### 紧凑尺寸

演示 small 尺寸版本，适用于页脚、下拉菜单等高密度 chrome 区域。

## 无障碍

-   Theme Switcher 的每个选项都配有独立的 aria-label 描述，确保屏幕阅读器用户能准确了解可选的三种主题状态。
-   组件生成的标签直接从 theme keys（light、system、dark）组合而来，保持与 next-themes 翻译机制一致，不做额外修改。
-   当前激活的主题选项应有明确的焦点环和视觉选中状态标记，让键盘用户清楚看到当前的选择。

## 受控行为

-   Theme Switcher 通过 next-themes 读取和写入主题状态，应用根节点应在 GeistProvider 中包裹一次即可，无需将状态冗余映射到本地 React 状态。
-   当 provider 设置了 forcedTheme 时控件自动禁用；手动设置 disabled 仅在需要预览只读态时使用。
-   用户可以通过 onChange 回调拦截主题切换事件，但通常不建议在正常流程中干预——让 next-themes 自然管理即可。

## 响应式行为

-   Theme Switcher 在桌面端呈现完整的三选项行，在窄屏上不裁剪任何选项以保持完整功能。
-   compact 尺寸（small prop）在任意视口下都能保持紧凑排列，适合页脚和导航栏等空间受限区域。

## 主题行为

-   Theme Switcher 本身是主题切换的核心控件，其图标和文字随所选主题实时变化，是当前选中主题的可视化反映。
-   在 Settings 页面等有充足空间的场景中，使用默认尺寸确保标签文字有足够的呼吸空间。

## 实时示例

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher />
```

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher small />
```

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher disabled />
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">theme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"light" | "dark" | "system"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前主题模式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onThemeChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(theme: Theme) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收主题变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   规范 Light / System / Dark 控件用 Theme Switcher。每个应用放一次，页脚或设置里，不要跨页面重复。
-   密集 chrome（页脚、下拉）传 small；设置页有标签呼吸空间时用默认尺寸。
-   Theme Switcher 读写 next-themes，所以应用根部包一次 GeistProvider，不要把它镜像到本地 React state。
-   provider 设置 forcedTheme 时控件自动禁用；手动 disabled 仅用于控件的只读预览。
-   不要用 Switch 或三个图标按钮重建主题选择器。Theme Switcher 已处理图标、每选项 aria-label 与 System 检测。
-   组件由主题键（light、system、dark）自行组合标签；保持原样以便经 next-themes 可翻译。

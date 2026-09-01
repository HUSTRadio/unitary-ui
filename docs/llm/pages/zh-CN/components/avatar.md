# 头像

> Route: `/components/avatar`

使用图片或回退内容表示用户或团队。

[返回组件](#/components)

# 头像

Avatar

使用图片或回退内容表示用户或团队。

## 何时使用

- 用 Avatar 表示单个用户或团队，并在头像旁显示姓名和角色信息。
- 使用堆叠（Stacked）Avatar 展示一组人员，如团队成员列表或评论者集合。
- 为图片加载失败或缺失的场景提供首字母或占位色块回退；需要叠加图标时使用 AvatarWithIcon。

## 何时不应使用

- 不需要在卡片、表格等组件内部重复渲染头像——优先用 Entity 行或其他结构化布局。
- 不要用 Avatar 展示非人物的实体（产品 logo、系统图标等），这些应使用 Icon 或通用占位符。
- 不要将 Avatar 用作装饰性背景元素；它的语义是表示一个真实的人。

## 示例

### 尺寸

展示 24、32、48 px 等数值尺寸，匹配密集行、列表提及和档案页头的上下文。

### 回退状态

演示当图片不可用时的首字母和占位色块回退方案。

### 堆叠与重叠

展示多个 Avatar 的重叠排列方式，包括固定重叠间距。

## 无障碍

- 图片头像应设置有意义的 alt 文本；首字母或占位色块头像可通过 title 提供人物名称。
- 堆叠 Avatar 组应在容器上添加 aria-label 说明总人数，避免逐条朗读造成冗余。
- 无图回退的首字母头像应使用高对比度的背景色，确保文字可读。

## 受控行为

不适用: Avatar 是无交互的展示型组件，不接收受控属性；图像回退由内部逻辑处理，无需外部状态控制。

## 响应式行为

- Avatar 的尺寸通过 props 显式指定而非响应式断点，因此在任何视口下表现一致。
- AvatarGroup 在传入 limit 且成员超出限制时，自动以 +N Avatar 汇总其余成员；未传 limit 时会展示全部成员。

## 主题行为

- Avatar 的边框和加载状态跟随主题变量，支持暗色/亮色模式自动适配。
- 首字母回退使用固定的中性色表面；GitHub、GitLab、Bitbucket 头像根据 username 构造对应服务的图片 URL。

## 实时示例

![Vercel](https://github.com/vercel.png)ALLG

## 分组

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=64)![用户 rauchg 的头像](https://github.com/rauchg.png?size=64)

![用户 christopherkindl 的头像](https://github.com/christopherkindl.png?size=64)![用户 rauno 的头像](https://github.com/rauno.png?size=64)![用户 shuding 的头像](https://github.com/shuding.png?size=64)![用户 skllcrn 的头像](https://github.com/skllcrn.png?size=64)+2

```tsx
import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={32}
  />
  <AvatarGroup
    limit={4}
    members={[
      { username: "christopherkindl" },
      { username: "rauno" },
      { username: "shuding" },
      { username: "skllcrn" },
      { username: "almonk" },
    ]}
    size={32}
  />
</div>;
```

## 堆叠顺序

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=64)![用户 rauchg 的头像](https://github.com/rauchg.png?size=64)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=64)![用户 rauchg 的头像](https://github.com/rauchg.png?size=64)

```tsx
import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={32}
  />
  <AvatarGroup
    reverse
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={32}
  />
</div>;
```

## 重叠

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=32)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=32)![用户 rauchg 的头像](https://github.com/rauchg.png?size=32)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=48)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=48)![用户 rauchg 的头像](https://github.com/rauchg.png?size=48)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=64)![用户 rauchg 的头像](https://github.com/rauchg.png?size=64)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=96)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=96)![用户 rauchg 的头像](https://github.com/rauchg.png?size=96)

```tsx
import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-6">
  <AvatarGroup
    overlap="auto"
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={16}
  />
  <AvatarGroup
    overlap="auto"
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={24}
  />
  <AvatarGroup
    overlap="auto"
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={32}
  />
  <AvatarGroup
    overlap="auto"
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={48}
  />
</div>;
```

## 固定重叠

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=48)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=48)![用户 rauchg 的头像](https://github.com/rauchg.png?size=48)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=48)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=48)![用户 rauchg 的头像](https://github.com/rauchg.png?size=48)

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=48)![用户 severinlandolt 的头像](https://github.com/severinlandolt.png?size=48)![用户 rauchg 的头像](https://github.com/rauchg.png?size=48)

```tsx
import { AvatarGroup } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <AvatarGroup
    overlap={10}
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={24}
  />
  <AvatarGroup
    overlap={6}
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={24}
  />
  <AvatarGroup
    overlap={0}
    members={[{ username: "evilrabbit" }, { username: "severinlandolt" }, { username: "rauchg" }]}
    size={24}
  />
</div>;
```

## 大小

![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=48)![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=96)

```tsx
import { Avatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <Avatar size={24} username="evilrabbit" />
  <Avatar size={32} username="evilrabbit" />
  <Avatar size={48} username="evilrabbit" />
</div>;
```

## Git

![用户 rauchg 的头像](https://github.com/rauchg.png?size=64)![用户 severinlandolt 的头像](https://gitlab.com/severinlandolt.png?size=64)![用户 evilrabbit 的头像](https://bitbucket.org/evilrabbit/avatar/64)

```tsx
import { GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <GitHubAvatar size={32} username="rauchg" />
  <GitLabAvatar size={32} username="severinlandolt" />
  <BitbucketAvatar size={32} username="evilrabbit" />
</div>;
```

## 自定义图标

```tsx
import { AvatarWithIcon } from "@/components/ui/avatar";
import { ArrowDownCircle, CircleCheck, Clock } from "lucide-react";

<div className="flex flex-wrap items-center gap-4">
  <AvatarWithIcon
    icon={<ArrowDownCircle className="size-3.5" aria-hidden />}
    size={32}
    iconBackground
  />
  <AvatarWithIcon
    icon={<CircleCheck className="size-3.5" aria-hidden />}
    size={32}
    iconBackground
  />
  <AvatarWithIcon icon={<Clock className="size-3.5" aria-hidden />} size={32} iconBackground />
</div>;
```

## 字母

SLEKCK

```tsx
import { Avatar } from "@/components/ui/avatar";

<div className="flex flex-wrap items-center gap-4">
  <Avatar letter="SL" placeholder size={32} />
  <Avatar letter="EK" placeholder size={32} />
  <Avatar letter="CK" placeholder size={32} />
</div>;
```

## 占位符

```tsx
import { Avatar } from "@/components/ui/avatar";

<Avatar placeholder size={90} />;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  Avatar,
  AvatarGroup,
  AvatarWithIcon,
  GitHubAvatar,
  GitLabAvatar,
  BitbucketAvatar,
} from "@/components/ui/avatar";
```

原生属性：`ComponentProps<typeof AvatarPrimitive.Root>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Avatar 或 AvatarGroup 的头像直径（像素）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">32</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">图片地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">alt</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">图片的无障碍说明。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">username</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用作图片来源的 GitHub 用户名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">letter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">一到两个后备首字母。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示占位外壳。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用作无障碍标签的实体名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">members</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvatarGroupMember[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">AvatarGroup 必填的成员列表。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">limit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">AvatarGroup 的最大头像槽位数，超出时包含 +N 汇总头像。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto" | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">AvatarGroup 的重叠量。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">reverse</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">反转 AvatarGroup 的重叠层叠顺序。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 使用 Avatar 表示单个用户或团队；堆叠的 Avatar 表示一组人。
- 提供回退内容（首字母、图标或占位符），以便图片加载失败或缺失时头像仍可识别。
- 设置有意义的 alt 文本，让屏幕阅读器读出头像代表谁。
- 按上下文选择尺寸：sm 用于密集行，default 用于列表和提及，lg 用于个人资料头部。

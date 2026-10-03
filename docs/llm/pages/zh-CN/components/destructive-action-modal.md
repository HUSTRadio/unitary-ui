# 危险操作确认框

> Route: `/components/destructive-action-modal`

确认删除等高风险操作；输入指定短语后才能提交。

[返回组件](#/components)

# 危险操作确认框

destructive-action-modal

确认删除等高风险操作；输入指定短语后才能提交。

## 何时使用

- 当操作具有不可逆或严重后果（如删除、吊销密钥、降级计划）且需要强制用户明确意图时使用。
- 对于可恢复但后果严重的数据删除操作，使用此组件并在标题中说明影响范围。
- 需要在提交前让用户输入确认短语以证明其理解操作后果时。

## 何时不应使用

- 常规低风险确认不需要二次验证的保存草稿、丢弃未保存更改等场景，应使用普通 Modal。
- 操作结果仅涉及轻度界面刷新或可立即撤销的情况不应引入额外的输入门槛。
- 非阻塞式轻量提示应使用 Toast 而非 Modal。

## 示例

### 默认危险操作确认

展示标题、描述文本和输入验证的最小结构，用户须输入与标题完全匹配的短语才能点击确认。

### 可恢复的危险操作

操作本身可撤销但仍需谨慎处理，使用此模式并移除不可恢复警告横幅。

### 加载中状态

按钮处于加载时两个按钮均禁用，调用方管理打开状态并在 API 完成后关闭。

### 错误状态处理

API 失败时保持模态框打开让用户可以重试，而不是静默关闭。

## 无障碍

- 输入验证在打开时获取焦点以便用户立即开始输入，提交按钮在值完全匹配前禁用。
- 标题应使用 Title Case 命名陈述句（如 Delete Project），而非疑问句。
- loading 状态会禁用两个按钮以防止重复提交。

## 受控行为

- 由父组件控制 open：请求成功后关闭，失败时保持打开以便重试。
- loading 属性同时禁用两个按钮，由父组件管理交互状态。
- 输入字段在打开时自动聚焦并持续校验匹配性。

## 响应式行为

- 模态框在小屏幕上显示为全屏覆盖，在大屏上居中显示。
- 标题和输入字段的字体大小根据视口宽度进行响应式调整。

## 主题行为

- 使用语义化变体颜色表示危险操作（红色渐变）。
- 支持暗色/亮色主题切换，红色警示信号在所有主题下保持一致。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalDefault21B111CBExample() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description={
          <>
            <span className="font-medium">next-year-boilerplate</span> and all its deployments,
            domains, and environment variables will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="next-year-boilerplate"
      />
    </>
  );
}
```

## 可撤销操作

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalReversible6E7D6697Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Disable Unitary Authentication
      </Button>
      <DestructiveActionModal
        confirmLabel="Disable Unitary Authentication"
        description="Anyone signed in will be able to manage this integration without being a member of your workspace."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Disable Unitary Authentication"
        verificationPhrase="disable unitary authentication"
      />
    </>
  );
}
```

## 加载中

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalLoadingDC380888Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        irreversibleDescription="Deleting my-project cannot be undone."
        loading
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          /* no-op while loading */
        }}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}
```

## 带错误

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalWithError3E9E4249Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        error="Couldn’t delete project. Try again."
        irreversibleDescription="Deleting my-project cannot be undone."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控对话框状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">处理取消与关闭。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onConfirm</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">负责执行破坏性操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">对话框标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">后果说明。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">confirmLabel</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">确认按钮文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">verificationPhrase</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">解锁确认所需精确输入的短语。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">verificationLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">验证提示中使用的名词。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">irreversibleDescription</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的不可撤销操作警告带。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用两个操作并显示加载状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | Error</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">行内确认错误。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 动作具有破坏性且需要摩擦时（删除、轮换、撤销、断开、降级）用本组件而非 Modal；确认短语输入 强制刻意操作。
- 对后果严重到值得停顿的可逆破坏性动作也可用。保留 确认短语输入，去掉不可逆提示条。
- 常规确认（保存草稿、放弃更改、不保存关闭）不要用；操作风险 很低时 确认短语输入 显得戏剧化——用普通 Modal。
- 标题是首字母大写的陈述句 动词 + 名词，绝不是疑问句。Delete Project，而非 Delete this project?。
- confirmLabel 与标题 1:1 匹配。绝不用通用词（Confirm、OK、Continue），也不用裸动词（Delete）。
- loading 会禁用两个按钮。调用方拥有 open——不要从 onConfirm 自行关闭。API 落定后关闭，或出错时保持打开让用户重试。
- 验证输入打开即聚焦，用户可立即输入。提交保持禁用，直到值与验证短语完全匹配。
- 本组件是库内仅有的两处模糊遮罩之一。遮罩模糊用于表达前景层级——主屏、AI 建议或临时前台——且必须走共享的遮罩模糊 token（--uni-overlay-backdrop-blur），绝不写裸模糊档位。新增任何模糊遮罩都需要设计确认。

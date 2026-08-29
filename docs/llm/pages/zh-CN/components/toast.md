# 轻提示

> Route: `/components/toast`

临时显示的简短消息。

[返回组件](#/components)

# 轻提示

Toast

临时显示的简短消息。

## 何时使用

- 对用户发起的操作给出非阻塞的确认反馈，如 'Domain added'、'Project archived'、'Deployment canceled'。
- 异步流程结束时发送最终的状态通知（成功或错误），不需要在中间步骤堆叠多条 toast。

## 何时不应使用

- 不要单独用 Toast 处理计费失败、权限拒绝或构建失败等需要用户处理的严重问题——需搭配持续性更强的消息行提供恢复指引。
- 不要用 Toast 叙述连续的异步流程；只需在最终步骤发出最终的 success 或 error toast 即可，避免在等待期间堆积消息。
- 不要在完成类 toast 中包含 successfully——遵循 {名词}{过去分词} 格式（如 Blob deleted），不要写 Blob successfully deleted。

## 示例

### 默认轻提示

展示默认的 toast 外观：短暂显示后自动消失的消息通知。

### 带动作按钮

演示带有操作按钮的 toast，允许用户执行 Undo 等后续操作。

### 成功状态

展示成功类型的 toast 提示（绿色标识），表示操作顺利完成。

## 无障碍

- Toast 区域通过 aria-live='polite' 向屏幕阅读器广播新消息，确保辅助技术用户能感知到通知的出现。
- 仅对真正阻断性的错误才使用 assertive 类型，普通操作确认统一使用 polite 以避免打断用户当前阅读。
- 对于 preserve={true} 的 toast，应在关闭前确保用户已有足够时间读取或执行所需操作。

## 受控行为

- Toast 通过调用 useToasts() hook 的 .show() 方法编程式触发，可以在任何组件上下文中弹出一条消息。
- 默认情况下 toast 会自动消失；传入 preserve={true} 时可防止自动关闭，要求用户先阅读或采取行动后再手动关闭。
- 不同类型的 toast（.success(), .warning(), .error()）提供对应的语义化和色彩区分。

## 响应式行为

- Toast 通知在窄屏和宽屏上均自动适配容器宽度，确保消息不会被过度截断影响可读性。
- 移动端 Toast 定位在底部安全区域内，避免遮挡底部导航栏或手势操作区域。

## 主题行为

- 各种语义类型的 Toast（成功、警告、错误）在暗色和亮色模式下各有对应的配色方案，保证一致的视觉体验。
- Toast 的背景色、文字颜色和边框样式通过主题变量统一管理，支持在全局自定义定制。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 多行

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence.",
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 带 JSX

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: (
          <>
            <span className="text-heading-14">The Evil Rabbit</span> jumped over the fence.
          </>
        ),
        preserve: true,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 带链接

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: (
          <>
            The Evil Rabbit jumped over the{" "}
            <a
              href="#/components"
              className="font-medium text-foreground underline underline-offset-4"
            >
              fence again
            </a>
            .
          </>
        ),
        preserve: true,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 保留

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 操作

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", action: "Undo" })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 撤销

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: "The Evil Rabbit jumped over the fence.",
        onUndoAction: () => undefined,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 成功

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 警告

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## 错误

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button typeName="button" onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}>
    Show Toast
  </Button>
  <Toasts />
</>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Toasts, useToasts } from "@/components/ui/toast";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">message</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(options: ToastOptions) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">创建消息 Toast 并返回数字 ID。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">success</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">创建成功 Toast。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">warning</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">创建警告 Toast。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">创建错误 Toast。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(id: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按 ID 关闭 Toast。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 用户发起动作的非阻塞确认用 toast：Domain added、Project archived、Deployment canceled。
- 计费失败、权限拒绝或需要用户处理的构建失败不能只用 toast。配 ≤6 词的 toast（Build failed）加携带恢复步骤的持久行。
- 默认 toast 自动消失；仅当消息消失前用户必须读取或操作时传 preserve。
- 不要堆 toast 叙述一个异步流程；在终态步骤发成功或失败 toast。
- 单句、句首大写；单一语句时无句尾句号。
- 完成类 toast 遵循 {Noun} {过去分词}：Blob deleted、Domain added。绝不加 successfully。
- 错误 toast 是带句号的两句，以恢复步骤结尾：Couldn't verify domain. Try again.。
- toast 动词与破坏性按钮动词 1:1 配对（Delete Project 然后 Project deleted）。
- toast 区域用 aria-live="polite" 播报；把 assertive 保留给需要立即打断的警报。

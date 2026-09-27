# 错误边界

> Route: `/components/error-boundary`

隔离 React 渲染失败，并以恢复界面替换出错子树。

[返回组件](#/components)

# 错误边界

error-boundary

隔离 React 渲染失败，并以恢复界面替换出错子树。

## 何时使用

- 路由、页面分区或复杂组件崩溃时，不应连带卸载整个应用。
- 需要通过 onError 上报渲染错误，并在路由或数据标识变化后自动重试失败子树。

## 何时不应使用

- 事件处理器、异步回调或服务端渲染错误不会被 React 错误边界捕获，应在对应执行路径单独处理。
- 普通请求失败或字段校验错误应渲染 Error、Error Card 或行内反馈，不应通过抛出渲染异常表达。

## 示例

### 隔离渲染失败

主动触发一个子树渲染错误，并通过自定义 fallback 重置示例。

## 无障碍

- 内置恢复界面使用 role=alert；自定义 fallback 也应说明失败区域和下一步操作，并在需要即时播报时提供等价 alert 语义。
- 重试按钮必须保持明确的动作与目标，例如“重新加载部署预览”，不要使用含糊的“确定”。

## 受控行为

- resetKeys 使用浅比较；数组长度或任一项变化时清除已捕获错误并重新渲染 children。
- 自定义 fallback 是静态 ReactNode；如需在 fallback 内重置外部状态，应由调用方提供带处理函数的节点或通过 key 重新挂载边界。

## 响应式行为

不适用: 错误隔离行为与视口无关；fallback 的响应式布局由调用方负责。

## 主题行为

- 内置 fallback 使用最小内联样式以避免依赖业务主题；自定义 fallback 应使用当前应用的语义色与排版 token。

## 实时示例

```tsx
import * as React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";

function BrokenPreview(): never {
  throw new Error("Deployment preview failed to render");
}

export function ErrorBoundaryDefault37A8EEC1Example() {
  const [failed, setFailed] = React.useState(false);

  return (
    <ErrorBoundary
      key={failed ? "failed" : "ready"}
      name="Deployment Preview"
      fallback={
        <div role="alert" className="space-y-3 rounded-lg border p-4">
          <p className="font-medium">Deployment Preview Failed</p>
          <Button typeName="button" onClick={() => setFailed(false)}>
            Reload Deployment Preview
          </Button>
        </div>
      }
    >
      {failed ? (
        <BrokenPreview />
      ) : (
        <Button typeName="button" onClick={() => setFailed(true)}>
          Trigger Render Error
        </Button>
      )}
    </ErrorBoundary>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">由边界保护的渲染子树。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fallback</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">捕获错误后渲染的自定义恢复界面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resetKeys</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">unknown[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">浅比较的键；任一变化会清除已捕获错误。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: Error, info: React.ErrorInfo) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">上报捕获的渲染错误与组件栈。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">name</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于日志和内置恢复界面的边界名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">className</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅应用于内置恢复界面的类名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在路由、页面分区或组件边界使用 Error Boundary，避免单个渲染失败卸载整个应用。
- 恢复界面应说明哪个区域失败，并提供安全的重试、重置或导航出口。
- 当路由或数据标识变化应清除已捕获错误时，使用 resetKeys。
- 通过 onError 上报失败；渲染错误边界不会捕获事件处理器、异步回调或服务端渲染错误。

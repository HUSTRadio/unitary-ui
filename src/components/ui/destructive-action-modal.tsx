import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { CircleAlert, Loader2, TriangleAlert } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * DestructiveActionModal — 危险操作确认弹窗（docs/geist-markdown-refs/components/destructive-action-modal.md 官方语义）。
 * 受控组件，官方 prop 契约：
 *   open / onCancel / onConfirm / title / description / confirmLabel /
 *   verificationPhrase / verificationLabel / irreversibleDescription / loading / error
 * 官方实测（2026-08 vercel.com/geist/destructive-action-modal 实时 DOM/computed style）：
 * - form 包裹；label[for] + input aria-labelledby 关联验证提示
 *   「To confirm, type the project name “next-year-boilerplate”」（<b> 加粗短语）
 * - 打开即聚焦 input；submit 仅在输入精确匹配 verificationPhrase 时启用
 * - 确认按钮 h:32 pad:0 6px 500 14px/21px r:6px：启用 bg #da2f35/fg #f5f5f5
 *   （本库用 destructive 语义 token），禁用 bg gray-100/fg gray-700
 * - irreversibleDescription 红色 Note 带（bg #ffebeb、border #fff0f0、r:6px、
 *   p 6px 12px、gap 12px、Warning 图标 aria-hidden）——省略该 prop 即 Reversible
 * - loading 禁用双按钮并在主按钮显示 spinner；error 在输入框下内联提示（role=alert）
 * - Enter 仅在门打开时提交；Escape / 外点 / Cancel 关闭；关闭后焦点返还触发元素（Radix）
 */

interface DestructiveActionModalProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 取消 / 关闭回调（Escape、外点、Cancel 按钮） */
  onCancel?: () => void;
  /** 确认回调（仅在验证门打开且非 loading 时触发） */
  onConfirm?: () => void;
  /** Title Case 标题（Delete Project） */
  title: string;
  /** sentence case 后果描述（可含 JSX） */
  description?: React.ReactNode;
  /** 主按钮文案，与 title 1:1 */
  confirmLabel: string;
  /** 需要精确输入的验证短语（资源名，如 my-project） */
  verificationPhrase: string;
  /** 验证提示中的名词（如 project name → To confirm, type the project name "…"） */
  verificationLabel?: string;
  /** 不可撤销说明（红色 Note 带）。省略该 prop 表示可逆操作，不渲染红带 */
  irreversibleDescription?: React.ReactNode;
  /** 加载态：禁用双按钮 + 主按钮 spinner */
  loading?: boolean;
  /** 内联错误（string 或 Error），显示在输入框下方 */
  error?: string | Error;
  /** 透传给内容面板的 className */
  className?: string;
  /** 覆盖标题提供的可访问名称。 */
  "aria-label"?: string;
  /** 覆盖内部标题的关联 id。 */
  "aria-labelledby"?: string;
  /** 覆盖内部描述的关联 id；无 description 时组件不会声明该关联。 */
  "aria-describedby"?: string;
}

function DestructiveActionModal({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel,
  verificationPhrase,
  verificationLabel,
  irreversibleDescription,
  loading = false,
  error,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: DestructiveActionModalProps) {
  const { t } = useI18n();
  const [input, setInput] = React.useState("");
  const id = React.useId();
  const inputId = `${id}-prompt`;
  const labelId = `${id}-label`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      setInput("");
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!open && wasOpenRef.current) {
      const target = restoreFocusRef.current;
      window.requestAnimationFrame(() => {
        if (target?.isConnected) target.focus();
      });
    }
    wasOpenRef.current = Boolean(open);
  }, [open]);

  const errorMessage = error instanceof Error ? error.message : error;
  const canConfirm = input === verificationPhrase;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canConfirm || loading) return;
    onConfirm?.();
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel?.();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--uni-z-modal)] bg-black/50 backdrop-blur-(--uni-overlay-backdrop-blur) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-(--uni-motion-overlay) ease-pop motion-reduce:animate-none" />
        <DialogPrimitive.Content
          data-slot="destructive-action-modal"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
          aria-describedby={ariaDescribedBy ?? (description ? descriptionId : undefined)}
          className={cn(
            "fixed top-1/2 left-1/2 z-[var(--uni-z-modal)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-alpha-400 bg-background shadow-[var(--material-shadow-modal)] outline-none",
            "max-h-[min(800px,80vh)] overflow-y-auto",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-(--uni-motion-overlay) ease-pop motion-reduce:animate-none",
            className,
          )}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-5 text-copy-14 text-muted-foreground">
              <header className="mb-5">
                <DialogPrimitive.Title asChild>
                  <h3 id={titleId} className="text-heading-20 text-left text-foreground">
                    {title}
                  </h3>
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description asChild>
                    <div
                      id={descriptionId}
                      className="mt-2 mb-1 text-copy-14 text-muted-foreground"
                    >
                      {description}
                    </div>
                  </DialogPrimitive.Description>
                )}
              </header>

              <div className="space-y-6">
                {irreversibleDescription && (
                  <div
                    data-slot="destructive-action-modal-note"
                    className="flex w-full flex-wrap items-center gap-3 rounded-md border border-red-200 bg-red-100 px-3 py-1.5 text-copy-14 text-red-900"
                  >
                    <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1 break-words">{irreversibleDescription}</div>
                  </div>
                )}

                <div className="flex flex-col items-stretch gap-2">
                  <label
                    htmlFor={inputId}
                    id={labelId}
                    className="text-sm leading-5 text-foreground"
                  >
                    {t("To confirm, type the {verificationLabel} “", {
                      verificationLabel: verificationLabel ?? t("value"),
                    })}
                    <b className="font-semibold break-words" translate="no">
                      {verificationPhrase}
                    </b>
                    ”
                  </label>
                  <Input
                    id={inputId}
                    aria-labelledby={labelId}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    autoFocus
                    className="h-9"
                  />
                  {errorMessage && (
                    <div
                      role="alert"
                      aria-atomic="true"
                      className="flex items-start text-sm leading-5 text-red-900"
                    >
                      <CircleAlert className="mr-2 mt-0.5 size-4 shrink-0" aria-hidden />
                      <span className="break-words">{errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <footer
              data-slot="destructive-action-modal-footer"
              className="sticky bottom-0 flex shrink-0 items-center justify-between gap-4 bg-background p-3"
            >
              <Button
                typeName="button"
                type="secondary"
                size="small"
                disabled={loading}
                onClick={onCancel}
              >
                {t("Cancel")}
              </Button>
              <button
                type="submit"
                disabled={!canConfirm || loading}
                className={cn(
                  // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 32px 视觉
                  "inline-flex h-8 shrink-0 items-center justify-center rounded-lg px-1.5 text-sm font-medium outline-none transition-colors focus-ring disabled:pointer-events-none pointer-coarse:min-h-11 pointer-coarse:min-w-11",
                  canConfirm && !loading
                    ? "bg-destructive text-destructive-foreground hover:bg-danger-hover hover:text-destructive-foreground"
                    : "bg-gray-100 text-gray-700",
                )}
              >
                {loading && <Loader2 className="mr-[3px] size-3.5 animate-spin" aria-hidden />}
                <span className="inline-block truncate px-1.5">{confirmLabel}</span>
              </button>
            </footer>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { DestructiveActionModal };
export type { DestructiveActionModalProps };

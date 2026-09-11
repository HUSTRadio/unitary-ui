import * as React from "react";
import { Popover } from "radix-ui";

import { Button, buttonVariants } from "@/components/ui/button";
import { RatingButtons, type RatingValue } from "@/components/ui/rating-pill";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Feedback — 与实时 vercel.com/geist/feedback 对齐的默认 Popover 与 Inline 胶囊。
 * 默认形态由 32px 次级按钮打开 340px 锚定表单；Inline 形态从 274×48 胶囊
 * 在同一容器内展开至 336px。评分 hover/selected 统一使用官方蓝色语义。
 *
 * 主题（topic）契约：只有默认 Popover 变体渲染主题 Select（Inline 变体不渲染）。
 * topic 作为 `onSubmit` 第 4 个参数传出；`includeTopicInMetadata` 为 true 时
 * 才额外合并进第 3 个参数 metadata（键名 topic），避免默认行为悄悄污染 metadata。
 */
type FeedbackRatingValue = RatingValue;
type FeedbackType = "inline";
type FeedbackMetadata = Record<string, string>;
type FeedbackTopicChangeHandler = (topic: string) => void;
type FeedbackTopic = string | undefined;
type FeedbackSubmitHandler = (
  rating: FeedbackRatingValue | undefined,
  text: string,
  metadata?: FeedbackMetadata,
  topic?: string,
) => void;

const TOPICS = [
  "AI",
  "Accounts and Access Controls",
  "Billing",
  "CDN (Firewall, Caching)",
  "CI/CD (Builds, Deployments, Environment Variables)",
  "Dashboard Interface (Navigation, UI Issues)",
  "Domains",
  "Frameworks",
  "Marketplace and Integrations",
] as const;

/** 稳定空数组，避免每次渲染都生成新引用触发 select 分支抖动。 */
const EMPTY_TOPICS: readonly string[] = [];

/**
 * Inline 悬浮表单的退出动画时长（ms）。必须与 --uni-duration-fast 保持同步：
 * 退出动画播完后才卸载节点，否则收起会在动画中途被切断。
 */
const INLINE_EXIT_MS = 150;

/** 供调用方以 programming 方式复用官方主题清单（例如自建 topics 时作基集）。 */
const FEEDBACK_TOPICS: readonly string[] = TOPICS;

interface FeedbackProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "defaultValue" | "prefix" | "suffix"
> {
  label?: string;
  copy?: string;
  dryRun?: boolean;
  type?: FeedbackType;
  showTopics?: boolean;
  metadata?: FeedbackMetadata;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  defaultValue?: FeedbackRatingValue;
  /** 常显主题选择器；传入后 Select 始终渲染（不再需要 showTopics 开关）。 */
  topics?: readonly string[];
  /** 受控主题；与 onTopicChange 配对使用。 */
  topic?: FeedbackTopic;
  /** 非受控初始主题。 */
  defaultTopic?: string;
  /** 主题变化回调。 */
  onTopicChange?: FeedbackTopicChangeHandler;
  /** 收到第三参 metadata 时，是否额外把 topic 合并进去。 */
  includeTopicInMetadata?: boolean;
  onSubmit?: FeedbackSubmitHandler;
}

interface FeedbackFormProps {
  copy?: string;
  dryRun: boolean;
  includeTopicInMetadata: boolean;
  includeRatings: boolean;
  metadata?: FeedbackMetadata;
  onSuccessfulSubmit: () => void;
  onSubmit?: FeedbackSubmitHandler;
  rating?: FeedbackRatingValue;
  setRating: (rating: FeedbackRatingValue) => void;
  topics: readonly string[];
  text: string;
  setText: (text: string) => void;
  topic: FeedbackTopic;
  setTopic: FeedbackTopicChangeHandler;
}

function MarkdownSupported({ id }: { id: string }) {
  const { t } = useI18n();
  return (
    <div
      id={id}
      data-slot="feedback-support"
      className="flex h-4 items-center justify-end gap-1 text-[12px] leading-4 text-gray-900"
    >
      <svg aria-hidden fill="none" height="14" viewBox="0 0 22 14" width="22">
        <path
          clipRule="evenodd"
          d="M19.5 1.25H2.5C1.80964 1.25 1.25 1.80964 1.25 2.5V11.5C1.25 12.1904 1.80964 12.75 2.5 12.75H19.5C20.1904 12.75 20.75 12.1904 20.75 11.5V2.5C20.75 1.80964 20.1904 1.25 19.5 1.25ZM2.5 0C1.11929 0 0 1.11929 0 2.5V11.5C0 12.8807 1.11929 14 2.5 14H19.5C20.8807 14 22 12.8807 22 11.5V2.5C22 1.11929 20.8807 0 19.5 0H2.5ZM3 3.5H4H4.25H4.6899L4.98715 3.82428L7 6.02011L9.01285 3.82428L9.3101 3.5H9.75H10H11V4.5V10.5H9V6.79807L7.73715 8.17572L7 8.97989L6.26285 8.17572L5 6.79807V10.5H3V4.5V3.5ZM15 7V3.5H17V7H19.5L17 9.5L16 10.5L15 9.5L12.5 7H15Z"
          fill="var(--uni-gray-700)"
          fillRule="evenodd"
        />
      </svg>
      {t("Markdown supported.")}
    </div>
  );
}

function FeedbackForm({
  copy,
  dryRun,
  includeTopicInMetadata,
  includeRatings,
  metadata,
  onSuccessfulSubmit,
  onSubmit,
  rating,
  setRating,
  text,
  setText,
  topic,
  setTopic,
  topics,
}: FeedbackFormProps) {
  const { t } = useI18n();
  const topicId = React.useId();
  const supportId = React.useId();
  // topicOptions 已由 Feedback 按变体裁剪（Inline 恒为空数组），这里不再单看 showTopics。
  const showTopicSelect = topics.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dryRun) return;
    if (includeTopicInMetadata) {
      onSubmit?.(rating, text, topic ? { ...metadata, topic } : metadata, topic);
      onSuccessfulSubmit();
      return;
    }
    onSubmit?.(rating, text, metadata, topic);
    onSuccessfulSubmit();
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div data-slot="feedback-form-body" className="flex flex-col gap-2 p-2">
        {copy ? <p className="px-1 text-copy-14 text-gray-900">{copy}</p> : null}
        {showTopicSelect ? (
          <label className="sr-only" htmlFor={topicId}>
            {t("Product topic selection")}
          </label>
        ) : null}
        {showTopicSelect ? (
          <select
            id={topicId}
            aria-label={t("Product topic selection")}
            value={topic ?? ""}
            onChange={(event) => setTopic(event.target.value)}
            className="h-9 w-full cursor-pointer truncate appearance-none rounded-md border-none bg-background-100 px-3 pr-9 text-copy-14 text-gray-1000 shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] outline-none transition-[box-shadow] duration-(--uni-duration-fast) hover:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)] focus:shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]"
          >
            <option disabled value="">
              {t("Select a topic...")}
            </option>
            {(topics.length > 0 ? topics : TOPICS).map((topicName) => (
              <option key={topicName} value={topicName}>
                {t(topicName)}
              </option>
            ))}
          </select>
        ) : null}
        <label className="block">
          <span className="sr-only">{t("Feedback")}</span>
          <span className="block w-full overflow-hidden rounded-md shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] transition-[box-shadow] duration-(--uni-duration-fast) hover:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)] focus-within:shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]">
            <textarea
              data-slot="feedback-textarea"
              aria-describedby={supportId}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t("Your feedback...")}
              className="block h-[100px] w-full resize-none appearance-none border-none bg-background-100 px-3 py-2.5 text-copy-14 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </span>
        </label>
        <MarkdownSupported id={supportId} />
      </div>
      <div
        data-slot="feedback-form-footer"
        className="flex items-center justify-between border-t border-gray-200 bg-gray-100 p-3"
      >
        {includeRatings ? <RatingButtons value={rating} onValueChange={setRating} /> : <span />}
        <Button typeName="submit" size="small" className="min-w-0">
          {t("Send")}
        </Button>
      </div>
    </form>
  );
}

function Feedback({
  label,
  copy,
  dryRun = false,
  type,
  showTopics = false,
  topics,
  topic: controlledTopic,
  defaultTopic,
  onTopicChange,
  includeTopicInMetadata = false,
  metadata,
  prefix,
  suffix,
  defaultValue,
  onSubmit,
  className,
  ...props
}: FeedbackProps) {
  const { t } = useI18n();
  const isInline = type === "inline";
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<FeedbackRatingValue | undefined>(defaultValue);
  const [text, setText] = React.useState("");
  const [uncontrolledTopic, setUncontrolledTopic] = React.useState<FeedbackTopic>(defaultTopic);
  const topicIsControlled = Object.prototype.hasOwnProperty.call(props, "topic") ||
    controlledTopic !== undefined;
  const topic = topicIsControlled ? controlledTopic : uncontrolledTopic;
  // Inline 胶囊按设计不渲染主题 Select（见文件头契约），这里对 Inline 强制清空，
  // 避免调用方误以为 Inline 也能收集主题。
  const topicOptions: readonly string[] = isInline
    ? EMPTY_TOPICS
    : (topics ?? (showTopics ? TOPICS : EMPTY_TOPICS));
  const inlineRef = React.useRef<HTMLDivElement>(null);

  const setTopic = React.useCallback<FeedbackTopicChangeHandler>(
    (nextTopic) => {
      if (!topicIsControlled) setUncontrolledTopic(nextTopic);
      onTopicChange?.(nextTopic);
    },
    [onTopicChange, topicIsControlled],
  );

  /**
   * 悬浮层的卸载状态机：`open` 为真时渲染；`open` 转假后保持 `closing` 为真一个
   * 动画时长，让退出动画播完再卸载。收起同样有动画，而不是瞬间消失。
   */
  const [closing, setClosing] = React.useState(false);
  const wasOpen = React.useRef(false);

  React.useEffect(() => {
    if (open) {
      wasOpen.current = true;
      setClosing(false);
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    setClosing(true);
    const timer = window.setTimeout(() => setClosing(false), INLINE_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  const reset = React.useCallback(() => {
    setOpen(false);
    setRating(undefined);
    setText("");
    if (!topicIsControlled) setUncontrolledTopic(defaultTopic);
  }, [defaultTopic, topicIsControlled]);

  const closeInline = React.useCallback(() => {
    setOpen(false);
    setRating(undefined);
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && inlineRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, []);

  React.useEffect(() => {
    if (!isInline || !open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!inlineRef.current?.contains(event.target as Node)) closeInline();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInline();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeInline, isInline, open]);

  const formProps: FeedbackFormProps = {
    copy: isInline ? undefined : copy,
    dryRun,
    includeRatings: !isInline,
    includeTopicInMetadata,
    metadata,
    onSuccessfulSubmit: reset,
    onSubmit,
    rating,
    setRating,
    text,
    setText,
    topic,
    setTopic,
    topics: topicOptions,
  };

  if (isInline) {
    const inlineLabel = copy ?? t("Was this helpful?");
    return (
      // 外层只负责定位上下文：高度恒为胶囊的 48px，不随展开/收起变化。
      <div className={cn("relative w-fit", className)} data-feedback-inline="" {...props}>
        <div
          ref={inlineRef}
          data-slot="rating-pill"
          data-state={open ? "open" : "closed"}
          onBlurCapture={(event) => {
            // 仅当焦点确实落在容器外的元素上才收起；relatedTarget 为 null（窗口失焦、
            // 焦点转移到非元素、或浏览器未实现该字段）时不能当作“离开”，否则会误清评分。
            if (!open) return;
            const nextFocus = event.relatedTarget;
            if (!(nextFocus instanceof Node)) {
              const root = event.currentTarget;
              window.setTimeout(() => {
                if (root.isConnected && !root.contains(document.activeElement)) closeInline();
              }, 0);
              return;
            }
            if (!event.currentTarget.contains(nextFocus)) closeInline();
          }}
          className={cn(
            // 只承担“胶囊本体”的视觉：内边距、圆角、底色、阴影。
            // 文档流高度恒为 h-12，展开不从它身上取高度。
            "relative flex h-12 w-fit shrink-0 items-center gap-2 bg-background-100 py-2 pr-2 pl-4",
            "shadow-[var(--material-shadow-menu)]",
            // 圆角必须用有限值：--radius-capsule / rounded-full 是“实际无穷大”，
            // 过渡到 rounded-xl 时会被浏览器钳制到 min(w,h)/2，末段出现半径突跳。
            "rounded-capsule-interpolable transition-[border-radius] duration-(--uni-duration-fast) ease-out motion-reduce:transition-none",
            open ? "rounded-xl" : "rounded-capsule-interpolable",
          )}
        >
          <div
            data-slot="feedback-inline-header"
            className="flex h-12 w-full shrink-0 items-center gap-2 py-2 pr-2 pl-4"
          >
            {prefix ? (
              <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
                {prefix}
              </span>
            ) : null}
            {/* label 永不截断（无 truncate / whitespace-nowrap）。
                收起态胶囊是 w-fit，宽度由内容决定；展开态表单浮层另有固定宽度，
                胶囊本身宽度保持不变（不参与展开视觉）。 */}
            <p className="text-copy-14 whitespace-nowrap text-gray-900">{inlineLabel}</p>
            {suffix ? (
              <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
                {suffix}
              </span>
            ) : null}
            <RatingButtons
              value={rating}
              onValueChange={(nextRating) => {
                setRating(nextRating);
                setOpen(true);
              }}
            />
          </div>
          {/* 悬浮表单：绝对定位到胶囊上方（bottom-full），脱离文档流，
              因此展开/收起都不改变父容器与胶囊的垂直度量。
              展开用 fade+slide 入场；收起时先播退出动画，动画结束后再卸载。 */}
          {open || closing ? (
            <div
              data-slot="feedback-form-region"
              data-state={open ? "open" : "closed"}
              className={cn(
                "absolute bottom-full left-0 mb-2 w-[336px] max-w-[calc(100vw-32px)] rounded-xl bg-background-100 shadow-[var(--material-shadow-menu)]",
                "duration-(--uni-duration-fast) ease-out motion-reduce:animate-none",
                open
                  ? "animate-in fade-in-0 slide-in-from-bottom-1"
                  : "animate-out fade-out-0 slide-out-to-bottom-1 fill-mode-forwards",
              )}
            >
              <FeedbackForm {...formProps} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-fit", className)} {...props}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          data-slot="feedback-trigger"
          type="button"
          className={buttonVariants({ type: "secondary", size: "small", className: "h-8" })}
        >
          {prefix ? (
            <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
              {prefix}
            </span>
          ) : null}
          <span className="inline-block truncate">{label ?? t("Feedback")}</span>
          {suffix ? (
            <span className="ml-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
              {suffix}
            </span>
          ) : null}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            data-slot="feedback-popup"
            role="dialog"
            align="center"
            // 该浮层通常挂在页面底部，默认向下弹会被视口底边裁切；优先向上，
            // 上方空间不足时由 avoidCollisions 翻转到下方。
            side="top"
            avoidCollisions
            collisionPadding={16}
            sideOffset={8}
            className={cn(
              "z-50 w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl bg-background-100 shadow-[var(--material-shadow-menu)] outline-none",
              "origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none",
            )}
          >
            <FeedbackForm {...formProps} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export { Feedback, FEEDBACK_TOPICS };
export type {
  FeedbackProps,
  FeedbackRatingValue,
  FeedbackType,
  FeedbackMetadata,
  FeedbackSubmitHandler,
  FeedbackTopic,
  FeedbackTopicChangeHandler,
};

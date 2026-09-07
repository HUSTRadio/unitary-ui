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
 */
type FeedbackRatingValue = RatingValue;
type FeedbackType = "inline";
type FeedbackMetadata = Record<string, string>;
type FeedbackSubmitHandler = (
  rating: FeedbackRatingValue | undefined,
  text: string,
  metadata?: FeedbackMetadata,
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
  onSubmit?: FeedbackSubmitHandler;
}

interface FeedbackFormProps {
  copy?: string;
  dryRun: boolean;
  includeRatings: boolean;
  metadata?: FeedbackMetadata;
  onSuccessfulSubmit: () => void;
  onSubmit?: FeedbackSubmitHandler;
  rating?: FeedbackRatingValue;
  setRating: (rating: FeedbackRatingValue) => void;
  showTopics: boolean;
  text: string;
  setText: (text: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
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
      {t("supported.")}
    </div>
  );
}

function FeedbackForm({
  copy,
  dryRun,
  includeRatings,
  metadata,
  onSuccessfulSubmit,
  onSubmit,
  rating,
  setRating,
  showTopics,
  text,
  setText,
  topic,
  setTopic,
}: FeedbackFormProps) {
  const { t } = useI18n();
  const topicId = React.useId();
  const supportId = React.useId();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dryRun) return;
    onSubmit?.(rating, text, topic ? { ...metadata, topic } : metadata);
    onSuccessfulSubmit();
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div data-slot="feedback-form-body" className="flex flex-col gap-2 p-2">
        {copy ? <p className="px-1 text-copy-14 text-gray-900">{copy}</p> : null}
        {showTopics ? (
          <label className="sr-only" htmlFor={topicId}>
            {t("Product topic selection")}
          </label>
        ) : null}
        {showTopics ? (
          <select
            id={topicId}
            aria-label={t("Product topic selection")}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="h-9 w-full cursor-pointer truncate appearance-none rounded-md border-none bg-background-100 px-3 pr-9 text-copy-14 text-gray-1000 shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] outline-none transition-[box-shadow] duration-(--uni-duration-fast) hover:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)] focus:shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]"
          >
            <option disabled value="">
              {t("Select a topic...")}
            </option>
            {TOPICS.map((topicName) => (
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
  const [topic, setTopic] = React.useState("");
  const inlineRef = React.useRef<HTMLDivElement>(null);

  const reset = React.useCallback(() => {
    setOpen(false);
    setRating(undefined);
    setText("");
    setTopic("");
  }, []);

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
    metadata,
    onSuccessfulSubmit: reset,
    onSubmit,
    rating,
    setRating,
    showTopics,
    text,
    setText,
    topic,
    setTopic,
  };

  if (isInline) {
    const inlineLabel = copy ?? t("Was this helpful?");
    return (
      <div className={cn("w-fit", className)} data-feedback-inline="" {...props}>
        <div
          ref={inlineRef}
          data-slot="rating-pill"
          data-state={open ? "open" : "closed"}
          onBlurCapture={(event) => {
            if (
              open &&
              event.relatedTarget &&
              !event.currentTarget.contains(event.relatedTarget as Node)
            ) {
              closeInline();
            }
          }}
          className={cn(
            "inline-flex flex-col overflow-hidden bg-background-100 shadow-[var(--material-shadow-menu)]",
            "max-w-[calc(100vw-32px)] transition-[width,border-radius] duration-(--uni-duration-fast) ease-out motion-reduce:transition-none",
            open ? "h-auto w-[336px] rounded-xl" : "h-12 w-[274px] rounded-full",
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
            <p className="truncate text-copy-14 text-gray-900">{inlineLabel}</p>
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
          <div
            data-slot="feedback-form-region"
            aria-hidden={open ? undefined : "true"}
            inert={!open}
            className={cn(
              "-mb-0.5 grid w-full transition-[grid-template-rows] duration-(--uni-duration-fast) ease-out motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <FeedbackForm {...formProps} />
            </div>
          </div>
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

export { Feedback };
export type {
  FeedbackProps,
  FeedbackRatingValue,
  FeedbackType,
  FeedbackMetadata,
  FeedbackSubmitHandler,
};

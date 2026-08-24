import * as React from "react";

import { Button } from "@/components/ui/button";
import { RatingPill, type RatingValue } from "@/components/ui/rating-pill";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Feedback — 胶囊 rating bar + 文本反馈（docs/geist-markdown-refs/components/feedback.md + 实时 vercel.com/geist/feedback 实测）。
 * 官方形态：一条 rating bar（胶囊 trigger → 点击展开评分交互 → 点外部/Escape 收起）；选中后胶囊以语义色着色。
 * - label：trigger 文本（Title Case，默认 "Feedback"）；type="inline" 时 trigger 固定为 "Was this helpful?"
 * - copy：评分行旁提示 header（sentence case）；showTopics：预定义主题 Select；metadata：透传 key-value
 * - dryRun：演示态（不触发 onSubmit）；prefix/suffix：trigger 前后缀图标
 * - 4 表情（Hate it / Not great / It's okay / Love it!）官方 Geist 表情 SVG 整体引用（feedback-faces.tsx），
 *   每档独立语义色（love→success 绿 / okay→gray / not-great→warning 黄 / hate→error 红），着色只作用于胶囊容器
 * - 展开 panel w-[340px] rounded-xl；body（copy / topics / textarea / Markdown supported 提示）+ footer（表情行 + Send）
 * - 提交（Send）后关闭并归还焦点、复位评分/文本；dryRun 语义保留
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
  /** trigger 文本（官方 label，Title Case，默认 "Feedback"） */
  label?: string;
  /** 评分行旁提示 header（官方 copy，sentence case） */
  copy?: string;
  /** 演示态：不触发 onSubmit（官方 dryRun） */
  dryRun?: boolean;
  /** 内联变体（官方 type，trigger 固定 "Was this helpful?"） */
  type?: FeedbackType;
  /** 显示预定义主题 Select（官方 showTopics） */
  showTopics?: boolean;
  /** 任意 key-value 元数据（官方 metadata，透传给 onSubmit） */
  metadata?: FeedbackMetadata;
  /** trigger 前缀图标（官方 prefix） */
  prefix?: React.ReactNode;
  /** trigger 后缀图标（官方 suffix） */
  suffix?: React.ReactNode;
  /** 初始评分（非受控） */
  defaultValue?: FeedbackRatingValue;
  /** 提交回调（评分 + 文本 + 元数据含 topic） */
  onSubmit?: FeedbackSubmitHandler;
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
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<FeedbackRatingValue | undefined>(defaultValue);
  const [text, setText] = React.useState("");
  const [topic, setTopic] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!dryRun) {
      onSubmit?.(rating, text, topic ? { ...metadata, topic } : metadata);
    }
    setOpen(false);
    setRating(undefined);
    setText("");
    setTopic("");
  };

  const isInline = type === "inline";
  const pillLabel = isInline ? t("Was this helpful?") : (label ?? t("Feedback"));

  return (
    <div className={cn("w-fit", className)} {...props}>
      <RatingPill
        label={pillLabel}
        prefix={prefix}
        suffix={suffix}
        value={rating}
        onValueChange={setRating}
        onSubmit={() => setOpen(true)}
      />
      {/* 内嵌表单区：选中表情后展开（copy / topics / textarea / Send） */}
      {open ? (
        <form
          className="mt-2 flex w-[340px] flex-col gap-2 rounded-xl border border-gray-alpha-400 bg-background-100 p-2 shadow-[0_4px_8px_rgba(0,0,0,0.08)]"
          onSubmit={handleSubmit}
        >
          {copy ? <p className="px-1 text-label-14 text-gray-900">{copy}</p> : null}
          {showTopics ? (
            <label className="sr-only" htmlFor="feedback-topic">
              {t("Product topic selection")}
            </label>
          ) : null}
          {showTopics ? (
            <select
              id="feedback-topic"
              aria-label={t("Product topic selection")}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="peer w-full cursor-pointer truncate appearance-none rounded-[6px] border-none bg-background-100 px-3 pr-9 text-[14px] leading-5 text-gray-1000 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] transition-[box-shadow] duration-200 h-9 hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)] focus:outline-hidden focus:!shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]"
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
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t("Your feedback...")}
            aria-label={t("Feedback")}
            className="w-full resize-none appearance-none border-none bg-background-100 px-3 py-2.5 text-[14px] leading-5 text-foreground outline-none placeholder:text-muted-foreground shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] rounded-md transition-[box-shadow] duration-200 focus:shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)] h-[100px]"
          />
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center justify-end gap-1 p-0 text-label-12 text-gray-900">
              <svg
                aria-hidden
                fill="none"
                height="14"
                viewBox="0 0 22 14"
                width="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M19.5 1.25H2.5C1.80964 1.25 1.25 1.80964 1.25 2.5V11.5C1.25 12.1904 1.80964 12.75 2.5 12.75H19.5C20.1904 12.75 20.75 12.1904 20.75 11.5V2.5C20.75 1.80964 20.1904 1.25 19.5 1.25ZM2.5 0C1.11929 0 0 1.11929 0 2.5V11.5C0 12.8807 1.11929 14 2.5 14H19.5C20.8807 14 22 12.8807 22 11.5V2.5C22 1.11929 20.8807 0 19.5 0H2.5ZM3 3.5H4H4.25H4.6899L4.98715 3.82428L7 6.02011L9.01285 3.82428L9.3101 3.5H9.75H10H11V4.5V10.5H9V6.79807L7.73715 8.17572L7 8.97989L6.26285 8.17572L5 6.79807V10.5H3V4.5V3.5ZM15 7V3.5H17V7H19.5L17 9.5L16 10.5L15 9.5L12.5 7H15Z"
                  fill="var(--ds-gray-700)"
                  fillRule="evenodd"
                />
              </svg>
              {t("supported.")}
            </div>
            <Button typeName="submit" size="small">
              {t("Send")}
            </Button>
          </div>
        </form>
      ) : null}
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

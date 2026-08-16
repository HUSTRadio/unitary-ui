import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Frown, Heart, Meh, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Feedback — 表情评分 + 文本反馈（docs/geist-markdown-refs/components/feedback.md + 实时 vercel.com/geist/feedback 实测）。
 * 官方形态：Radix Popover（trigger 按钮 → role="dialog" 折叠 panel），提交后关闭并归还焦点。
 * - label：trigger 文本（Title Case，默认 "Feedback"）；type="inline" 时 trigger 固定为 "Was this helpful?"
 * - copy：评分行旁提示 header（sentence case）；showTopics：预定义主题 Select；metadata：透传 key-value
 * - dryRun：演示态（不触发 onSubmit）；prefix/suffix：trigger 前后缀图标
 * - 4 表情（Hate it / Not great / It's okay / Love it!），size-8 rounded-full radio，hover bg-blue-300
 * - panel w-[340px] rounded-xl；内容区 p-2（copy / topics / textarea / Markdown supported 提示）；footer 表情行 + Send
 */
const RATINGS = [
  { value: "hate", label: "Hate it", icon: Frown },
  { value: "not-great", label: "Not great", icon: Meh },
  { value: "okay", label: "It's okay", icon: Smile },
  { value: "love", label: "Love it!", icon: Heart },
] as const;

type FeedbackRatingValue = (typeof RATINGS)[number]["value"];

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

interface FeedbackProps {
  /** trigger 文本（官方 label，Title Case，默认 "Feedback"） */
  label?: string;
  /** 评分行旁提示 header（官方 copy，sentence case） */
  copy?: string;
  /** 演示态：不触发 onSubmit（官方 dryRun） */
  dryRun?: boolean;
  /** 内联变体（官方 type，trigger 固定 "Was this helpful?"） */
  type?: "inline";
  /** 显示预定义主题 Select（官方 showTopics） */
  showTopics?: boolean;
  /** 任意 key-value 元数据（官方 metadata，透传给 onSubmit） */
  metadata?: Record<string, string>;
  /** trigger 前缀图标（官方 prefix） */
  prefix?: React.ReactNode;
  /** trigger 后缀图标（官方 suffix） */
  suffix?: React.ReactNode;
  /** 初始评分（非受控） */
  defaultValue?: FeedbackRatingValue;
  /** 提交回调（评分 + 文本 + 元数据含 topic） */
  onSubmit?: (
    rating: FeedbackRatingValue | undefined,
    text: string,
    metadata?: Record<string, string>,
  ) => void;
}

function Feedback({
  label = "Feedback",
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
}: FeedbackProps & Omit<React.ComponentProps<"div">, "onSubmit" | "defaultValue" | "prefix" | "suffix">) {
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

  return (
    <div className={cn("w-fit", className)} {...props}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          {isInline ? (
            <button
              type="button"
              className="outline-none m-0 p-0 border-0 align-baseline no-underline bg-transparent cursor-pointer text-copy-14 text-gray-900"
            >
              Was this helpful?
            </button>
          ) : (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              className="outline-none m-0 p-0 border-0 align-baseline no-underline bg-transparent relative cursor-pointer select-none text-[14px] font-medium leading-[21px] text-gray-900 rounded-[6px] px-1.5 py-1 hover:bg-gray-alpha-200 transition-colors duration-150 focus-ring"
            >
              {prefix ? (
                <span className="mr-1 shrink-0 inline-flex items-center justify-center [&>svg]:size-4">
                  {prefix}
                </span>
              ) : null}
              <span className="truncate inline-block">{label}</span>
              {suffix ? (
                <span className="ml-1 shrink-0 inline-flex items-center justify-center [&>svg]:size-4">
                  {suffix}
                </span>
              ) : null}
            </button>
          )}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            role="dialog"
            sideOffset={4}
            className="w-[340px] rounded-xl bg-background-100 shadow-[0_0_0_1px_var(--ds-gray-alpha-400),0_4px_8px_rgba(0,0,0,0.08)] z-[300] outline-none animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <form className="h-full" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 p-2">
                {copy ? (
                  <p className="text-label-14 text-gray-900">{copy}</p>
                ) : null}
                {showTopics ? (
                  <label className="sr-only" htmlFor="feedback-topic">
                    Product topic selection
                  </label>
                ) : null}
                {showTopics ? (
                  <select
                    id="feedback-topic"
                    aria-label="Product topic selection"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="peer w-full cursor-pointer truncate appearance-none rounded-[6px] border-none bg-background-100 px-3 pr-9 text-[14px] leading-5 text-gray-1000 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] transition-[box-shadow] duration-200 h-9 hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)] focus:outline-hidden focus:shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]"
                  >
                    <option disabled value="">
                      Select a topic...
                    </option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                ) : null}
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Your feedback..."
                  aria-label="Feedback"
                  className="w-full resize-none appearance-none border-none bg-background-100 px-3 py-2.5 text-[14px] leading-5 text-foreground outline-none placeholder:text-muted-foreground shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] rounded-md focus:shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)] h-[100px]"
                />
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
                  supported.
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-alpha-200 bg-gray-alpha-100 p-3">
                <span className="flex items-center gap-[1px] text-gray-900">
                  {RATINGS.map(({ value, label: ratingLabel, icon: Icon }) => {
                    const selected = rating === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={`Select ${ratingLabel} emoji`}
                        onClick={() => setRating(value)}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-[50%] border-none bg-transparent p-0 text-gray-900 transition-[background] duration-200 hover:bg-blue-alpha-300",
                          "focus-ring",
                          selected && "bg-gray-alpha-200",
                          "[&_svg]:size-4 [&_svg]:shrink-0",
                        )}
                      >
                        <Icon aria-hidden />
                      </button>
                    );
                  })}
                </span>
                <Button typeName="submit" size="small">
                  Send
                </Button>
              </div>
            </form>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export { Feedback, type FeedbackRatingValue };

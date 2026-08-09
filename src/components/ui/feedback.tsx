import * as React from "react";
import { Frown, Heart, Meh, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Feedback — 表情评分 + 文本反馈（docs/geist-markdown-refs/components/feedback.md 官方语义）。
 * 导出：Feedback, FeedbackRating, FeedbackTextarea, FeedbackSubmit。
 * - Feedback：状态容器（评分 + 文本），组合三个子部件；submit 在未选评分时禁用
 * - FeedbackRating：4 个表情评分（Frown / Meh / Smile / Heart）
 * - FeedbackTextarea：textarea（w-full rounded-[8px] border gray-alpha-400 bg-background p-3 text-copy-14）
 * - FeedbackSubmit：Button size="sm"
 */

const RATINGS = [
  { value: "unhappy", label: "Unhappy", icon: Frown },
  { value: "neutral", label: "Neutral", icon: Meh },
  { value: "happy", label: "Happy", icon: Smile },
  { value: "love", label: "Love", icon: Heart },
] as const;

type FeedbackRatingValue = (typeof RATINGS)[number]["value"];

interface FeedbackProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** 初始评分（非受控） */
  defaultValue?: FeedbackRatingValue;
  /** 提交回调（评分 + 文本） */
  onSubmit?: (rating: FeedbackRatingValue | undefined, text: string) => void;
}

function Feedback({ className, defaultValue, onSubmit, ...props }: FeedbackProps) {
  const [rating, setRating] = React.useState<FeedbackRatingValue | undefined>(defaultValue);
  const [text, setText] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(rating, text);
  };

  return (
    <form
      data-slot="feedback"
      className={cn("flex w-full flex-col gap-3", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FeedbackRating value={rating} onValueChange={setRating} />
      <FeedbackTextarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Your feedback..."
        aria-label="Feedback"
      />
      <div className="flex justify-end">
        <FeedbackSubmit disabled={!rating}>Send</FeedbackSubmit>
      </div>
    </form>
  );
}

interface FeedbackRatingProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** 当前选中的评分 */
  value?: FeedbackRatingValue;
  /** 选中变化回调 */
  onValueChange?: (value: FeedbackRatingValue) => void;
}

function FeedbackRating({ className, value, onValueChange, ...props }: FeedbackRatingProps) {
  return (
    <div
      data-slot="feedback-rating"
      role="radiogroup"
      aria-label="Rating"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {RATINGS.map(({ value: ratingValue, label, icon: Icon }) => {
        const selected = value === ratingValue;
        return (
          <button
            key={ratingValue}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            data-state={selected ? "selected" : "idle"}
            onClick={() => onValueChange?.(ratingValue)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all outline-none [&_svg]:size-4 [&_svg]:shrink-0",
              "hover:bg-gray-alpha-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected && "bg-gray-alpha-200 text-foreground",
            )}
          >
            <Icon aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

const FeedbackTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="feedback-textarea"
      className={cn(
        "w-full rounded-[8px] border border-gray-alpha-400 bg-background p-3 text-copy-14",
        "placeholder:text-muted-foreground",
        "input-focus-ring",
        "resize-none",
        className,
      )}
      {...props}
    />
  ),
);
FeedbackTextarea.displayName = "FeedbackTextarea";

function FeedbackSubmit({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button type="submit" size="sm" className={className} {...props} />;
}

export { Feedback, FeedbackRating, FeedbackTextarea, FeedbackSubmit, type FeedbackRatingValue };

import * as React from "react";

import {
  FeedbackHateFace,
  FeedbackLoveFace,
  FeedbackNotGreatFace,
  FeedbackOkayFace,
} from "@/components/ui/feedback-faces";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * RatingPill — 官方 Geist 反馈胶囊（vercel.com 页脚「Was this helpful?」实测 2026-08-24）。
 *
 * 官方形态：单行胶囊内直接内嵌 4 个圆形表情按钮（无需点击展开）。
 * - 胶囊：h-12 rounded-full bg-background-100 shadow-border-small，pl-4 pr-2 py-2
 * - label 文本 + 4 个圆形(rounded-[50%]) 32px 表情按钮横排（gap-[1px]）
 * - 点击表情即选中并提交：选中后胶囊按语义色着色（love→success 绿 / okay→gray /
 *   not-great→warning 黄 / hate→error 红），着色只作用于容器不动 SVG fill
 * - 完整反馈表单（copy / topics / textarea）由 Feedback 在胶囊下方渲染
 *
 * 语义色映射（用户要求四色，优于官方单色）：
 *   love      → success（--success 绿）
 *   okay      → neutral（gray 中性）
 *   not-great → warning（--warning 黄）
 *   hate      → error（--danger 红）
 */
export type RatingValue = "hate" | "not-great" | "okay" | "love";
export type RatingTone = "success" | "neutral" | "warning" | "error";

/** 四档评分 → 语义色 */
export const RATING_TONE: Record<RatingValue, RatingTone> = {
  love: "success",
  okay: "neutral",
  "not-great": "warning",
  hate: "error",
};

/** 四档评分选项（顺序 = 官方评分行：Hate → Not great → Okay → Love） */
export const RATING_OPTIONS: ReadonlyArray<{
  value: RatingValue;
  label: string;
  tone: RatingTone;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: "hate", label: "Hate it", tone: "error", icon: FeedbackHateFace },
  { value: "not-great", label: "Not great", tone: "warning", icon: FeedbackNotGreatFace },
  { value: "okay", label: "It's okay", tone: "neutral", icon: FeedbackOkayFace },
  { value: "love", label: "Love it!", tone: "success", icon: FeedbackLoveFace },
];

/** 胶囊的语义色（选中时：浅底 + 语义色文字/描边，避免与面部 SVG 固定强调色撞色） */
export const RATING_TONE_CAPSULE: Record<RatingTone, string> = {
  success: "border-success/40 bg-success-soft text-success",
  neutral: "border-gray-alpha-500 bg-gray-alpha-200 text-gray-900",
  warning: "border-warning/40 bg-warning-soft text-warning",
  error: "border-danger/40 bg-danger-soft text-danger",
};

/** 表情按钮的 hover 语义色（四档各自着色） */
export const RATING_TONE_FACE_HOVER: Record<RatingTone, string> = {
  success: "hover:bg-success-soft hover:text-success",
  neutral: "hover:bg-gray-alpha-200 hover:text-gray-900",
  warning: "hover:bg-warning-soft hover:text-warning",
  error: "hover:bg-danger-soft hover:text-danger",
};

/** 表情按钮的选中语义色 */
export const RATING_TONE_FACE_SELECTED: Record<RatingTone, string> = {
  success: "bg-success-soft text-success",
  neutral: "bg-gray-alpha-200 text-gray-900",
  warning: "bg-warning-soft text-warning",
  error: "bg-danger-soft text-danger",
};

interface RatingPillProps {
  /** 胶囊内 label 文本 */
  label: React.ReactNode;
  /** label 前缀图标 */
  prefix?: React.ReactNode;
  /** label 后缀图标 */
  suffix?: React.ReactNode;
  /** 受控选中评分 */
  value?: RatingValue;
  /** 非受控初始评分 */
  defaultValue?: RatingValue;
  /** 评分变化回调（点击表情触发） */
  onValueChange?: (value: RatingValue) => void;
  /** 点击表情提交回调（选中后触发，Feedback 用于组装 metadata） */
  onSubmit?: (value: RatingValue) => void;
  /** 应用到胶囊容器 */
  className?: string;
}

function RatingPill({
  label,
  prefix,
  suffix,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  className,
}: RatingPillProps) {
  const { t } = useI18n();
  const [ratingInternal, setRatingInternal] = React.useState<RatingValue | undefined>(
    defaultValue,
  );

  const isRatingControlled = onValueChange !== undefined;
  const rating = isRatingControlled ? value : ratingInternal;
  const tone = rating ? RATING_TONE[rating] : undefined;

  const handleSelect = (next: RatingValue) => {
    setRatingInternal(next);
    onValueChange?.(next);
    onSubmit?.(next);
  };

  return (
    <div
      data-slot="rating-pill"
      className={cn(
        // 官方形态：单行胶囊内嵌 4 表情（2026-08-24 实测：
        // h-48(48px) rounded-full bg-white shadow-border-small pl-4 pr-2 py-2）
        "inline-flex h-12 select-none items-center gap-3 rounded-full border bg-background-100 py-2 pr-2 pl-4",
        "shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] transition-colors duration-(--ds-duration-base)",
        tone && RATING_TONE_CAPSULE[tone],
        className,
      )}
    >
      {prefix ? (
        <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
          {prefix}
        </span>
      ) : null}
      <span className="truncate text-[14px] font-medium leading-[21px] text-gray-900">
        {label}
      </span>
      {suffix ? (
        <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
          {suffix}
        </span>
      ) : null}
      <span
        role="radiogroup"
        aria-label={t("Feedback rating")}
        className="flex items-center gap-[1px] text-gray-900"
      >
        {RATING_OPTIONS.map(({ value: optionValue, label: ratingLabel, icon: Icon, tone: faceTone }) => {
          const selected = rating === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t("Select {rating} emoji", {
                rating: t(ratingLabel),
              })}
              onClick={() => handleSelect(optionValue)}
              className={cn(
                "flex size-8 cursor-pointer items-center justify-center rounded-[50%] border-none bg-transparent p-0 outline-none transition-colors duration-(--ds-duration-base) focus-ring",
                RATING_TONE_FACE_HOVER[faceTone],
                selected && RATING_TONE_FACE_SELECTED[faceTone],
                "[&_svg]:size-4 [&_svg]:shrink-0",
              )}
            >
              <Icon aria-hidden />
            </button>
          );
        })}
      </span>
    </div>
  );
}

export { RatingPill };
export type { RatingPillProps };

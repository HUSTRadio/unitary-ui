import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import {
  FeedbackHateFace,
  FeedbackLoveFace,
  FeedbackNotGreatFace,
  FeedbackOkayFace,
} from "@/components/ui/feedback-faces";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * RatingPill — 胶囊评分条（item 12 设计决策，shard-D）。
 *
 * 官方形态（vercel.com 站点页脚「Was this helpful?」实测）：一条胶囊 rating bar，
 * 收起为一行 trigger，点击展开 4 表情，点外部 / Escape 收起；选中后胶囊以对应语义色着色。
 * 本地实现基于 Radix Popover（modal=false），外点关闭由 onOpenChange 天然处理。
 *
 * 语义色映射（用户要求四色，优于官方单色；着色只作用于容器，不动 feedback-faces SVG fill）：
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

/**
 * 胶囊 trigger 的语义色（soft：浅底 + 语义色文字/描边，避免与面部 SVG 固定强调色撞色）。
 * 未选中走默认中性胶囊（border-gray-alpha-400 bg-gray-alpha-100）。
 */
export const RATING_TONE_CAPSULE: Record<RatingTone, string> = {
  success: "border-success/40 bg-success-soft text-success",
  neutral: "border-gray-alpha-500 bg-gray-alpha-200 text-gray-900",
  warning: "border-warning/40 bg-warning-soft text-warning",
  error: "border-danger/40 bg-danger-soft text-danger",
};

/** 展开面板内表情按钮的 hover 语义色（四档评分按钮各自着色） */
export const RATING_TONE_FACE_HOVER: Record<RatingTone, string> = {
  success: "hover:bg-success-soft hover:text-success",
  neutral: "hover:bg-gray-alpha-200 hover:text-gray-900",
  warning: "hover:bg-warning-soft hover:text-warning",
  error: "hover:bg-danger-soft hover:text-danger",
};

/** 展开面板内表情按钮的选中语义色 */
export const RATING_TONE_FACE_SELECTED: Record<RatingTone, string> = {
  success: "bg-success-soft text-success",
  neutral: "bg-gray-alpha-200 text-gray-900",
  warning: "bg-warning-soft text-warning",
  error: "bg-danger-soft text-danger",
};

interface RatingPillProps {
  /** 胶囊 trigger 文案（收起态一行） */
  label: React.ReactNode;
  /** trigger 前缀图标 */
  prefix?: React.ReactNode;
  /** trigger 后缀图标 */
  suffix?: React.ReactNode;
  /** 受控选中评分 */
  value?: RatingValue;
  /** 非受控初始评分 */
  defaultValue?: RatingValue;
  onValueChange?: (value: RatingValue) => void;
  /** 受控展开态 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 展开面板 body 内容（表情行上方：copy / topics / textarea 等） */
  children?: React.ReactNode;
  /** 展开面板 footer 右侧操作（Send 等） */
  footerActions?: React.ReactNode;
  /** 提供时，展开面板内容包裹在 <form> 内（footerActions 的 type="submit" 才能触发提交） */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** 应用到胶囊 trigger 按钮 */
  className?: string;
}

function RatingPill({
  label,
  prefix,
  suffix,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  onOpenChange,
  children,
  footerActions,
  onSubmit,
  className,
}: RatingPillProps) {
  const { t } = useI18n();
  const [ratingInternal, setRatingInternal] = React.useState<RatingValue | undefined>(
    defaultValue,
  );

  // 传入 onValueChange/onOpenChange 即视为受控：value 为 undefined 时也以外部为准
  // （Feedback 提交后 setRating(undefined) 复位，胶囊必须回到中性色）。
  const isRatingControlled = onValueChange !== undefined;
  // open 受控需要 openProp 与 onOpenChange 同时存在；只传 onOpenChange（回调监听）
  // 时仍走非受控内部 state，否则 open 恒为 undefined ?? false，Popover 永不打开。
  const isOpenControlled = onOpenChange !== undefined && openProp !== undefined;
  const [openState, setOpenState] = React.useState(false);
  const open = isOpenControlled ? (openProp ?? false) : openState;
  const rating = isRatingControlled ? value : ratingInternal;
  const tone = rating ? RATING_TONE[rating] : undefined;
  const SelectedFace = rating
    ? RATING_OPTIONS.find((option) => option.value === rating)?.icon
    : undefined;

  const handleOpenChange = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  const handleSelect = (next: RatingValue) => {
    setRatingInternal(next);
    onValueChange?.(next);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "outline-none inline-flex h-8 select-none items-center gap-1.5 rounded-full border px-3 text-[14px] font-medium leading-[21px] transition-colors duration-200 focus-ring",
            tone
              ? RATING_TONE_CAPSULE[tone]
              : "border-gray-alpha-400 bg-gray-alpha-100 text-gray-900 hover:border-gray-alpha-500 hover:bg-gray-alpha-200",
            className,
          )}
        >
          {prefix ? (
            <span className="shrink-0 inline-flex items-center justify-center [&>svg]:size-4">
              {prefix}
            </span>
          ) : null}
          {SelectedFace ? <SelectedFace aria-hidden className="size-4 shrink-0" /> : null}
          <span className="truncate inline-block">{label}</span>
          {suffix ? (
            <span className="shrink-0 inline-flex items-center justify-center [&>svg]:size-4">
              {suffix}
            </span>
          ) : null}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          role="dialog"
          sideOffset={4}
          className="w-[340px] rounded-xl bg-background-100 shadow-[0_0_0_1px_var(--ds-gray-alpha-400),0_4px_8px_rgba(0,0,0,0.08)] z-[300] outline-none animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <form className="h-full" onSubmit={onSubmit}>
            {children ? <div className="flex flex-col gap-2 p-2">{children}</div> : null}
            <div className="flex items-center justify-between border-t border-gray-alpha-200 bg-gray-alpha-100 p-3">
              <span
                role="radiogroup"
                aria-label={t("Feedback rating")}
                className="flex items-center gap-[1px] text-gray-900"
              >
                {RATING_OPTIONS.map(
                  ({ value: optionValue, label: ratingLabel, icon: Icon, tone: faceTone }) => {
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
                          "flex size-8 items-center justify-center rounded-[50%] border-none bg-transparent p-0 transition-colors duration-200 focus-ring",
                          RATING_TONE_FACE_HOVER[faceTone],
                          selected && RATING_TONE_FACE_SELECTED[faceTone],
                          "[&_svg]:size-4 [&_svg]:shrink-0",
                        )}
                      >
                        <Icon aria-hidden />
                      </button>
                    );
                  },
                )}
              </span>
              {footerActions}
            </div>
          </form>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { RatingPill };
export type { RatingPillProps };

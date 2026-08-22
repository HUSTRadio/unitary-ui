import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站页脚 — 反馈区 + Next 分页（docs/geist 专用）。
 * FeedbackPanel：胶囊「Give feedback」+ 4 emoji radio（原生 input sr-only + label），
 *   下方 Textarea + Send 按钮；本地 state 模拟提交，不真实上报。
 * DocsPagination：左右双分页 — 左 Previous + 标题 + ChevronLeft，右标题 + Next + ChevronRight，
 *   按当前页计算上/下一项（Introduction → Colors → Typography → Materials → Grid → Components）；
 *   首页只 Next、末页只 Previous、中间页双显。
 */

/* ================= FeedbackPanel ================= */

interface EmojiOption {
  value: string;
  emoji: string;
  label: string;
}

const EMOJI_OPTIONS = {
  "zh-CN": [
    { value: "hate", emoji: "😡", label: "很差" },
    { value: "not-great", emoji: "😕", label: "不太好" },
    { value: "okay", emoji: "😐", label: "还可以" },
    { value: "love", emoji: "🤩", label: "很喜欢" },
  ],
  "en-US": [
    { value: "hate", emoji: "😡", label: "Hate it" },
    { value: "not-great", emoji: "😕", label: "Not great" },
    { value: "okay", emoji: "😐", label: "It's okay" },
    { value: "love", emoji: "🤩", label: "Love it" },
  ],
} satisfies Record<string, EmojiOption[]>;

export function FeedbackPanel() {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section aria-label={copy.feedbackQuestion}>
      {/* 胶囊 — 左侧文案 + 右侧 emoji radio（原生 input sr-only + label） */}
      <div className="flex items-center justify-between rounded-full border border-border bg-gray-alpha-100 py-1.5 pr-1.5 pl-4">
        <span className="text-label-14 text-muted-foreground">{copy.feedbackQuestion}</span>
        <div role="radiogroup" aria-label={copy.feedbackRating} className="flex items-center">
          {EMOJI_OPTIONS[language].map((option) => {
            const checked = rating === option.value;
            return (
              <label
                key={option.value}
                title={option.label}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 transition-colors",
                  checked && "bg-background ring-2 ring-ring",
                )}
              >
                <input
                  type="radio"
                  name="feedback-rating"
                  value={option.value}
                  checked={checked}
                  onChange={() => setRating(option.value)}
                  aria-label={option.label}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "block text-base leading-none transition-transform peer-focus-visible:focus-ring",
                    checked && "scale-110",
                  )}
                >
                  {option.emoji}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 反馈表单 — Textarea + Send（本地 state，点击后显示已发送） */}
      <div className="mt-4">
        <Textarea
          placeholder={copy.feedbackPlaceholder}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={sent}
        />
        <div className="mt-2 flex justify-end">
          <Button
            typeName="button"
            size="small"
            disabled={sent}
            onClick={() => setSent(true)}
            prefix={sent ? <Check className="size-3.5" aria-hidden /> : undefined}
          >
            {sent ? copy.feedbackSent : copy.feedbackSend}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ================= DocsPagination ================= */

/** 内容页顺序 — 按当前页计算下一页 */
const PAGE_ORDER: { to: string; label: string }[] = [
  { to: "/", label: "Introduction" },
  { to: "/colors", label: "Colors" },
  { to: "/typography", label: "Typography" },
  { to: "/materials", label: "Materials" },
  { to: "/grid", label: "Grid" },
  { to: "/components", label: "Components" },
];

/** 路径 → 内容页序号；未知路径返回 -1（不渲染分页） */
function currentPageIndex(pathname: string): number {
  if (pathname === "/" || pathname === "/introduction") return 0;
  if (pathname === "/colors") return 1;
  if (pathname === "/typography") return 2;
  if (pathname === "/materials") return 3;
  if (pathname.startsWith("/grid")) return 4;
  if (pathname.startsWith("/components")) return 5;
  return -1;
}

export function DocsPagination() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const index = currentPageIndex(pathname);
  // 未知路径 → 不渲染分页
  if (index < 0) return null;
  // 左右双分页：首页只 Next、末页只 Previous、中间 Previous + Next 双显
  const previous = index > 0 ? PAGE_ORDER[index - 1] : null;
  const next = index < PAGE_ORDER.length - 1 ? PAGE_ORDER[index + 1] : null;

  return (
    <nav className="mt-8 flex items-center justify-between gap-4" aria-label={copy.next}>
      {previous ? (
        <NavLink
          to={previous.to}
          className="group -ml-2 flex items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-ring transition-colors hover:text-foreground"
        >
          <ChevronLeft
            className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
            aria-hidden
          />
          <span className="flex flex-col items-start gap-0.5">
            <span className="text-label-12 text-muted-foreground">{copy.previous}</span>
            <span className="text-label-16 font-medium text-foreground">
              {copy.pageNames[previous.label as keyof typeof copy.pageNames] ?? previous.label}
            </span>
          </span>
        </NavLink>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <NavLink
          to={next.to}
          className="group -mr-2 flex items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-ring transition-colors hover:text-foreground"
        >
          <span className="flex flex-col items-end gap-0.5">
            <span className="text-label-12 text-muted-foreground">{copy.next}</span>
            <span className="text-label-16 font-medium text-foreground">
              {copy.pageNames[next.label as keyof typeof copy.pageNames] ?? next.label}
            </span>
          </span>
          <ChevronRight
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </NavLink>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}

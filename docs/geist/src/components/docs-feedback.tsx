import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RatingPill, type RatingValue } from "@/components/ui/rating-pill";
import { Textarea } from "@/components/ui/textarea";
import { SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站页脚 — 反馈区 + Next 分页（docs/geist 专用）。
 * FeedbackPanel：胶囊 rating bar（收起为一行「Was this helpful?」），点击展开 4 表情评分，
 *   选中后胶囊以语义色着色；展开面板内保留 Textarea + Send（本地 state 模拟提交，不真实上报）。
 *   — 复用库组件 RatingPill（与 Feedback 组件同一交互/着色，消除形态漂移）。
 * DocsPagination：左右双分页 — 左 Previous + 标题 + ChevronLeft，右标题 + Next + ChevronRight，
 *   按当前页计算上/下一项（Introduction → Colors → Typography → Materials → Grid → Components）；
 *   首页只 Next、末页只 Previous、中间页双显。
 */

/* ================= FeedbackPanel ================= */

export function FeedbackPanel() {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [rating, setRating] = useState<RatingValue | undefined>(undefined);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <section aria-label={copy.feedbackQuestion}>
      {/* 胶囊 rating bar — 官方形态：单行胶囊内嵌 4 表情；选中后展开 Textarea + Send */}
      <RatingPill label={copy.feedbackQuestion} value={rating} onValueChange={setRating} onSubmit={() => setOpen(true)} />
      {open ? (
        <div className="mt-1">
          <Textarea
            placeholder={copy.feedbackPlaceholder}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={sent}
          />
          <div className="mt-1 flex items-center justify-end gap-2">
            {sent ? (
              <p className="text-label-12 text-muted-foreground">{copy.feedbackThanks}</p>
            ) : null}
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
      ) : null}
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

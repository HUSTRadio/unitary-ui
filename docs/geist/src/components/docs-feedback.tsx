import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { RatingPill, type RatingValue } from "@/components/ui/rating-pill";
import { Textarea } from "@/components/ui/textarea";
import { SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站页脚反馈：评分胶囊始终可见；选择评分后在它上方打开局部 popup。
 * 这里刻意不用 Modal：没有 backdrop、focus trap 或 body scroll lock。
 */
export function FeedbackPanel() {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [rating, setRating] = useState<RatingValue>();
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const selectRating = (next: RatingValue) => {
    setRating(next);
    setSent(false);
    setOpen(true);
  };

  return (
    <section className="relative inline-flex" data-slot="feedback-anchor" aria-label={copy.feedbackQuestion}>
      <RatingPill label={copy.feedbackQuestion} value={rating} onValueChange={selectRating} />

      {open ? (
        <div
          data-slot="feedback-popup"
          role="dialog"
          aria-label={copy.feedbackQuestion}
          className="absolute bottom-full left-1/2 z-30 mb-3 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[var(--radius-xl)] border border-gray-alpha-400 bg-popover p-4 shadow-[var(--material-shadow-menu)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-style-headline font-medium text-foreground">{copy.feedbackQuestion}</p>
            <button
              type="button"
              aria-label="Close feedback"
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-alpha-200 hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          {sent ? (
            <p className="mt-3 text-style-callout text-muted-foreground">{copy.feedbackThanks}</p>
          ) : (
            <>
              <Textarea
                aria-label={copy.feedbackPlaceholder}
                placeholder={copy.feedbackPlaceholder}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="mt-3 min-h-[96px]"
              />
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="focus-ring rounded-full bg-gray-alpha-100 px-4 py-1.5 text-style-subhead font-medium text-foreground transition-colors hover:bg-gray-alpha-200"
                >
                  {copy.feedbackSend}
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}

/* ================= DocsPagination ================= */

const PAGE_ORDER: { to: string; label: string }[] = [
  { to: "/", label: "Introduction" },
  { to: "/colors", label: "Colors" },
  { to: "/typography", label: "Typography" },
  { to: "/materials", label: "Materials" },
  { to: "/grid", label: "Grid" },
  { to: "/components", label: "Components" },
];

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
  if (index < 0) return null;

  const previous = index > 0 ? PAGE_ORDER[index - 1] : null;
  const next = index < PAGE_ORDER.length - 1 ? PAGE_ORDER[index + 1] : null;

  return (
    <nav
      className="mt-8 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 max-[480px]:grid-cols-2"
      aria-label={copy.next}
    >
      <div className="col-start-2 justify-self-center max-[480px]:col-span-2 max-[480px]:col-start-1 max-[480px]:row-start-1">
        <FeedbackPanel />
      </div>
      <div className="col-start-1 row-start-1 min-w-0 justify-self-start max-[480px]:row-start-2">
        {previous ? (
          <NavLink
            to={previous.to}
            className="group -ml-2 flex items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-ring transition-colors hover:text-foreground"
          >
            <ChevronLeft
              className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            <span className="flex min-w-0 flex-col items-start gap-0.5">
              <span className="text-label-12 text-muted-foreground">{copy.previous}</span>
              <span className="truncate text-label-16 font-medium text-foreground">
                {copy.pageNames[previous.label as keyof typeof copy.pageNames] ?? previous.label}
              </span>
            </span>
          </NavLink>
        ) : null}
      </div>
      <div className="col-start-3 row-start-1 min-w-0 justify-self-end max-[480px]:col-start-2 max-[480px]:row-start-2">
        {next ? (
          <NavLink
            to={next.to}
            className="group -mr-2 flex items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-ring transition-colors hover:text-foreground"
          >
            <span className="flex min-w-0 flex-col items-end gap-0.5">
              <span className="text-label-12 text-muted-foreground">{copy.next}</span>
              <span className="truncate text-label-16 font-medium text-foreground">
                {copy.pageNames[next.label as keyof typeof copy.pageNames] ?? next.label}
              </span>
            </span>
            <ChevronRight
              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </NavLink>
        ) : null}
      </div>
    </nav>
  );
}

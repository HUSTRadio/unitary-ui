import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { RatingPill, type RatingValue } from "@/components/ui/rating-pill";
import { Textarea } from "@/components/ui/textarea";
import { SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站页脚 — 反馈区 + Next 分页（docs/geist 专用）。
 * FeedbackPanel：复刻 vercel.com/geist 官方浮层 Modal 形态：
 *   - 居中 Modal（阴影+边框），顶部 "Give feedback" + 4 表情单行胶囊；
 *   - 选中表情：蓝色圆底白图标，其余灰色轮廓；
 *   - 大 Textarea + "M ↵ supported." 提示；
 *   - 右下 Send 胶囊按钮（浅底深字）。
 * DocsPagination：左右双分页（首页只 Next、末页只 Previous、中间双显）。
 */

export function FeedbackPanel() {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [rating, setRating] = useState<RatingValue | undefined>(undefined);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <section aria-label={copy.feedbackQuestion}>
      {/* 触发按钮：点开 Modal */}
      <Button
        typeName="button"
        size="small"
        type="tertiary"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-label-14 text-muted-foreground hover:text-foreground"
      >
        <span>{copy.feedbackQuestion}</span>
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-heading-20 text-foreground">{copy.feedbackQuestion}</ModalTitle>
          </ModalHeader>

          {/* RatingPill：单行胶囊内嵌 4 表情 */}
          <RatingPill
            label="" // 已由 ModalTitle 承载
            value={rating}
            onValueChange={setRating}
            onSubmit={() => setOpen(false)} // 选中即提交（官方即点即选）
          />

          {!sent && (
            <div className="mt-4">
              <Textarea
                placeholder={copy.feedbackPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="mt-2 text-label-12 text-muted-foreground">
                <kbd className="inline-flex items-center gap-1 rounded border border-gray-alpha-400 bg-gray-alpha-100 px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
                  M
                  <kbd className="ml-0.5 px-1 rounded bg-gray-alpha-200">↵</kbd>
                </kbd>{" "}
                supported.
              </p>
            </div>
          )}

          {sent ? (
            <p className="mt-4 text-label-14 text-muted-foreground text-center">{copy.feedbackThanks}</p>
          ) : (
            <div className="mt-4 flex justify-end">
              <Button
                typeName="button"
                size="small"
                onClick={() => setSent(true)}
                className="rounded-full bg-gray-alpha-100 text-foreground px-4 py-1.5"
              >
                {copy.feedbackSend}
              </Button>
            </div>
          )}
        </ModalContent>
      </Modal>
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { Feedback } from "@hustradio/unitary-ui";
import { getAdjacentDocsPages, getDocsRouteLabel } from "../data/docs-routes";
import { SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/** 文档站页脚直接消费公共 Inline Feedback，避免维护第二套状态机。 */
export function FeedbackPanel() {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];

  return (
    <section
      className="relative inline-flex"
      data-slot="feedback-anchor"
      aria-label={copy.feedbackQuestion}
    >
      <Feedback
        type="inline"
        copy={copy.feedbackLabel}
        metadata={{ language }}
        onSubmit={() => undefined}
      />
    </section>
  );
}

/* ================= DocsPagination ================= */

export function DocsPagination() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const { previous, next } = getAdjacentDocsPages(pathname);

  return (
    <nav
      className="mt-8 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 docs-feedback-compact:grid-cols-2"
      aria-label={copy.paginationAria}
    >
      {/* flex：让 FeedbackPanel 的 inline-flex section 成为 flex item，
          否则 inline 元素产生的行盒会给容器额外加约 6px（字体降部空间），
          使页脚比胶囊实际高度高出一截，且与左右分列不等高。 */}
      <div className="col-start-2 flex justify-self-center docs-feedback-compact:col-span-2 docs-feedback-compact:col-start-1 docs-feedback-compact:row-start-1">
        <FeedbackPanel />
      </div>
      <div className="col-start-1 row-start-1 min-w-0 justify-self-start docs-feedback-compact:row-start-2">
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
                {getDocsRouteLabel(previous, language)}
              </span>
            </span>
          </NavLink>
        ) : null}
      </div>
      <div className="col-start-3 row-start-1 min-w-0 justify-self-end docs-feedback-compact:col-start-2 docs-feedback-compact:row-start-2">
        {next ? (
          <NavLink
            to={next.to}
            className="group -mr-2 flex items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-ring transition-colors hover:text-foreground"
          >
            <span className="flex min-w-0 flex-col items-end gap-0.5">
              <span className="text-label-12 text-muted-foreground">{copy.next}</span>
              <span className="truncate text-label-16 font-medium text-foreground">
                {getDocsRouteLabel(next, language)}
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

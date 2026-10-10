import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaMatch } from "@/lib/use-page-scroll";
import { useI18n } from "@/lib/i18n";
import { Collapse, CollapseContent, CollapseTrigger } from "./collapse";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "./sheet";

export interface SiteNavigationLink {
  label: string;
  href: string;
  description?: string;
  target?: string;
  rel?: string;
}
export interface SiteNavigationGroup {
  title: string;
  links: SiteNavigationLink[];
}
export interface SiteNavigationItem {
  id: string;
  label: string;
  href?: string;
  groups?: SiteNavigationGroup[];
  featured?: ReactNode;
}
export interface SiteNavigationProps {
  items: SiteNavigationItem[];
  label?: string;
  activeHref?: string;
  desktopBreakpoint?: 768 | 1024 | 1280;
  mobileActions?: ReactNode;
  panelClassName?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const desktopClasses = { 768: "hidden md:block", 1024: "hidden lg:block", 1280: "hidden xl:block" };
const mobileClasses = { 768: "md:hidden", 1024: "lg:hidden", 1280: "xl:hidden" };

export function SiteNavigation({
  items,
  label,
  activeHref,
  desktopBreakpoint = 1024,
  mobileActions,
  panelClassName,
  className,
  onOpenChange,
}: SiteNavigationProps) {
  const { t } = useI18n();
  const name = label ?? t("Menu");
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigating = useRef(false);
  const prefix = useId();
  const [current, setCurrent] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [availableHeight, setAvailableHeight] = useState<number>();
  const desktop = useMediaMatch(`(min-width: ${desktopBreakpoint}px)`);
  const hover = useMediaMatch("(hover: hover) and (pointer: fine)");
  const selected = items.find((item) => item.id === current);
  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const close = (restore = false) => {
    clearTimer();
    if (restore && current) triggers.current.get(current)?.focus();
    setCurrent(null);
  };
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setCurrent(null);
    setMobileOpen(false);
  }, [desktop, activeHref]);
  useEffect(() => {
    onOpenChange?.(current !== null || mobileOpen);
  }, [current, mobileOpen, onOpenChange]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!current) return;
    const viewport = window.visualViewport;
    const update = () => {
      if (!panel.current) return;
      const bottom = viewport ? viewport.height + viewport.offsetTop : window.innerHeight;
      setAvailableHeight(Math.max(0, bottom - panel.current.getBoundingClientRect().top));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (root.current?.parentElement) observer?.observe(root.current.parentElement);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [current]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        setCurrent(null);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  const anchor = (link: SiteNavigationLink) => (
    <a
      key={link.href + link.label}
      href={link.href}
      target={link.target}
      rel={link.rel ?? (link.target === "_blank" ? "noopener noreferrer" : undefined)}
      aria-current={link.href === activeHref ? "page" : undefined}
      className="block min-h-11 rounded-md px-3 py-3 text-copy-14 hover:bg-gray-alpha-100 focus-ring"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
          return;
        navigating.current = mobileOpen && link.target !== "_blank";
        close();
        setMobileOpen(false);
      }}
    >
      <span className="font-medium">{link.label}</span>
      {link.description ? (
        <span className="mt-1 block text-copy-13 text-muted-foreground">{link.description}</span>
      ) : null}
    </a>
  );
  const content = (item: SiteNavigationItem) => (
    <>
      {item.href ? anchor({ label: item.label, href: item.href }) : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {item.groups?.map((group) => (
          <section key={group.title}>
            <h3 className="px-3 pb-2 text-copy-13 font-medium text-muted-foreground">
              {group.title}
            </h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.href + link.label}>{anchor(link)}</li>
              ))}
            </ul>
          </section>
        ))}
        {item.featured ? <div data-slot="site-navigation-featured">{item.featured}</div> : null}
      </div>
    </>
  );
  return (
    <nav
      ref={root}
      data-slot="site-navigation"
      aria-label={name}
      className={className}
      onKeyDown={(event) => {
        if (event.key === "Escape" && current) {
          event.preventDefault();
          close(true);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) close();
      }}
    >
      <div
        className={desktopClasses[desktopBreakpoint]}
        onPointerEnter={clearTimer}
        onPointerLeave={() => {
          if (hover && !root.current?.contains(document.activeElement)) {
            clearTimer();
            timer.current = setTimeout(() => setCurrent(null), 180);
          }
        }}
      >
        <ul
          className="flex items-center gap-1"
          onKeyDown={(event) => {
            const topItems = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                "[data-slot=site-navigation-top-item]",
              ),
            );
            const index = topItems.indexOf(event.target as HTMLElement);
            if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const direction = event.key === "ArrowLeft" ? -1 : 1;
            const destination =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? topItems.length - 1
                  : (index + direction + topItems.length) % topItems.length;
            topItems[destination]?.focus();
          }}
        >
          {items.map((item) => (
            <li key={item.id}>
              {item.groups || item.featured ? (
                <button
                  type="button"
                  ref={(node) => {
                    if (node) triggers.current.set(item.id, node);
                    else triggers.current.delete(item.id);
                  }}
                  id={`${prefix}-${item.id}-trigger`}
                  aria-expanded={current === item.id}
                  aria-controls={`${prefix}-${item.id}-panel`}
                  className="flex min-h-11 items-center gap-2 rounded-md px-3 text-copy-14 hover:bg-gray-alpha-100 focus-ring"
                  onPointerEnter={() => {
                    if (hover) {
                      clearTimer();
                      timer.current = setTimeout(() => setCurrent(item.id), 120);
                    }
                  }}
                  onClick={() => {
                    clearTimer();
                    setCurrent(current === item.id ? null : item.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      clearTimer();
                      setCurrent(item.id);
                      requestAnimationFrame(() =>
                        panel.current?.querySelector<HTMLElement>("a,button")?.focus(),
                      );
                    }
                  }}
                  data-slot="site-navigation-top-item"
                >
                  {item.label}
                  <ChevronDown className="size-3" aria-hidden />
                </button>
              ) : (
                <a
                  href={item.href}
                  data-slot="site-navigation-top-item"
                  aria-current={item.href === activeHref ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-copy-14 hover:bg-gray-alpha-100 focus-ring"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        {selected ? (
          <div
            ref={panel}
            id={`${prefix}-${selected.id}-panel`}
            aria-labelledby={`${prefix}-${selected.id}-trigger`}
            data-slot="site-navigation-panel"
            style={{ maxHeight: availableHeight ?? "calc(100dvh - 5rem)" }}
            className={cn(
              "absolute inset-x-0 top-full z-[var(--uni-z-header,40)] overflow-y-auto overscroll-contain border-b border-gray-alpha-400 bg-background-100 p-6 shadow-lg",
              panelClassName,
            )}
          >
            {content(selected)}
          </div>
        ) : null}
      </div>
      <div className={mobileClasses[desktopBreakpoint]}>
        <Sheet modal open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md focus-ring"
              aria-label={name}
            >
              <MenuIcon className="size-5" aria-hidden />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-dvh w-full max-w-none! flex-col pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              if (navigating.current) {
                event.preventDefault();
                navigating.current = false;
              } else if (window.matchMedia(`(min-width: ${desktopBreakpoint}px)`).matches) {
                event.preventDefault();
                root.current
                  ?.querySelector<HTMLElement>("[data-slot=site-navigation-top-item]")
                  ?.focus();
              }
            }}
          >
            <div className="flex shrink-0 items-center justify-between">
              <SheetTitle>{name}</SheetTitle>
              <SheetClose asChild>
                <button
                  type="button"
                  aria-label={t("Close menu")}
                  className="grid size-11 place-items-center rounded-md focus-ring"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </SheetClose>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              data-slot="site-navigation-mobile-body"
            >
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="border-b border-gray-alpha-400">
                    {item.groups || item.featured ? (
                      <Collapse size="bare">
                        <CollapseTrigger className="min-h-11 py-4">{item.label}</CollapseTrigger>
                        <CollapseContent>{content(item)}</CollapseContent>
                      </Collapse>
                    ) : (
                      anchor({ label: item.label, href: item.href ?? "#" })
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {mobileActions ? (
              <div
                className="shrink-0 border-t border-gray-alpha-400 pt-4"
                onClick={(event) => {
                  const link = (event.target as HTMLElement).closest("a");
                  if (
                    link &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey &&
                    event.button === 0
                  ) {
                    navigating.current = link.target !== "_blank";
                    setMobileOpen(false);
                  }
                }}
              >
                {mobileActions}
              </div>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { Button, ErrorBoundary, FullPageScroller, Navbar, Snippet } from "@hustradio/unitary-ui";
import logo from "../../brand/unitary-logo-horizontal.svg";
import mark from "../../brand/unitary-mark.svg";
import { INSTALL_COMMAND, QUICK_START_CODE } from "../../docs/site/src/content/getting-started";
import { SECTION_IDS, WEBSITE_COPY } from "./content";
import { useWebsiteLanguage } from "./language";

const InteractionDemo = lazy(() => import("./demos/interaction"));
const AppearanceDemo = lazy(() => import("./demos/appearance"));
const MotionDemo = lazy(() => import("./demos/motion"));

// Suspense commits this effect only after the real demo has mounted and laid out.
function ReadyDemo({ screen, onReady, children }: { screen: number; onReady: (screen: number) => void; children: ReactNode }) {
  useLayoutEffect(() => onReady(screen), [screen, onReady]);
  return children;
}

function ScrollProgress({ index, label }: { index: number; label: string }) {
  const indicator = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = indicator.current;
    const root = element?.parentElement?.querySelector<HTMLElement>('[data-slot="full-page-scroller"]');
    const thumb = element?.firstElementChild as HTMLElement | null;
    if (!element || !root || !thumb) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="full-page-section"]'));
    let previousPosition = -1;
    let previousSize = -1;
    const update = (paging = false) => {
      const viewport = root.clientHeight;
      if (!viewport) return;
      const heights = sections.map(section => Math.max(viewport, section.scrollHeight));
      const total = heights.reduce((sum, height) => sum + height, 0);
      const maximum = Math.max(0, total - viewport);
      const offset = heights.slice(0, index).reduce((sum, height) => sum + height, 0);
      const position = Math.min(maximum, Math.max(0, offset + (sections[index]?.scrollTop ?? 0)));
      const size = viewport / total;
      if (position === previousPosition && size === previousSize) return;
      previousPosition = position;
      previousSize = size;
      element.dataset.paging = String(paging);
      element.setAttribute("aria-valuenow", String(maximum ? Math.round(position / maximum * 100) : 0));
      element.style.setProperty("--uni-duration-slower", getComputedStyle(root).getPropertyValue("--uni-duration-slower"));
      thumb.style.height = `${size * 100}%`;
      thumb.style.transform = `translateY(${position / viewport * 100}%)`;
    };
    update(true);
    const scroll = () => update();
    root.addEventListener("scroll", scroll, true);
    const resize = new ResizeObserver(scroll);
    resize.observe(root);
    for (const section of sections) {
      resize.observe(section);
      if (section.firstElementChild) resize.observe(section.firstElementChild);
    }
    return () => {
      root.removeEventListener("scroll", scroll, true);
      resize.disconnect();
    };
  }, [index]);
  return <div ref={indicator} className="website-scroll-progress" role="progressbar" aria-label={label} aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
    <div className="website-scroll-thumb" />
  </div>;
}

export default function App() {
  const { language, setLanguage } = useWebsiteLanguage();
  const copy = WEBSITE_COPY[language];
  const [index, setIndex] = useState(0);
  const [prepared, setPrepared] = useState(() => new Set([0, 1]));
  const [ready, setReady] = useState(() => new Set([0, 4]));
  const [destination, setDestination] = useState<{ index: number; focusHeading: boolean } | null>(null);
  const shell = useRef<HTMLDivElement>(null);
  const headings = useRef<Array<HTMLHeadingElement | null>>([]);
  const pendingFocus = useRef<number | null>(null);
  const docsHref = `/docs/?lang=${language}#/`;
  const scroller = () => shell.current?.querySelector<HTMLElement>('[data-slot="full-page-scroller"]');
  const markReady = useCallback((screen: number) => {
    setReady(previous => previous.has(screen) ? previous : new Set([...previous, screen]));
  }, []);

  const goTo = (next: number, focusHeading = false) => {
    if (next < 0 || next >= SECTION_IDS.length) return;
    if (next === index) {
      setDestination(null);
      if (focusHeading) headings.current[next]?.focus({ preventScroll: true });
      return;
    }
    // Prepare the destination and its neighbour while the current screen stays put.
    setPrepared(previous => new Set([...previous, next, Math.min(next + 1, SECTION_IDS.length - 1)]));
    setDestination({ index: next, focusHeading });
  };
  useLayoutEffect(() => {
    if (!destination || !ready.has(destination.index)) return;
    const root = scroller();
    const active = root?.querySelector('[data-slot="full-page-section"]:not([inert])');
    if (active?.contains(document.activeElement)) root?.focus({ preventScroll: true });
    pendingFocus.current = destination.focusHeading ? destination.index : null;
    setIndex(destination.index);
    setDestination(null);
  }, [destination, ready]);
  useLayoutEffect(() => {
    if (pendingFocus.current === null) return;
    headings.current[pendingFocus.current]?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [index]);

  return <div ref={shell} className="website" data-slot="unitary-website" data-screen={SECTION_IDS[index]}>
    <a className="website-skip focus-ring" href="#website-content" onClick={event => {
      event.preventDefault(); scroller()?.focus({ preventScroll: true });
    }}>{copy.skip}</a>
    <Navbar scrollBehavior="static" variant="transparent" height="h-auto" className="website-header">
      <button type="button" className="website-brand focus-ring" aria-label={copy.home} onClick={() => goTo(0, true)}>
        <img src={logo} alt="Unitary." width={1278} height={289} className="website-logo" />
      </button>
      <nav aria-label={language === "zh-CN" ? "主导航" : "Main navigation"} className="website-nav">
        <Button typeName="button" type="tertiary" size="small" className="website-nav-action" onClick={() => goTo(4, true)}>{copy.start}</Button>
        <a href={docsHref} className="website-nav-action focus-ring">{copy.docs}</a>
        <a href="https://github.com/HUSTRadio/unitary-ui" className="website-nav-action focus-ring">GitHub</a>
      </nav>
    </Navbar>

    <FullPageScroller id="website-content" className="website-scroller" index={index} onIndexChange={next => goTo(next)} aria-label={copy.navigation}>
      <section className="website-screen website-hero" aria-labelledby="website-title-0">
        <h1 id="website-title-0" tabIndex={-1} ref={element => { headings.current[0] = element; }} className="website-hero-title">
          <img src={mark} alt="" className="website-hero-mark" width={1024} height={1024} />
          <span>Create the One.</span>
        </h1>
      </section>
      {SECTION_IDS.slice(1).map((id, position) => {
        const screen = position + 1;
        return <section key={id} className="website-screen website-showcase" aria-labelledby={`website-title-${screen}`}>
          <div className="website-introduction">
            <p className="website-eyebrow"><span>0{screen}</span> / {copy.sections[screen]}</p>
            <h2 id={`website-title-${screen}`} tabIndex={-1} ref={element => { headings.current[screen] = element; }} className="website-heading">{copy.headings[screen]}</h2>
            <p className="website-description">{copy.descriptions[screen]}</p>
            {screen === 4 && <a href={docsHref} className="website-guide-link focus-ring">{copy.completeGuide}<ArrowUpRight size={16} aria-hidden /></a>}
          </div>
          <div className="website-demo" data-demo={id}>
            <ErrorBoundary name={`website-${id}`} onError={() => markReady(screen)}>
              <Suspense fallback={<p role="status" className="text-copy-14 text-muted-foreground">{copy.loading}</p>}>
                {prepared.has(screen) && screen < 4 && <ReadyDemo screen={screen} onReady={markReady}>
                  {screen === 1 && <InteractionDemo />}
                  {screen === 2 && <AppearanceDemo />}
                  {screen === 3 && <MotionDemo active={index === 3} />}
                </ReadyDemo>}
                {screen === 4 && <div className="website-install">
                  <div><p className="website-demo-label">{copy.install}</p><Snippet text={INSTALL_COMMAND} /></div>
                  <div><p className="website-demo-label">{copy.example} · App.tsx</p><Snippet text={QUICK_START_CODE.split("\n")} prompt={false} /></div>
                </div>}
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>;
      })}
    </FullPageScroller>

    <ScrollProgress index={index} label={copy.scrollProgress} />

    <footer className="website-controls">
      <div className="website-preferences">
        {index > 0 && <button type="button" className="website-language focus-ring" aria-label={copy.language} onClick={() => setLanguage(language === "zh-CN" ? "en-US" : "zh-CN")}>
          {language === "zh-CN" ? "EN" : "中文"}
        </button>}
      </div>
      <nav className="website-progress" aria-label={copy.navigation}>
        <Button typeName="button" type="tertiary" size="small" svgOnly aria-label={copy.previous} disabled={index === 0} onClick={() => goTo(index - 1)}><ArrowUp /></Button>
        <span className="website-count" aria-hidden>{String(index + 1).padStart(2, "0")} / 05</span>
        <Button typeName="button" type="tertiary" size="small" svgOnly aria-label={copy.next} disabled={index === 4} onClick={() => goTo(index + 1)}><ArrowDown /></Button>
      </nav>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{copy.sections[index]} · {index + 1} / 5</p>
    </footer>
  </div>;
}

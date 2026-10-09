// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NumberedPagination } from "../src/components/ui/pagination";
import { FullPageScroller } from "../src/components/ui/full-page-scroller";
import { Carousel, type CarouselVariant } from "../src/components/ui/carousel";
import { LazyLoad } from "../src/components/ui/lazy-load";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function render(node: React.ReactNode) {
  act(() => root.render(node));
}
function click(selector: string) {
  act(() => (document.querySelector(selector) as HTMLElement).click());
}
const sections = [<div key="a">A</div>, <div key="b">B</div>, <div key="c">C</div>];
function wheel(deltaY: number, options: WheelEventInit = {}) {
  const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true, ...options });
  act(() => host.querySelector('[data-slot="full-page-scroller"]')!.dispatchEvent(event));
  return event;
}
function scrollerIndex() {
  return host.querySelector('[data-slot="full-page-scroller"]')!.getAttribute("data-index");
}

describe("NumberedPagination", () => {
  it("renders a bounded search-results range with gaps and one current page", () => {
    render(<NumberedPagination totalPages={1000000} page={500} />);
    expect(host.textContent).toBe("1…499500501…1000000");
    expect(host.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(host.querySelectorAll("li")).toHaveLength(9);
  });
  it("changes uncontrolled pages and disables the boundary arrows", () => {
    const change = vi.fn();
    render(<NumberedPagination totalPages={5} onPageChange={change} />);
    expect(host.querySelector<HTMLButtonElement>('[aria-label="Previous"]')!.disabled).toBe(true);
    click('[aria-label="Next"]');
    expect(change).toHaveBeenCalledWith(2);
    expect(host.querySelector('[aria-current="page"]')!.textContent).toBe("2");
  });
  it("preserves controlled state and supplies real destinations", () => {
    const change = vi.fn();
    render(
      <NumberedPagination
        totalPages={12}
        page={5}
        onPageChange={change}
        getPageHref={(value) => `?page=${value}`}
      />,
    );
    const link = host.querySelector('[aria-label="Go to page 6"]')!;
    expect(link.getAttribute("href")).toBe("?page=6");
    act(() => link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    expect(change).toHaveBeenCalledWith(6);
    expect(host.querySelector('[aria-current="page"]')!.textContent).toBe("5");
    render(<NumberedPagination totalPages={2} page={5} />);
    expect(host.querySelector('[aria-current="page"]')!.textContent).toBe("2");
  });
  it("handles empty and disabled pagination without change callbacks", () => {
    const change = vi.fn();
    render(<NumberedPagination totalPages={0} onPageChange={change} />);
    expect(host.querySelectorAll("[aria-current]")).toHaveLength(0);
    expect([...host.querySelectorAll("button")].every((button) => button.disabled)).toBe(true);
    render(<NumberedPagination totalPages={3} disabled onPageChange={change} />);
    click('[aria-label="Next"]');
    expect(change).not.toHaveBeenCalled();
  });
});

describe("FullPageScroller", () => {
  it("accumulates to the threshold and rejects one gesture's momentum", () => {
    vi.useFakeTimers();
    const change = vi.fn();
    render(
      <FullPageScroller wheelThreshold={80} onIndexChange={change}>
        {sections}
      </FullPageScroller>,
    );
    wheel(35);
    expect(scrollerIndex()).toBe("0");
    wheel(45);
    expect(scrollerIndex()).toBe("1");
    for (let i = 0; i < 12; i++) {
      act(() => vi.advanceTimersByTime(100));
      wheel(100);
    }
    expect(scrollerIndex()).toBe("1");
    act(() => vi.advanceTimersByTime(200));
    wheel(100);
    expect(scrollerIndex()).toBe("2");
    expect(change.mock.calls).toEqual([[1], [2]]);
  });
  it("releases scrolling at boundaries and ignores pinch-zoom wheel input", () => {
    render(<FullPageScroller>{sections}</FullPageScroller>);
    expect(wheel(-100).defaultPrevented).toBe(false);
    expect(wheel(200, { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(scrollerIndex()).toBe("0");
  });
  it("normalizes line units and resets accumulation on reversal", () => {
    render(<FullPageScroller defaultIndex={1}>{sections}</FullPageScroller>);
    wheel(60);
    wheel(-40);
    expect(scrollerIndex()).toBe("1");
    wheel(-3, { deltaMode: 1 });
    expect(scrollerIndex()).toBe("0");
  });
  it("supports keyboard selection while keeping inactive sections inert", () => {
    render(<FullPageScroller>{sections}</FullPageScroller>);
    const element = host.querySelector('[data-slot="full-page-scroller"]')!;
    act(() => element.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect(scrollerIndex()).toBe("2");
    expect(host.querySelectorAll('[data-slot="full-page-section"][inert]')).toHaveLength(2);
    render(
      <FullPageScroller index={0} onIndexChange={() => {}}>
        {sections}
      </FullPageScroller>,
    );
    wheel(100);
    expect(scrollerIndex()).toBe("0");
  });
  it("lets nested content scroll before handing off at its edge", () => {
    render(
      <FullPageScroller>
        <div style={{ overflowY: "auto" }} data-nested>
          <p>Long content</p>
        </div>
        <div>Second</div>
      </FullPageScroller>,
    );
    const nested = host.querySelector<HTMLElement>("[data-nested]")!;
    Object.defineProperties(nested, { scrollHeight: { value: 500 }, clientHeight: { value: 100 } });
    const dispatch = () => {
      const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
      act(() => nested.dispatchEvent(event));
      return event;
    };
    expect(dispatch().defaultPrevented).toBe(false);
    expect(scrollerIndex()).toBe("0");
    nested.scrollTop = 400;
    expect(dispatch().defaultPrevented).toBe(true);
    expect(scrollerIndex()).toBe("1");
  });
  it("switches only after a deliberate touch gesture and ignores cancelled gestures", () => {
    render(<FullPageScroller touchThreshold={50}>{sections}</FullPageScroller>);
    const element = host.querySelector('[data-slot="full-page-scroller"]')!;
    const touch = (type: string, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, {
        touches: { value: [{ clientX: 100, clientY: y }] },
        changedTouches: { value: [{ clientX: 100, clientY: y }] },
      });
      act(() => element.dispatchEvent(event));
    };
    touch("touchstart", 200);
    touch("touchmove", 170);
    touch("touchend", 170);
    expect(scrollerIndex()).toBe("0");
    touch("touchstart", 200);
    touch("touchmove", 120);
    touch("touchcancel", 120);
    touch("touchend", 120);
    expect(scrollerIndex()).toBe("0");
    touch("touchstart", 200);
    touch("touchmove", 120);
    touch("touchend", 120);
    expect(scrollerIndex()).toBe("1");
  });
});

describe("Carousel", () => {
  const images = [
    { src: "/a.svg", alt: "First" },
    { src: "/b.svg", alt: "Second" },
  ];
  it.each<CarouselVariant>(["slide", "fade", "fade-scale"])(
    "keeps keyboard, controls and active slide accessibility for %s",
    (variant) => {
      const change = vi.fn();
      render(<Carousel images={images} variant={variant} onIndexChange={change} />);
      click('[aria-label="Next image"]');
      expect(scrollerIndex()).toBe("1");
      expect(change).toHaveBeenLastCalledWith(1);
      const sections = host.querySelectorAll('[data-slot="full-page-section"]');
      expect(sections[0].hasAttribute("inert")).toBe(true);
      expect(sections[1].hasAttribute("inert")).toBe(false);
      act(() =>
        host
          .querySelector('[data-slot="full-page-scroller"]')!
          .dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })),
      );
      expect(scrollerIndex()).toBe("0");
      expect(change).toHaveBeenLastCalledWith(0);
    },
  );
  it("keeps the current image and node when changing effects", () => {
    const change = vi.fn();
    render(<Carousel images={images} defaultIndex={1} onIndexChange={change} />);
    const image = host.querySelector('img[alt="Second"]');
    render(<Carousel images={images} variant="fade-scale" onIndexChange={change} />);
    expect(scrollerIndex()).toBe("1");
    expect(host.querySelector('img[alt="Second"]')).toBe(image);
    expect(change).not.toHaveBeenCalled();
  });
  it("changes slides with arrows and indicators, lazy loads peers, and wraps controls", () => {
    render(<Carousel images={images} loop />);
    expect(host.querySelector('img[alt="Second"]')!.getAttribute("loading")).toBe("lazy");
    click('[aria-label="Previous image"]');
    expect(scrollerIndex()).toBe("1");
    expect(host.querySelector('[role="status"]')!.textContent).toBe("Image 2 of 2");
    click('[aria-label="Go to image 1"]');
    expect(scrollerIndex()).toBe("0");
  });
  it("supports empty data and controlled selection", () => {
    render(<Carousel images={[]} />);
    expect(host.querySelector('[role="status"]')!.textContent).toBe("No images");
    const change = vi.fn();
    render(<Carousel images={images} index={0} onIndexChange={change} />);
    click('[aria-label="Next image"]');
    expect(change).toHaveBeenCalledWith(1);
    expect(scrollerIndex()).toBe("0");
  });
});

describe("LazyLoad", () => {
  it("reveals once at the threshold, preserves state, and disconnects on unmount", () => {
    let observe: IntersectionObserverCallback;
    const disconnect = vi.fn();
    const constructor = vi.fn(function (
      callback: IntersectionObserverCallback,
      _options: IntersectionObserverInit,
    ) {
      observe = callback;
      return { observe: vi.fn(), disconnect };
    });
    vi.stubGlobal("IntersectionObserver", constructor);
    const load = vi.fn();
    const content = <input defaultValue="retained" />;
    render(
      <LazyLoad threshold={0.5} rootMargin="40px" placeholder="Waiting" onLoad={load}>
        {content}
      </LazyLoad>,
    );
    expect(host.querySelector("input")).toBeNull();
    expect(constructor.mock.calls[0][1]).toMatchObject({ rootMargin: "40px", threshold: 0.5 });
    const entry = (ratio: number) =>
      [{ isIntersecting: true, intersectionRatio: ratio }] as IntersectionObserverEntry[];
    act(() => observe(entry(0.2), {} as IntersectionObserver));
    expect(host.textContent).toBe("Waiting");
    act(() => observe(entry(0.6), {} as IntersectionObserver));
    expect(host.querySelector("input")!.value).toBe("retained");
    act(() => observe(entry(0.9), {} as IntersectionObserver));
    expect(load).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalled();
  });
  it("renders eagerly when disabled or IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<LazyLoad>Loaded</LazyLoad>);
    expect(host.textContent).toBe("Loaded");
    render(<LazyLoad disabled>Immediate</LazyLoad>);
    expect(host.textContent).toBe("Immediate");
  });
  it("disconnects an unrevealed observer and ignores callbacks after unmount", () => {
    let callback: IntersectionObserverCallback;
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const load = vi.fn();
    render(<LazyLoad onLoad={load}>Deferred</LazyLoad>);
    act(() => root.render(null));
    act(() =>
      callback(
        [{ isIntersecting: true, intersectionRatio: 1 }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(load).not.toHaveBeenCalled();
  });
});

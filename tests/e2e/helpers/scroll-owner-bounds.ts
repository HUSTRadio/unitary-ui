/** Browser-side measurement shared by the route audit and its regression fixtures. */
export function collectLocalScrollOwners() {
  const rectJson = (r: { left: number; right: number; top: number; bottom: number }) => ({
    x: r.left, y: r.top, width: Math.max(0, r.right - r.left), height: Math.max(0, r.bottom - r.top),
    left: r.left, right: r.right, top: r.top, bottom: r.bottom,
  });
  const main = document.getElementById("main-content")?.getBoundingClientRect();
  const owners = [];
  // Scroll-owner contract resolution (fail-closed). Kept inside this function because the
  // whole function is serialised into the page via page.evaluate().
  // 1) The element's own data-scroll-owner wins: it is a stable attribute emitted after the
  //    props spread, so consumers (e.g. DataTable overriding data-slot) cannot shadow it.
  // 2) Otherwise only primitives whose scroll node is the element itself, matched by data-slot.
  // 3) Only then an ancestor lookup, and only for the container-shaped `scroller` (its scroll
  //    node is the inner viewport, the slot sits on the outer shell). Never add `data-table`
  //    here: that would excuse any overflowing descendant inside a DataTable subtree.
  const declaredOwners = ["table-root", "scroller", "tabs", "code-block-tabs"];
  const selfSlotOwners = ["tabs", "code-block-tabs"];
  const resolveComponentScrollPrimitive = (el: HTMLElement, slot: string | null) => {
    const declared = el.getAttribute("data-scroll-owner");
    if (declared !== null) return declaredOwners.includes(declared) ? declared : null;
    if (slot !== null && selfSlotOwners.includes(slot)) return slot;
    return el.closest('[data-slot="scroller"]') ? "scroller" : null;
  };
  for (const el of document.querySelectorAll<HTMLElement>("body *")) {
    const style = getComputedStyle(el);
    const bounds = el.getBoundingClientRect();
    if (!bounds.width || !bounds.height || style.visibility === "hidden") continue;
    if (!["auto", "scroll"].includes(style.overflowX) || el.scrollWidth <= el.clientWidth + 1) continue;
    const visible = { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
    // A nested scroll owner's offscreen content remains within its ancestor's clip.
    // Intersect each clipping axis; overflow:visible must never hide a real escape.
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
      const cs = getComputedStyle(parent);
      const box = parent.getBoundingClientRect();
      if (["hidden", "clip", "auto", "scroll"].includes(cs.overflowX)) {
        visible.left = Math.max(visible.left, box.left + parent.clientLeft);
        visible.right = Math.min(visible.right, box.left + parent.clientLeft + parent.clientWidth);
      }
      if (["hidden", "clip", "auto", "scroll"].includes(cs.overflowY)) {
        visible.top = Math.max(visible.top, box.top + parent.clientTop);
        visible.bottom = Math.min(visible.bottom, box.top + parent.clientTop + parent.clientHeight);
      }
    }
    const fullyClipped = visible.right <= visible.left || visible.bottom <= visible.top;
    const insideMain = !!main && (fullyClipped || (
      visible.left >= main.left - 1 && visible.right <= main.right + 1 &&
      visible.top >= main.top - 1 && visible.bottom <= main.bottom + 1
    ));
    const slot = el.getAttribute("data-slot");
    const demo = el.getAttribute("data-demo-card") ?? el.getAttribute("data-demo-container") ?? el.getAttribute("data-grid-demo");
    const cls = (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".");
    const componentScrollPrimitive = resolveComponentScrollPrimitive(el, slot);
    owners.push({
      selector: `${el.tagName.toLowerCase()}${slot ? `[data-slot=${slot}]` : ""}${demo ? `[${demo}]` : ""}${cls ? `.${cls}` : ""}`,
      clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
      rect: rectJson(bounds), visibleRect: rectJson(visible), insideMain,
      demoCard: el.closest("[data-demo-card]")?.getAttribute("data-demo-card") ?? null,
      componentScrollPrimitive,
    });
  }
  return owners;
}

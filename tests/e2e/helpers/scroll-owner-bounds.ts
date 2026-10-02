/** Browser-side measurement shared by the route audit and its regression fixtures. */
export function collectLocalScrollOwners() {
  const rectJson = (r: { left: number; right: number; top: number; bottom: number }) => ({
    x: r.left, y: r.top, width: Math.max(0, r.right - r.left), height: Math.max(0, r.bottom - r.top),
    left: r.left, right: r.right, top: r.top, bottom: r.bottom,
  });
  const main = document.getElementById("main-content")?.getBoundingClientRect();
  const owners = [];
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
    const componentSlot = el.closest('[data-slot="scroller"], [data-slot="tabs"], [data-slot="table-root"], [data-slot="code-block-tabs"]')?.getAttribute("data-slot");
    const componentScrollPrimitive = componentSlot === "scroller" || componentSlot === "tabs" || componentSlot === "table-root" || componentSlot === "code-block-tabs" ? componentSlot : null;
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

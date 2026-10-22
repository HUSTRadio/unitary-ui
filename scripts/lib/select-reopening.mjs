/** Browser instrumentation only. No product imports, layout reads or polling. */
export function installSelectReopeningProbe({ diagnostic = false } = {}) {
  const events = [], renderers = [], ids = new WeakMap(), positioned = new WeakSet();
  let nextId = 0;
  const id = node => { if (!ids.has(node)) ids.set(node, ++nextId); return ids.get(node); };
  const record = (kind, detail = {}) => events.push({ kind, at: performance.now(), ...detail });
  const input = event => {
    if (event.target instanceof Element && event.target.closest('[data-slot="select-trigger"]'))
      record("input", { type: event.type, trusted: event.isTrusted, key: event.key });
  };
  for (const type of ["pointerdown", "touchstart", "keydown"]) document.addEventListener(type, input, true);
  const focus = event => {
    const content = event.target instanceof Element && event.target.closest('[data-slot="select-content"]');
    if (content) record("focus", { portalId: id(content), slot: event.target.getAttribute("data-slot") });
  };
  document.addEventListener("focusin", focus, true);
  const commit = event => record("value-commit", event.detail);
  window.addEventListener("glass-fixture:commit", commit);
  const attached = new WeakSet();
  const observer = new MutationObserver(() => {
    for (const node of document.querySelectorAll('[data-slot="select-content"]')) {
      if (!attached.has(node)) { attached.add(node); record("attached", { portalId: id(node) }); }
      const wrapper = node.closest('[data-radix-popper-content-wrapper]');
      // This marks publication of Radix's resolved positioning styles, not GPU
      // presentation. Inspect inline state without forcing style/layout work.
      if (!positioned.has(node) && wrapper?.style.transform && !wrapper.style.transform.includes("-200%")) {
        positioned.add(node); record("positioned", { portalId: id(node), transform: wrapper.style.transform, side: node.getAttribute("data-side") });
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "data-side"] });
  const previousHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!previousHook) window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, renderers: new Map(),
    inject(renderer) { const key = renderers.length + 1; renderers.push({ version: renderer.version, rendererPackageName: renderer.rendererPackageName }); this.renderers.set(key, renderer); return key; },
    onCommitFiberRoot(rendererId) { record("react-commit", { rendererId }); },
    onCommitFiberUnmount() {},
    onPostCommitFiberRoot() {},
  };
  const originalStyle = window.getComputedStyle;
  if (diagnostic) window.getComputedStyle = function(node, pseudo) {
    const tracked = node instanceof Element && node.matches('[data-slot="select-content"], [data-radix-popper-content-wrapper]');
    const start = performance.now(), result = originalStyle.call(this, node, pseudo);
    if (tracked) record("style-read", { duration: performance.now() - start, slot: node.getAttribute("data-slot"), stack: new Error().stack });
    return result;
  };
  window.__selectReopening = {
    events, renderers, id,
    finish() {
      observer.disconnect();
      for (const type of ["pointerdown", "touchstart", "keydown"]) document.removeEventListener(type, input, true);
      document.removeEventListener("focusin", focus, true);
      window.removeEventListener("glass-fixture:commit", commit);
      if (diagnostic) window.getComputedStyle = originalStyle;
      return { events, renderers, diagnostic, positionBoundary: "first resolved positioning-style publication; not presentation" };
    },
  };
}

/** Associate tasks with trusted trigger input and subsequent portal publication.
 * Unattributed tasks remain visible; proximity alone is not source attribution. */
export function attributeReopeningTasks(tasks, events) {
  return tasks.map(task => {
    const end = task.startTime + task.duration;
    const input = events.find(event => event.kind === "input" && event.trusted
      && ["pointerdown", "touchstart"].includes(event.type) && event.at >= task.startTime && event.at <= end);
    const attached = input && events.find(event => event.kind === "attached" && event.at >= input.at && event.at <= end + 100);
    return { ...task, reopening: Boolean(input && attached), input: input ?? null, portalId: attached?.portalId ?? null,
      events: events.filter(event => event.at >= task.startTime && event.at <= end + 100
        && (event.portalId === undefined || event.portalId === attached?.portalId)) };
  });
}

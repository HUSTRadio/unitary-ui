import { clamp, createGlassSampler, glassBodyOpacity, glassEdgeLighting, glassMapPreservesOrientation, glassMapSize, glassRefractionWidth, type GlassGeometry } from "./glass-optics";

const owners = '[data-material="floating"], [data-material="navigation"], .material-tooltip, .material-menu, .material-modal, .material-fullscreen';
const controls = '[data-uni-button][data-type="secondary"].bg-background-100, [data-slot="radio-item-wrapper"]:is(.bg-background,.bg-background-100,.bg-muted)';
const selector = `${owners}, ${controls}`;
const namespaces = "http://www.w3.org/2000/svg";
const managers = new WeakMap<Document, { count: number; dispose: () => void }>();
let serial = 0;

/** Syntax alone cannot establish SVG backdrop rendering. Gate to the tested engine. */
export function supportsGlassRefraction(view: Window & typeof globalThis): boolean {
  const version = /(?:Chrome|Chromium)\/(\d+)/.exec(view.navigator.userAgent);
  return Boolean(version && Number(version[1]) >= 151
    && !/Mobile|Android|iPhone|iPad|iPod/.test(view.navigator.userAgent)
    && view.CSS?.supports?.("backdrop-filter", 'url("#unitary-glass")')
    && view.ResizeObserver && view.MutationObserver && view.Image?.prototype.decode);
}

function createManager(doc: Document): () => void {
  const view = doc.defaultView;
  if (!view || !supportsGlassRefraction(view)) return () => {};
  const svg = doc.createElementNS(namespaces, "svg");
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("data-uni-glass-defs", "");
  svg.style.cssText = "position:fixed;pointer-events:none;overflow:hidden";
  const defs = doc.createElementNS(namespaces, "defs"); svg.append(defs); doc.body.append(svg);
  type Entry = { key: string; id: string; filter: SVGFilterElement; paint: string; refs: number };
  type Request = { key: string };
  type Build = { consumers: Map<HTMLElement, Request>; cancelled: boolean };
  const cache = new Map<string, Entry>();
  const building = new Map<string, Build>();
  const requests = new Map<HTMLElement, Request>();
  const elements = new Map<HTMLElement, { key: string }>();
  const pending = new Set<HTMLElement>();
  const yields = new Map<number, () => void>();
  let frame = 0, disposed = false, needsScan = false;
  const canvas = doc.createElement("canvas");
  canvas.width = 1; canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) { svg.remove(); return () => {}; }

  function release(element: HTMLElement) {
    const request = requests.get(element);
    const build = request && building.get(request.key);
    if (build && build.consumers.get(element) === request) {
      build.consumers.delete(element);
      if (!build.consumers.size) { build.cancelled = true; building.delete(request!.key); }
    }
    requests.delete(element);
    pending.delete(element);
    const binding = elements.get(element);
    if (binding) {
      const entry = cache.get(binding.key);
      if (entry && --entry.refs === 0) { entry.filter.remove(); cache.delete(binding.key); }
      elements.delete(element);
    }
    element.style.removeProperty("--_uni-glass-backdrop");
    element.style.removeProperty("--_uni-glass-paint");
    element.removeAttribute("data-uni-glass-renderer");
  }
  function eligible(element: HTMLElement, style: CSSStyleDeclaration): boolean {
    if (!element.isConnected || !element.matches(selector) || element.closest('.surface-shadow,[data-material-stem],[inert]')
      || element.matches(':disabled,[aria-disabled="true"]') || element.querySelector('input:disabled')) return false;
    if (element.dataset.materialSurface && element.dataset.materialSurface !== "default") return false;
    if (/^(success|warning|error)$/.test(element.dataset.kind ?? "")) return false;
    if (style.clipPath !== "none" || !/^(none|blur\(0px\))$/.test(style.filter)) return false;
    if (element.style.background || element.style.backgroundColor || element.style.backgroundImage
      || element.style.backdropFilter || element.style.getPropertyValue("-webkit-backdrop-filter")) return false;
    const backgrounds = [...element.classList].filter(value => value.startsWith("bg-"));
    if (backgrounds.some(value => !/^(bg-background|bg-background-100|bg-surface|bg-popover|bg-muted|bg-\[var\(--uni-background-100\)\]|bg-\[var\(--color-bg-elevated\)\]|bg-\[var\(--tooltip-background\)\])$/.test(value))) return false;
    // Nested material surfaces and controls share their nearest backdrop sampler.
    if (element.parentElement?.closest(`${owners}, [data-material="mask-backdrop"], [data-material="mask-scrim"]`)) return false;
    for (let parent = element.parentElement; parent && parent !== doc.body; parent = parent.parentElement) {
      const ancestor = view!.getComputedStyle(parent);
      if (ancestor.filter !== "none" || Number.parseFloat(ancestor.opacity) < 1) return false;
    }
    return true;
  }
  function color(value: string): number[] {
    // Resolved theme colors need no raster readback. Keep Canvas conversion for authored CSS color spaces.
    const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value);
    if (hex) {
      const digits = hex[1].length === 3 ? [...hex[1]].map(c => c + c).join("") : hex[1];
      return [0, 2, 4].map(offset => Number.parseInt(digits.slice(offset, offset + 2), 16));
    }
    const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(value);
    if (rgb && (!rgb[4] || rgb[4] === "1" || rgb[4] === "100%")) return rgb.slice(1, 4).map(channel => clamp(Math.round(Number(channel)), 0, 255));
    context!.clearRect(0, 0, 1, 1); context!.fillStyle = value;
    context!.fillRect(0, 0, 1, 1);
    return [...context!.getImageData(0, 0, 1, 1).data].slice(0, 3);
  }
  function readSurface(element: HTMLElement) {
    if (!element.isConnected || !element.matches(selector)) return null;
    const style = view!.getComputedStyle(element);
    const read = (suffix: string) => style.getPropertyValue(`--material-texture-glass-${suffix}`).trim();
    const number = (suffix: string, fallback: number) => {
      const effective = style.getPropertyValue(`--_uni-glass-effective-${suffix}`).trim();
      const n = Number.parseFloat(effective || read(suffix)); return Number.isFinite(n) ? n : fallback;
    };
    const width = Number.parseFloat(style.width), height = Number.parseFloat(style.height);
    if (!eligible(element, style) || !(width > 0 && height > 0) || Number.parseFloat(read("refraction")) <= 0 || number("refraction", 6) <= 0) return null;
    const radiusStrings = [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius];
    if (radiusStrings.some(radius => radius.split(/\s+/).length > 1
      || (radius.endsWith("%") && Number.parseFloat(radius) > 0 && element.offsetWidth !== element.offsetHeight))) return null;
    const g: GlassGeometry = {
      width: element.offsetWidth, height: element.offsetHeight,
      radii: radiusStrings.map(radius => Math.min(Number.parseFloat(radius) * (radius.endsWith("%") ? Math.min(width, height) / 100 : 1), Math.min(width, height) / 2)) as unknown as GlassGeometry["radii"],
      edge: number("edge-width", 10), refraction: number("refraction", 6), ior: clamp(number("ior", 1.5), 1, 2.5), thickness: clamp(number("thickness", 1), 0, 4),
    };
    if (!g.width || !g.height || g.radii.some(r => !Number.isFinite(r)) || glassRefractionWidth(g) <= 0) return null;
    const values = { blur: number("blur", 1), opacity: number("opacity", 52) / 100,
      roughness: clamp(number("roughness", 0.24), 0, 1), absorption: clamp(number("absorption", 0.08), 0, 1),
      light: clamp(number("light-intensity", 0.65), 0, 2), ambient: clamp(number("ambient-intensity", 0.25), 0, 1),
      azimuth: number("light-azimuth", 315) * Math.PI / 180,
      base: style.getPropertyValue("--material-texture-base").trim() || style.getPropertyValue("--color-bg-surface").trim() || "white",
      ambientColor: read("ambient-color") === "currentColor" ? style.color : read("ambient-color") || style.color };
    const key = JSON.stringify([g, values]);
    return { g, values, key };
  }
  type Surface = NonNullable<ReturnType<typeof readSurface>>;

  function yieldWork() {
    return new Promise<void>(resolve => {
      const id = view!.setTimeout(() => { yields.delete(id); resolve(); }, 0);
      yields.set(id, resolve);
    });
  }
  function encode(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve, reject) => canvas.toBlob(blob => {
      if (!blob) { reject(new Error("Glass PNG encoding failed")); return; }
      const reader = new view!.FileReader();
      reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    }, "image/png"));
  }
  async function buildImages({ g, values }: Surface, task: Build) {
    const cancelled = () => disposed || task.cancelled;
    // Start each unique key in its own task instead of accumulating slices in one microtask checkpoint.
    await yieldWork();
    if (cancelled()) return null;
    // Every in-flight key owns its canvas; yielding must not mix different geometries.
    // 分片期间每个 key 独占画布，避免不同几何的并发构建互相覆盖。
    const canvas = doc.createElement("canvas"), context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;
    const size = glassMapSize(g.width, g.height);
    canvas.width = size.width; canvas.height = size.height;
    const base = color(values.base), ambient = color(values.ambientColor);
    const toLinear = (v: number) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const toSrgb = (v: number) => v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
    const baseLinear = base.map(v => toLinear(v / 255)), ambientLinear = ambient.map(v => toLinear(v / 255));
    const lighting = glassEdgeLighting(g.ior, values.roughness, values.azimuth);
    const sample = createGlassSampler(g);
    const surfacePaint = (s: ReturnType<typeof sample>) => {
      const film = glassBodyOpacity(values.opacity, values.absorption, s.pathLength);
      const light = lighting(s);
      const key = light.key * values.light, environment = values.ambient * light.environment;
      const budget = Math.max(1, (key + environment) / 0.85);
      const shine = key / budget, env = environment / budget, reflection = shine + env;
      const body = film * (1 - reflection), alpha = body + reflection;
      // 透射与反射共享能量预算，存储直通颜色供浏览器合成。Store straight color from premultiplied optical contributions.
      const rgba = baseLinear.map((v, c) => {
        const radiance = v * body + shine + ambientLinear[c] * env;
        return toSrgb(clamp(alpha > 0 ? radiance / alpha : 0, 0, 1)) * 255;
      });
      return [...rgba, alpha * 255];
    };
    const flatPaint = surfacePaint(sample(g.width / 2, g.height / 2));
    const map = context!.createImageData(size.width, size.height), paint = context!.createImageData(size.width, size.height);
    const scale = Math.max(1, glassRefractionWidth(g) * 1.5);
    let deadline = view!.performance.now() + 4;
    for (let y = 0; y < size.height; y++) for (let x = 0; x < size.width; x++) {
      const s = sample((x + 0.5) * g.width / size.width, (y + 0.5) * g.height / size.height);
      const index = (y * size.width + x) * 4;
      map.data[index] = clamp(Math.round((s.dx / scale + 0.5) * 256), 0, 255);
      map.data[index + 1] = clamp(Math.round((s.dy / scale + 0.5) * 256), 0, 255);
      map.data[index + 3] = 255;
      // CSS owns the antialiased silhouette; do not cut a second hole in the PNG.
      paint.data.set(s.t === 0 ? flatPaint : surfacePaint(s), index);
      if ((x & 31) === 31 && view!.performance.now() >= deadline) {
        await yieldWork(); if (cancelled()) return null;
        deadline = view!.performance.now() + 4;
      }
    }
    await yieldWork();
    if (cancelled() || !glassMapPreservesOrientation(map.data, size.width, size.height, scale, g)) return null;
    // Keep native canvas allocation/encoding out of the last pixel-computation task.
    await yieldWork(); if (cancelled()) return null;
    context.putImageData(map, 0, 0); const displacement = await encode(canvas);
    if (cancelled()) return null;
    context.putImageData(paint, 0, 0); const surface = await encode(canvas);
    // Decode before publishing the filter: blocked data images retain CSS fallback.
    const image = new view!.Image(); image.src = displacement;
    await image.decode();
    return cancelled() ? null : { displacement, surface, scale };
  }
  function createEntry({ g, values, key }: Surface, images: NonNullable<Awaited<ReturnType<typeof buildImages>>>): Entry {
    const { displacement, surface, scale } = images;
    const id = `uni-glass-${++serial}`;
    const filter = doc.createElementNS(namespaces, "filter");
    filter.setAttribute("id", id); filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("x", "0"); filter.setAttribute("y", "0");
    filter.setAttribute("width", String(g.width)); filter.setAttribute("height", String(g.height));
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const blur = doc.createElementNS(namespaces, "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic"); blur.setAttribute("stdDeviation", String(Math.max(0, values.blur))); blur.setAttribute("result", "blurred");
    blur.setAttribute("edgeMode", "duplicate");
    const feImage = doc.createElementNS(namespaces, "feImage");
    feImage.setAttribute("href", displacement); feImage.setAttribute("width", String(g.width)); feImage.setAttribute("height", String(g.height)); feImage.setAttribute("preserveAspectRatio", "none"); feImage.setAttribute("result", "map");
    const transfer = doc.createElementNS(namespaces, "feComponentTransfer"); transfer.setAttribute("in", "map"); transfer.setAttribute("result", "neutralMap");
    for (const name of ["feFuncR", "feFuncG"]) { const fn = doc.createElementNS(namespaces, name); fn.setAttribute("type", "linear"); fn.setAttribute("slope", String(255 / 256)); transfer.append(fn); }
    const displace = doc.createElementNS(namespaces, "feDisplacementMap");
    displace.setAttribute("in", "blurred"); displace.setAttribute("in2", "neutralMap"); displace.setAttribute("scale", String(scale)); displace.setAttribute("xChannelSelector", "R"); displace.setAttribute("yChannelSelector", "G");
    filter.append(blur, feImage, transfer, displace); defs.append(filter);
    const entry = { key, id, filter, paint: surface, refs: 0 }; cache.set(key, entry); return entry;
  }
  function commit(element: HTMLElement, request: Request, entry: Entry) {
    if (disposed || requests.get(element) !== request) return;
    const current = readSurface(element);
    if (!current || current.key !== request.key) {
      release(element);
      if (current) enqueue(element); else forget(element);
      return;
    }
    requests.delete(element);
    entry.refs++;
    element.style.setProperty("--_uni-glass-backdrop", `url("#${entry.id}")`);
    element.style.setProperty("--_uni-glass-paint", `url("${entry.paint}")`);
    element.dataset.uniGlassRenderer = "svg";
    elements.set(element, { key: request.key });
  }
  function update(element: HTMLElement) {
    const input = readSurface(element);
    if (!input) { forget(element); return; }
    const { key } = input;
    if (elements.get(element)?.key === key || requests.get(element)?.key === key) return;
    release(element);
    const request = { key }; requests.set(element, request);
    const cached = cache.get(key);
    if (cached) { commit(element, request, cached); return; }
    let task = building.get(key);
    if (!task) {
      const shared: Build = { consumers: new Map(), cancelled: false };
      task = shared; building.set(key, shared);
      // Register before work begins so the same batch joins one build, even before decoding.
      void Promise.resolve().then(() => buildImages(input, shared)).then(images => {
        if (!images || disposed || shared.cancelled) return;
        const entry = createEntry(input, images);
        for (const [node, subscription] of shared.consumers) commit(node, subscription, entry);
        if (!entry.refs) { entry.filter.remove(); cache.delete(key); }
      }).catch(() => {
        // The readable CSS fallback remains in place. A later invalidation may retry.
      }).finally(() => {
        for (const [node, subscription] of shared.consumers) {
          if (requests.get(node) === subscription) requests.delete(node);
        }
        if (building.get(key) === shared) building.delete(key);
      });
    }
    task.consumers.set(element, request);
  }
  function schedule() {
    if (disposed || frame) return;
    frame = view!.requestAnimationFrame(() => {
      frame = 0;
      if (needsScan) { needsScan = false; scan(); }
      const batch = [...pending]; pending.clear();
      for (const node of batch) update(node);
    });
  }
  function enqueue(element: HTMLElement) {
    if (disposed) return;
    pending.add(element); schedule();
  }
  const resize = new view.ResizeObserver(entries => entries.forEach(entry => {
    if (observed.has(entry.target as HTMLElement)) enqueue(entry.target as HTMLElement);
  }));
  const observed = new Set<HTMLElement>();
  function forget(node: HTMLElement) { resize.unobserve(node); observed.delete(node); release(node); }
  function scan() {
    for (const node of observed) if (!node.isConnected || !node.matches(selector)) forget(node);
    for (const node of doc.querySelectorAll<HTMLElement>(selector)) {
      if (!observed.has(node)) { observed.add(node); resize.observe(node); }
      pending.add(node);
    }
  }
  const invalidate = () => { if (!disposed) { needsScan = true; schedule(); } };
  const stripPrivate = (value: string | null) => {
    // CSS parsing preserves semicolons inside data URLs; a textual regex does not.
    const style = doc.createElement("span").style; style.cssText = value ?? "";
    return Array.from(style).filter(name => !name.startsWith("--_uni-glass-"))
      .map(name => `${name}:${style.getPropertyValue(name)}!${style.getPropertyPriority(name)}`).sort().join(";");
  };
  const mutations = new view.MutationObserver(records => {
    if (records.every(record => (record.target as Element).closest?.("[data-uni-glass-defs]") || (
      record.type === "attributes" && record.attributeName === "style" && record.target instanceof view.HTMLElement
        && stripPrivate(record.oldValue) === stripPrivate(record.target.getAttribute("style")))
    )) return;
    invalidate();
  });
  mutations.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "style", "data-theme", "data-material", "data-type", "data-uni-button", "data-slot", "data-material-surface", "data-kind", "disabled", "aria-disabled", "inert"] });
  doc.addEventListener("unitary:tokens-change", invalidate);
  const contrast = view.matchMedia?.("(prefers-contrast: more)");
  contrast?.addEventListener("change", invalidate);
  doc.addEventListener("animationend", invalidate); doc.addEventListener("transitionend", invalidate); invalidate();
  return () => {
    disposed = true; view.cancelAnimationFrame(frame); resize.disconnect(); mutations.disconnect();
    doc.removeEventListener("unitary:tokens-change", invalidate);
    contrast?.removeEventListener("change", invalidate);
    doc.removeEventListener("animationend", invalidate); doc.removeEventListener("transitionend", invalidate);
    for (const [id, resume] of yields) { view.clearTimeout(id); resume(); } yields.clear();
    for (const task of building.values()) task.cancelled = true;
    for (const node of observed) release(node);
    pending.clear(); requests.clear(); building.clear(); cache.clear(); observed.clear(); svg.remove();
  };
}

/** Root-provider ownership is reference-counted for StrictMode and multiple roots. */
export function acquireGlassRuntime(doc: Document): () => void {
  let manager = managers.get(doc);
  if (!manager) { manager = { count: 0, dispose: createManager(doc) }; managers.set(doc, manager); }
  manager.count++;
  return () => { if (--manager.count === 0) { manager.dispose(); managers.delete(doc); } };
}

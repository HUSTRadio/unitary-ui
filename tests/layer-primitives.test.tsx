// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Layer, LayerPortal, LayerScope, useLayerStyle } from "../src/components/ui/layer";
import { Modal, ModalContent, ModalTitle, ModalDescription } from "../src/components/ui/modal";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root | undefined;
let host: HTMLDivElement;
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  document.body.replaceChildren();
});
async function render(children: React.ReactNode) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  await act(async () => root!.render(children));
}
function Surface({ id }: { id: string }) {
  return <div data-testid={id} style={useLayerStyle("popover")} />;
}

describe("Layer primitives", () => {
  it("renders a neutral positioned layer and preserves explicit style overrides", async () => {
    await render(<Layer style={{ zIndex: 17 }} aria-label="surface" />);
    const layer = host.querySelector<HTMLElement>('[data-slot="layer"]')!;
    expect(layer.dataset.level).toBe("base");
    expect(layer.classList.contains("relative")).toBe(true);
    expect(layer.style.zIndex).toBe("17");
    expect(layer.getAttribute("aria-label")).toBe("surface");
  });
  it("merges nested overrides across portals without leaking to independent scopes", async () => {
    await render(<>
      <LayerScope levels={{ popover: 71, tooltip: 72 }}>
        <LayerScope levels={{ tooltip: 99 }} isolate>
          <LayerPortal><Surface id="nested" /></LayerPortal>
        </LayerScope>
      </LayerScope>
      <LayerScope><LayerPortal><Surface id="independent" /></LayerPortal></LayerScope>
    </>);
    const nested = document.querySelector<HTMLElement>('[data-testid="nested"]')!;
    expect(nested.style.getPropertyValue("--uni-z-popover")).toBe("71");
    expect(nested.style.getPropertyValue("--uni-z-tooltip")).toBe("99");
    expect(host.contains(nested)).toBe(false);
    expect(document.querySelector<HTMLElement>('[data-testid="independent"]')!.style.getPropertyValue("--uni-z-popover")).toBe("");
    expect(host.querySelector('[data-isolate="true"]')?.classList.contains("isolate")).toBe(true);
  });
  it("updates and removes portal overrides on existing mounted content", async () => {
    const view = (levels: { popover?: number }) => <LayerScope levels={levels}><LayerPortal><Surface id="live" /></LayerPortal></LayerScope>;
    await render(view({ popover: 81 }));
    const node = document.querySelector<HTMLElement>('[data-testid="live"]')!;
    await render(view({ popover: 82 }));
    expect(document.querySelector('[data-testid="live"]')).toBe(node);
    expect(node.style.getPropertyValue("--uni-z-popover")).toBe("82");
    await render(view({}));
    expect(node.style.getPropertyValue("--uni-z-popover")).toBe("");
  });
  it("bridges both the modal backdrop and content without changing portal placement", async () => {
    await render(<LayerScope levels={{ modal: 451 }}><Modal open><ModalContent><ModalTitle>Scoped modal</ModalTitle><ModalDescription>Scope test</ModalDescription></ModalContent></Modal></LayerScope>);
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog.style.getPropertyValue("--uni-z-modal")).toBe("451");
    const backdrop = dialog.closest<HTMLElement>('[data-state="open"]')?.parentElement!;
    expect(backdrop.style.getPropertyValue("--uni-z-modal")).toBe("451");
    expect(host.contains(dialog)).toBe(false);
  });
  it("uses an explicit portal container and removes nodes on unmount", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    await render(<LayerPortal container={target}><span>Portal child</span></LayerPortal>);
    expect(target.textContent).toBe("Portal child");
    await render(null);
    expect(target.children).toHaveLength(0);
  });
  it("renders no portal during server rendering and rejects fractional levels", () => {
    expect(renderToString(<LayerPortal><span>Portal</span></LayerPortal>)).toBe("");
    expect(() => renderToString(<LayerScope levels={{ popover: 1.5 }} />)).toThrow("safe integer");
  });
});

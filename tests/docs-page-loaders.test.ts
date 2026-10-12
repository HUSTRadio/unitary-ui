// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { DOCS_ROUTE_SEQUENCE } from "../docs/site/src/data/docs-routes";
import type { SyntheticEvent } from "react";
import { DOCS_PAGE_RESOURCES, getDocsPrefetchResource, prefetchDocsLink } from "../docs/site/src/data/page-loaders";

test("every localized route loads its registered page resource", async () => {
  try {
    for (const route of DOCS_ROUTE_SEQUENCE) {
      if (route.renderer.kind !== "localized") continue;
      const page = DOCS_PAGE_RESOURCES[route.renderer.page];
      expect(page, route.to).toBeDefined();
      const load = vi.spyOn(page, "load").mockResolvedValue(undefined as never);
      const resource = getDocsPrefetchResource(route.to);
      expect(resource, route.to).toBeDefined();
      await resource!.load();
      expect(load).toHaveBeenCalledOnce();
      load.mockRestore();
    }
  } finally {
    vi.restoreAllMocks();
  }
});

test("delegated prefetch honors saveData while explicit page loading remains available", async () => {
  const link = document.createElement("a");
  link.href = "#/api/tokens";
  const child = link.appendChild(document.createElement("span"));
  const resource = getDocsPrefetchResource("/api/tokens")!;
  const prefetch = vi.spyOn(resource, "prefetch").mockResolvedValue(undefined);
  const load = vi.spyOn(resource, "load").mockResolvedValue(undefined);
  const event = { defaultPrevented: false, target: child } as unknown as SyntheticEvent<HTMLElement>;
  try {
    vi.stubGlobal("navigator", { connection: { saveData: true } });
    prefetchDocsLink(event);
    expect(prefetch).not.toHaveBeenCalled();
    await resource.load();
    expect(load).toHaveBeenCalledOnce();

    vi.stubGlobal("navigator", { connection: { saveData: false } });
    prefetchDocsLink(event);
    expect(prefetch).toHaveBeenCalledOnce();
    vi.stubGlobal("navigator", {});
    prefetchDocsLink(event);
    expect(prefetch).toHaveBeenCalledTimes(2);
    prefetchDocsLink({ ...event, defaultPrevented: true } as SyntheticEvent<HTMLElement>);
    expect(prefetch).toHaveBeenCalledTimes(2);
  } finally {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
});

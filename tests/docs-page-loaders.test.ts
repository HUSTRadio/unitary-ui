// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { DOCS_ROUTE_SEQUENCE } from "../docs/site/src/data/docs-routes";
import { DOCS_PAGE_RESOURCES, getDocsPrefetchResource } from "../docs/site/src/data/page-loaders";

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

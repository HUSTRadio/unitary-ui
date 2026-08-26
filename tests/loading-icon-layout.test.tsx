import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { Button } from "../src/components/ui/button";
import { LoadMoreButton } from "../src/components/ui/load-more-button";
import { LoadingIcon } from "../src/components/ui/loading-icon";
import { Spinner } from "../src/components/ui/spinner";
import { Tooltip } from "../src/components/ui/tooltip";

describe("fixed loading icon geometry", () => {
  test("LoadingIcon owns a fixed centered 14px box", () => {
    const html = renderToStaticMarkup(<LoadingIcon />);
    expect(html).toContain('data-slot="loading-icon"');
    expect(html).toContain("size-3.5");
    expect(html).toContain("items-center");
    expect(html).toContain("justify-center");
  });

  test("Button and LoadMoreButton share normal spacing without empty spacer elements", () => {
    const button = renderToStaticMarkup(<Button loading>Save</Button>);
    const loadMore = renderToStaticMarkup(<LoadMoreButton loading>More</LoadMoreButton>);
    const noGap = renderToStaticMarkup(
      <LoadMoreButton loading noGap>
        More
      </LoadMoreButton>,
    );

    expect(button).toContain('data-slot="loading-icon"');
    expect(button).toContain("mr-2");
    expect(loadMore).toContain('data-slot="loading-icon"');
    expect(loadMore).toContain("mr-2");
    expect(loadMore).toMatch(/<button[^>]*><span data-slot="loading-icon"/);
    expect(loadMore).not.toContain("ml-[3px]");
    expect(noGap).toContain('data-slot="loading-icon"');
    expect(noGap).toContain("mr-0");
  });

  test("Spinner puts size on its stable outer anchor and lets the SVG fill it", () => {
    const html = renderToStaticMarkup(<Spinner size="sm" />);
    expect(html).toMatch(/data-slot="spinner"[^>]*class="[^"]*size-3/);
    expect(html).toContain("size-full");
  });

  test("Spinner forwards Tooltip trigger state and ref contract to its stable outer span", () => {
    const html = renderToStaticMarkup(
      <Tooltip text="Loading" delay={false}>
        <Spinner />
      </Tooltip>,
    );
    expect(html).toMatch(/<span data-slot="spinner"[^>]*data-state="closed"/);
    expect(html).not.toMatch(/<svg[^>]*data-state="closed"/);
  });
});

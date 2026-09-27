// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

async function click(node: React.ReactNode) {
  await act(async () => {
    root.render(node);
  });
  const button = container.querySelector("button")!;
  await act(async () => {
    button.click();
    await Promise.resolve();
  });
}

describe("TextWithCopyButton event contract", () => {
  test("runs the consumer click first and respects preventDefault", async () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());

    await click(
      <TextWithCopyButton onClick={onClick} textLabel="Blocked" textToCopy="blocked" />,
    );

    expect(onClick).toHaveBeenCalledOnce();
    expect(writeText).not.toHaveBeenCalled();
  });

  test("copies text when click is not prevented", async () => {
    await click(<TextWithCopyButton textLabel="Copied text" textToCopy="copied text" />);

    expect(writeText).toHaveBeenCalledWith("copied text");
  });
});

// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { CopyButton } from "@/components/ui/copy-button";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let writeText: ReturnType<typeof vi.fn>;
let execCommand: ReturnType<typeof vi.fn>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  writeText = vi.fn().mockResolvedValue(undefined);
  execCommand = vi.fn().mockReturnValue(true);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    value: execCommand,
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

describe("CopyButton event contract", () => {
  test("runs the consumer click first and respects preventDefault", async () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    const onCopy = vi.fn();

    await click(<CopyButton textToCopy="blocked" onClick={onClick} onCopy={onCopy} />);

    expect(onClick).toHaveBeenCalledOnce();
    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
  });

  test("reports success after the text is copied", async () => {
    const onCopy = vi.fn();

    await click(<CopyButton textToCopy="copied text" onCopy={onCopy} />);

    expect(writeText).toHaveBeenCalledWith("copied text");
    expect(onCopy).toHaveBeenCalledWith("copied text");
  });

  test("falls back once and reports a terminal failure", async () => {
    const clipboardError = new Error("clipboard denied");
    writeText.mockRejectedValue(clipboardError);
    execCommand.mockReturnValue(false);
    const onCopy = vi.fn();
    const onError = vi.fn();

    await click(<CopyButton textToCopy="not copied" onCopy={onCopy} onError={onError} />);

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(clipboardError);
  });
});

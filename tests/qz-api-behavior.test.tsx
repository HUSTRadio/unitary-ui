// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
import { Video } from "@/components/ui/video";

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

async function render(node: React.ReactNode) {
  await act(async () => root.render(node));
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("TextWithCopyButton composing contract", () => {
  test("runs the external click first, then reports clipboard success", async () => {
    const order: string[] = [];
    writeText.mockImplementation(async () => {
      order.push("write");
    });

    await render(
      <TextWithCopyButton
        textToCopy="copied text"
        textLabel="Copy"
        onClick={() => order.push("click")}
        onCopy={(text) => order.push(`copy:${text}`)}
      />,
    );
    await click(container.querySelector("button")!);

    expect(writeText).toHaveBeenCalledOnce();
    expect(order).toEqual(["click", "write", "copy:copied text"]);
  });

  test("respects preventDefault and skips clipboard work and result callbacks", async () => {
    const onCopy = vi.fn();
    const onError = vi.fn();

    await render(
      <TextWithCopyButton
        textToCopy="blocked"
        textLabel="Copy"
        onClick={(event) => event.preventDefault()}
        onCopy={onCopy}
        onError={onError}
      />,
    );
    await click(container.querySelector("button")!);

    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test("reports the original clipboard failure exactly once", async () => {
    const error = new Error("clipboard denied");
    writeText.mockRejectedValue(error);
    const onCopy = vi.fn();
    const onError = vi.fn();

    await render(
      <TextWithCopyButton
        textToCopy="not copied"
        textLabel="Copy"
        onCopy={onCopy}
        onError={onError}
      />,
    );
    await click(container.querySelector("button")!);

    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(error);
  });
});

describe("Video native wrapper contract", () => {
  test("forwards the video ref, native attributes, and unhandled media events", async () => {
    const ref = React.createRef<HTMLVideoElement>();
    const onError = vi.fn();

    await render(
      <Video
        ref={ref}
        src="/demo.mp4"
        controls={false}
        crossOrigin="anonymous"
        data-testid="native-video"
        onError={onError}
      />,
    );

    const video = container.querySelector("video")!;
    expect(ref.current).toBe(video);
    expect(video.dataset.testid).toBe("native-video");
    expect(video.crossOrigin).toBe("anonymous");

    act(() => video.dispatchEvent(new Event("error")));
    expect(onError).toHaveBeenCalledOnce();
  });

  test("composes handled media events and lets external click prevent playback", async () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onTimeUpdate = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLVideoElement>) => event.preventDefault());
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

    await render(
      <Video
        src="/demo.mp4"
        onPlay={onPlay}
        onPause={onPause}
        onTimeUpdate={onTimeUpdate}
        onClick={onClick}
      />,
    );

    const video = container.querySelector("video")!;
    act(() => video.dispatchEvent(new Event("play")));
    act(() => video.dispatchEvent(new Event("pause")));
    act(() => video.dispatchEvent(new Event("timeupdate")));
    await click(video);

    expect(onPlay).toHaveBeenCalledOnce();
    expect(onPause).toHaveBeenCalledOnce();
    expect(onTimeUpdate).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
    expect(play).not.toHaveBeenCalled();
  });
});

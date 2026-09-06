// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Feedback } from "@/components/ui/feedback";
import { RATING_OPTIONS, RatingPill } from "@/components/ui/rating-pill";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(element));
  return container;
}

function radios(scope: ParentNode = document) {
  return [...scope.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
}

function openDefaultFeedback() {
  const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]')!;
  act(() => trigger.click());
  return trigger;
}

describe("Feedback official interaction model", () => {
  test("default renders a compact secondary trigger and portals an anchored dialog on click", () => {
    mount(<Feedback label="vercel" dryRun />);

    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("vercel");
    expect(trigger?.className).toContain("h-8");
    expect(trigger?.className).toContain("bg-background-100");
    expect(radios()).toHaveLength(0);

    openDefaultFeedback();

    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]');
    expect(popup?.getAttribute("role")).toBe("dialog");
    expect(popup?.className).toContain("w-[340px]");
    expect(popup?.className).toContain("rounded-xl");
    expect(radios(popup!)).toHaveLength(4);
    expect(popup?.querySelector("textarea")).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
  });

  test("inline starts as a 274 by 48 rating capsule and expands in place after rating", () => {
    mount(<Feedback type="inline" dryRun />);

    const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
    expect(capsule.className).toContain("w-[274px]");
    expect(capsule.className).toContain("h-12");
    expect(capsule.className).toContain("rounded-full");
    expect(capsule.textContent).toContain("Was this helpful?");
    expect(radios(capsule)).toHaveLength(4);
    expect(capsule.querySelector('[data-slot="feedback-form-region"]')?.getAttribute("aria-hidden")).toBe(
      "true",
    );

    act(() => radios(capsule)[3].click());

    expect(capsule.className).toContain("w-[336px]");
    expect(capsule.className).toContain("rounded-xl");
    expect(capsule.querySelector('[data-slot="feedback-form-region"]')?.getAttribute("aria-hidden")).toBeNull();
    expect(radios(capsule)[3].getAttribute("aria-checked")).toBe("true");
  });

  test("uses measured light/dark blue hover and selected values for every rating", () => {
    mount(<Feedback type="inline" dryRun />);

    for (const radio of radios(container)) {
      expect(radio.className).toContain("feedback-rating-option");
      expect(radio.className).not.toMatch(/danger-soft|warning-soft|success-soft/);
    }

    const css = readFileSync(resolve("src/styles/index.css"), "utf8");
    expect(css).toContain("--uni-feedback-blue-300: #e0f0ff");
    expect(css).toContain("--uni-feedback-blue-900: #0068d6");
    expect(css).toContain("--uni-feedback-blue-300: #0f2f57");
    expect(css).toContain("--uni-feedback-blue-900: #52a8ff");
  });

  test("uses roving tabindex and arrow keys to move and select within the radio group", () => {
    mount(<Feedback type="inline" dryRun />);
    const options = radios(container);

    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1, -1]);
    options[0].focus();
    act(() => {
      options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    });

    expect(document.activeElement).toBe(options[3]);
    expect(options[3].getAttribute("aria-checked")).toBe("true");
    expect(options.map((option) => option.tabIndex)).toEqual([-1, -1, -1, 0]);
    expect(container.querySelector('[data-slot="rating-pill"]')?.getAttribute("data-state")).toBe(
      "open",
    );
  });

  test("successful submit closes, resets and passes rating, text and metadata", () => {
    const onSubmit = vi.fn();
    mount(<Feedback metadata={{ source: "docs" }} onSubmit={onSubmit} />);
    const trigger = openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    act(() => radios(popup)[2].click());
    const textarea = popup.querySelector<HTMLTextAreaElement>("textarea")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(
        textarea,
        "Useful docs",
      );
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith("okay", "Useful docs", { source: "docs" });
    expect(document.querySelector('[data-slot="feedback-popup"]')).toBeNull();
    expect(trigger.getAttribute("data-state")).toBe("closed");
  });

  test("dryRun submit is inert and keeps the current panel open", () => {
    mount(<Feedback dryRun />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(document.querySelector('[data-slot="feedback-popup"]')).toBe(popup);
  });

  test("preserves RatingPill's public four-tone capsule behavior independently of Feedback", () => {
    mount(
      <div>
        {RATING_OPTIONS.map(({ value }) => (
          <RatingPill key={value} label={value} defaultValue={value} />
        ))}
      </div>,
    );

    const expectedToneClasses = [
      "bg-danger-soft",
      "bg-warning-soft",
      "bg-gray-alpha-200",
      "bg-success-soft",
    ];
    const pills = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="rating-pill"]'));
    expect(pills).toHaveLength(4);
    pills.forEach((pill, index) => expect(pill.className).toContain(expectedToneClasses[index]));
  });

  test("RatingPill remains a reusable inline capsule and reports selections", () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    mount(<RatingPill label="Was this helpful?" onValueChange={onValueChange} onSubmit={onSubmit} />);

    act(() => radios(container)[1].click());

    expect(onValueChange).toHaveBeenCalledWith("not-great");
    expect(onSubmit).toHaveBeenCalledWith("not-great");
    expect(radios(container)[1].getAttribute("aria-checked")).toBe("true");
  });

  test("keeps the official four rating values and order", () => {
    expect(RATING_OPTIONS.map(({ value }) => value)).toEqual([
      "hate",
      "not-great",
      "okay",
      "love",
    ]);
  });
});

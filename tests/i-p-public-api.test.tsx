// @vitest-environment jsdom

import { act, createRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";

import type { JsonViewProps } from "@/components/ui/json-view";
import type { KbdProps, KeyboardInputProps } from "@/components/ui/keyboard-input";
import type { LabelProps } from "@/components/ui/label";
import type { LoadMoreButtonProps } from "@/components/ui/load-more-button";
import type {
  MenuButtonProps,
  MenuContainerProps,
  MenuContentProps,
  MenuDividerProps,
  MenuItemLockedProps,
  MenuItemProps,
  MenuLinkProps,
  MenuPosition,
  MenuSectionProps,
} from "@/components/ui/menu";
import type {
  ModalCloseProps,
  ModalContentProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalPortalProps,
  ModalProps,
  ModalTitleProps,
  ModalTriggerProps,
} from "@/components/ui/modal";
import {
  MultiSelectContent,
  type MultiSelectContentProps,
  MultiSelectRoot,
  type MultiSelectRootProps,
  MultiSelectRow,
  MultiSelectTrigger,
  type MultiSelectTriggerProps,
} from "@/components/ui/multi-select";
import type {
  NoteActionProps,
  NoteContentProps,
  NoteLabelProps,
  NoteProps,
} from "@/components/ui/note";
import type { PaginationProps } from "@/components/ui/pagination";
import { Phone, type PhoneProps, type PhoneScreenProps } from "@/components/ui/phone";
import {
  Device,
  type DeviceProps,
  type DeviceScreenProps,
  DeviceScreen,
} from "@/components/ui/device";
import { type DeviceModelId, DEVICE_MODELS } from "@/lib/device-models";
import type { PillProps } from "@/components/ui/pill";
import type {
  ProgressLabelPosition,
  ProgressProps,
  ProgressStop,
  ProgressType,
} from "@/components/ui/progress";
import type {
  ProjectBannerCloseProps,
  ProjectBannerContentProps,
} from "@/components/ui/project-banner";

type PublicApiSurface = readonly [
  JsonViewProps,
  KeyboardInputProps,
  KbdProps,
  LabelProps,
  LoadMoreButtonProps,
  MenuPosition,
  MenuContainerProps,
  MenuButtonProps,
  MenuContentProps,
  MenuItemProps,
  MenuLinkProps,
  MenuItemLockedProps,
  MenuDividerProps,
  MenuSectionProps,
  ModalProps,
  ModalTriggerProps,
  ModalPortalProps,
  ModalCloseProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalFooterProps,
  MultiSelectRootProps,
  MultiSelectTriggerProps,
  MultiSelectContentProps,
  NoteProps,
  NoteContentProps,
  NoteLabelProps,
  NoteActionProps,
  PaginationProps,
  PhoneProps,
  PhoneScreenProps,
  DeviceProps,
  DeviceScreenProps,
  DeviceModelId,
  PillProps,
  ProgressProps,
  ProgressType,
  ProgressLabelPosition,
  ProgressStop,
  ProjectBannerContentProps,
  ProjectBannerCloseProps,
];

describe("I-P public API contracts", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  test("exports the named public prop and compound component types", () => {
    expectTypeOf<PublicApiSurface>().toMatchTypeOf<readonly unknown[]>();
  });

  test("MultiSelectRoot forwards controlled Popover state callbacks", () => {
    const onOpenChange = vi.fn();

    act(() => {
      root.render(
        <MultiSelectRoot open={false} onOpenChange={onOpenChange}>
          <MultiSelectTrigger>Filters</MultiSelectTrigger>
          <MultiSelectContent>Options</MultiSelectContent>
        </MultiSelectRoot>,
      );
    });

    act(() => container.querySelector<HTMLButtonElement>("button")?.click());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test("MultiSelectRow keeps legacy count props optional", () => {
    act(() => {
      root.render(
        <MultiSelectRow
          name="Analytics"
          checked={false}
          onChange={vi.fn()}
          onSelectOnly={vi.fn()}
          onSelectAll={vi.fn()}
        />,
      );
    });

    expect(container.textContent).toContain("Analytics");
  });

  test("Phone forwards native div attributes and refs", () => {
    const ref = createRef<HTMLDivElement>();
    const children: ReactNode = <span>Screen</span>;

    act(() => {
      root.render(
        <Phone ref={ref} id="phone-preview" aria-label="Phone preview">
          {children}
        </Phone>,
      );
    });

    expect(ref.current).toBe(container.querySelector("#phone-preview"));
    expect(ref.current?.getAttribute("aria-label")).toBe("Phone preview");
  });
});

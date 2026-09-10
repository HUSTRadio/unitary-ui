// @vitest-environment jsdom

import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { FieldsetDefault37A8EEC1Example } from "../docs/geist/src/examples/fieldset/default-37a8eec1.example";
import { FieldsetErrorType96E58B0DExample } from "../docs/geist/src/examples/fieldset/error-type-96e58b0d.example";
import { FieldsetMultipleFieldsets9DD2DFF4Example } from "../docs/geist/src/examples/fieldset/multiple-fieldsets-9dd2dff4.example";
import { FieldsetWarningType82942353Example } from "../docs/geist/src/examples/fieldset/warning-type-82942353.example";
import { FieldsetWithErrorTextB52BED15Example } from "../docs/geist/src/examples/fieldset/with-error-text-b52bed15.example";
import { FieldsetWithLongContent39C2ED17Example } from "../docs/geist/src/examples/fieldset/with-long-content-39c2ed17.example";
import { FieldsetWithWarningText16633F67Example } from "../docs/geist/src/examples/fieldset/with-warning-text-16633f67.example";

const cases: Array<[string, ComponentType, string, string]> = [
  ["default", FieldsetDefault37A8EEC1Example, "Save Changes", "Changes saved"],
  ["error type", FieldsetErrorType96E58B0DExample, "Contact Support", "Support request opened"],
  ["multiple", FieldsetMultipleFieldsets9DD2DFF4Example, "Update", "Profile updated"],
  ["warning type", FieldsetWarningType82942353Example, "Remind Me Later", "Reminder scheduled"],
  ["error text", FieldsetWithErrorTextB52BED15Example, "Verify API Connection", "Connection verification requested"],
  ["long content", FieldsetWithLongContent39C2ED17Example, "Decline", "Privacy policy declined"],
  ["warning text", FieldsetWithWarningText16633F67Example, "Cancel", "Changes canceled"],
];

describe("Fieldset action examples", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test.each(cases)("%s reports a concrete action outcome", (_name, Example, buttonText, expected) => {
    act(() => root.render(<Example />));
    const button = Array.from(container.querySelectorAll("button")).find((node) => node.textContent === buttonText);
    expect(button).toBeTruthy();
    act(() => button!.click());
    expect(container.querySelector('[role="status"]')?.textContent).toBe(expected);
  });
});

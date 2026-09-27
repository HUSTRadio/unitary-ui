// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";

import { Avatar, AvatarGroup, AvatarWithIcon } from "@/components/ui/avatar";
import { Browser } from "@/components/ui/browser";
import { ClearableInput } from "@/components/ui/clearable-input";
import { CodeBlock } from "@/components/ui/code-block";
import { Combobox, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { I18nProvider } from "@/lib/i18n";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(localized: boolean) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const controls = (
    <>
      <Avatar placeholder />
      <Avatar username="unitary" />
      <AvatarGroup members={[{ username: "a" }, { username: "b" }]} limit={1} />
      <AvatarWithIcon icon={<span />} />
      <Browser address="https://example.com" />
      <ClearableInput cmdk />
      <Combobox defaultValue="one" clearable>
        <ComboboxList>
          <ComboboxOption value="one">One</ComboboxOption>
        </ComboboxList>
      </Combobox>
      <CodeBlock
        language="ts"
        switcher={{ options: ["ts"], value: "ts", onChange: () => {} }}
        v0="ask"
      >
        const value = 1;
      </CodeBlock>
    </>
  );
  act(() =>
    root.render(localized ? <I18nProvider locale="zh-CN">{controls}</I18nProvider> : controls),
  );
}

describe("framework control i18n", () => {
  test("keeps existing English labels without an I18nProvider", () => {
    mount(false);
    expect(container.querySelector('[aria-label="Placeholder Avatar"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Copy"]')).toBeTruthy();
    expect(container.querySelector<HTMLInputElement>('[placeholder="Search…"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Select language"]')).toBeTruthy();
  });

  test("localizes built-in labels while retaining consumer-provided content", () => {
    mount(true);
    expect(container.querySelector('[aria-label="占位头像"]')).toBeTruthy();
    expect(container.querySelector('[alt="用户 unitary 的头像"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="带图标的头像"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="复制"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="按 Cmd + K 打开命令菜单"]')).toBeTruthy();
    expect(container.querySelector<HTMLInputElement>('[placeholder="搜索…"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="清除已选值"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="选择语言"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="将行锚点添加到 URL"]')).toBeTruthy();
    expect(container.textContent).toContain("询问");
  });
});

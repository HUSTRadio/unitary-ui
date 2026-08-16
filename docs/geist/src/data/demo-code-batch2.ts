/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— Batch 2。
 *
 * 结构：DEMO_CODE_BATCH2[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - 官方 @vercel/geistcn/components → @/components/ui/<slug>。
 * - 需要状态时保留 useState / 组件函数包装；纯展示区块直接给 JSX 用法。
 */

export const DEMO_CODE_BATCH2: Record<string, Record<string, string>> = {
  "code-block": {
    default: `import { CodeBlock } from "@/components/ui/code-block";

const code = \`// Usage:
//   enabled by \\\`--debug-prerender\\\`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

<CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
  {code}
</CodeBlock>`,
    "no-filename": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

<CodeBlock aria-label="Hello world" language="jsx">
  {code}
</CodeBlock>`,
    "highlighted-lines": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

<CodeBlock
  aria-label="Hello world"
  filename="highlighted.jsx"
  language="jsx"
  highlightedLinesNumbers={[1, 4]}
>
  {code}
</CodeBlock>`,
    "added-removed-lines": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}\`;

<CodeBlock
  aria-label="Hello world"
  filename="next.config.js"
  language="jsx"
  addedLinesNumbers={[5]}
  removedLinesNumbers={[2, 3, 4]}
>
  {code}
</CodeBlock>`,
    "referenced-lines": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}\`;

<CodeBlock aria-label="Hello world" language="jsx" referencedLinesNumbers={[4]}>
  {code}
</CodeBlock>`,
    "language-switcher": `import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

export function Component() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      switcher={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}`,
    "language-switcher-with-tabs": `import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

export function Component() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      tabs={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}`,
    "hidden-line-numbers": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

<CodeBlock
  aria-label="Hello world"
  filename="hidden-line-numbers.jsx"
  language="jsx"
  hideLineNumbers
>
  {code}
</CodeBlock>`,
    "open-in-v0": `import { CodeBlock } from "@/components/ui/code-block";

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

<div className="flex flex-col gap-4">
  <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">
    {code}
  </CodeBlock>
  <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">
    {code}
  </CodeBlock>
</div>`,
  },
  collapse: {
    default: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<Collapse className="border-b">
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question A</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </CollapseContent>
</Collapse>
<Collapse className="border-b">
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question B</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
      nulla pariatur.
    </p>
  </CollapseContent>
</Collapse>`,
    expanded: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<Collapse className="border-b">
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question A</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </CollapseContent>
</Collapse>
<Collapse className="border-b" defaultOpen disabled>
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question B</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
      nulla pariatur.
    </p>
  </CollapseContent>
</Collapse>`,
    multiple: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<Collapse className="border-b">
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question A</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </CollapseContent>
</Collapse>
<Collapse className="border-b">
  <h3 className="text-[24px] font-semibold text-foreground">
    <CollapseTrigger>Question B</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
      nulla pariatur.
    </p>
  </CollapseContent>
</Collapse>`,
    small: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<Collapse size="small" className="border-t border-b">
  <h3 className="text-[16px] font-medium text-foreground">
    <CollapseTrigger>Question A</CollapseTrigger>
  </h3>
  <CollapseContent>
    <p className="mb-4 text-copy-16 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </CollapseContent>
</Collapse>`,
  },
  "command-menu": {
    default: `import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem callback={() => {}}>Figma Import</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Commands">
            <CommandMenuItem callback={() => {}}>Import Extension</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Manage Extensions</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Collaboration">
            <CommandMenuItem callback={() => {}}>Flags Explorer</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}`,
    "with-divider": `import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuItem callback={() => {}}>Item 1</CommandMenuItem>
          <CommandMenuItem callback={() => {}}>Item 2</CommandMenuItem>
          <CommandMenuDivider />
          <CommandMenuItem callback={() => {}}>Item 3</CommandMenuItem>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}}>Grouped Item 1</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Grouped Item 2</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}`,
    "with-suffix": `import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}} suffix={<span>USA</span>}>
              United States of America
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>ESP</span>}>
              Spain
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>FRA</span>}>
              France
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Group 2">
            <CommandMenuItem callback={() => {}} suffix={<span>AUT</span>}>
              Austria
            </CommandMenuItem>
            <CommandMenuItem
              callback={() => {}}
              suffix={<CircleCheck className="size-4 text-gray-700" />}
            >
              Switzerland
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>GER</span>}>
              Germany
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}`,
  },
  "context-card": {
    default: `import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

const card = (
  <ContextCard>
    <ContextCardHeader>
      <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
      <div>
        <ContextCardTitle>Acme Inc.</ContextCardTitle>
        <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
      </div>
    </ContextCardHeader>
    <ContextCardBody>
      <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
      <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
    </ContextCardBody>
    <ContextCardFooter>
      <Button type="secondary" typeName="button" size="small">
        View Project
      </Button>
    </ContextCardFooter>
  </ContextCard>
);

<>
  {(["Top", "Bottom", "Left", "Right"] as const).map((label) => (
    <ContextCardTrigger
      key={label}
      content={card}
      side={label.toLowerCase() as "top" | "bottom" | "left" | "right"}
    >
      <span>{label}</span>
    </ContextCardTrigger>
  ))}
</>`,
    alignment: `import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

const card = (
  <ContextCard>
    <ContextCardHeader>
      <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
      <div>
        <ContextCardTitle>Acme Inc.</ContextCardTitle>
        <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
      </div>
    </ContextCardHeader>
    <ContextCardBody>
      <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
      <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
    </ContextCardBody>
    <ContextCardFooter>
      <Button type="secondary" typeName="button" size="small">
        View Project
      </Button>
    </ContextCardFooter>
  </ContextCard>
);

<>
  {(["Start", "Center", "End"] as const).map((label) => (
    <ContextCardTrigger
      key={label}
      content={card}
      align={label.toLowerCase() as "start" | "center" | "end"}
      render={
        <Button type="default" typeName="button">
          {label}
        </Button>
      }
    />
  ))}
</>`,
    "render-prop": `import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

const card = (
  <ContextCard>
    <ContextCardHeader>
      <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
      <div>
        <ContextCardTitle>Acme Inc.</ContextCardTitle>
        <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
      </div>
    </ContextCardHeader>
    <ContextCardBody>
      <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
      <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
    </ContextCardBody>
    <ContextCardFooter>
      <Button type="secondary" typeName="button" size="small">
        View Project
      </Button>
    </ContextCardFooter>
  </ContextCard>
);

<>
  <ContextCardTrigger
    content={card}
    render={<Button type="default" typeName="button">Default wrapper</Button>}
  />
  <ContextCardTrigger
    content={card}
    render={
      <a href="#render-prop" className="text-blue-700 underline underline-offset-2">
        Rendered as a link
      </a>
    }
  />
</>`,
  },
  "context-menu": {
    default: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem>Item one</ContextMenuItem>
    <ContextMenuItem>Item Two</ContextMenuItem>
    <ContextMenuItem>Item Three</ContextMenuItem>
    <ContextMenuItem>Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    "disabled-items": `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem>Item one</ContextMenuItem>
    <ContextMenuItem disabled>Item Two</ContextMenuItem>
    <ContextMenuItem disabled>Item Three</ContextMenuItem>
    <ContextMenuItem>Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    "link-items": `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem href="/">Item one</ContextMenuItem>
    <ContextMenuItem href="/">Item Two</ContextMenuItem>
    <ContextMenuItem href="/">Item Three</ContextMenuItem>
    <ContextMenuItem href="/">Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    "prefix-and-suffix": `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Triangle } from "lucide-react";

const icon = <Triangle className="size-4" aria-hidden />;

<div className="flex flex-col items-stretch justify-start gap-6 md:flex-row">
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <span>
        <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
          Right click here
        </div>
      </span>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-[160px]">
      <ContextMenuItem href="/" prefix={icon}>Item one</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Two</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Three</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Four</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <span>
        <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
          Right click here
        </div>
      </span>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-[160px]">
      <ContextMenuItem href="/" suffix={icon}>Item one</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Two</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Three</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Four</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</div>`,
  },
};

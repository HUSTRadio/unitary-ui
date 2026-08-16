/**
 * 最后一批组件的独立源码映射（tabs / toast / pill / step-point / table）。
 */
export const DEMO_CODE_FINAL: Record<string, Record<string, string>> = {
  tabs: {
    Default: `import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

const [tab, setTab] = useState("overview");

<div className="w-full max-w-xl">
  <Tabs
    tabs={[
      { value: "overview", title: "Overview" },
      { value: "usage", title: "Usage" },
      { value: "api", title: "API" },
    ]}
    selected={tab}
    setSelected={setTab}
    ariaLabel="Component documentation"
  />
</div>`,
    Disabled: `import { Tabs } from "@/components/ui/tabs";

<Tabs
  disabled
  selected="apple"
  setSelected={() => {}}
  tabs={[
    { title: "Apple", value: "apple" },
    { title: "Orange", value: "orange" },
    { title: "Mango", value: "mango" },
  ]}
  ariaLabel="Disabled tabs"
/>`,
    "Disable specific tabs": `import { Tabs } from "@/components/ui/tabs";

<Tabs
  selected="apple"
  setSelected={() => {}}
  tabs={[
    { title: "Apple", value: "apple" },
    { title: "Orange", value: "orange" },
    { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
  ]}
  ariaLabel="Tabs with disabled tab"
/>`,
    "With icons": `import { Tabs } from "@/components/ui/tabs";
import { LayoutGrid } from "lucide-react";

<Tabs
  selected="github"
  setSelected={() => {}}
  tabs={[
    { title: "GitHub", value: "github", icon: <LayoutGrid className="size-4" aria-hidden /> },
    { title: "GitLab", value: "gitlab" },
    { title: "Bitbucket", value: "bitbucket" },
  ]}
  ariaLabel="Tabs with icons"
/>`,
    Secondary: `import { Tabs } from "@/components/ui/tabs";

<Tabs
  variant="secondary"
  selected="github"
  setSelected={() => {}}
  tabs={[
    { title: "GitHub", value: "github" },
    { title: "GitLab", value: "gitlab" },
    { title: "Bitbucket", value: "bitbucket", disabled: true },
  ]}
  ariaLabel="Secondary tabs"
/>`,
  },
  toast: {
    Default: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    "Multi-line": `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence." })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    "With jsx": `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: (
          <>
            <span className="text-heading-14">The Evil Rabbit</span> jumped over the fence.
          </>
        ),
        preserve: true,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    "With a link": `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: (
          <>
            The Evil Rabbit jumped over the{" "}
            <a href="#/components" className="font-medium text-foreground underline underline-offset-4">
              fence again
            </a>
            .
          </>
        ),
        preserve: true,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    Preserve: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true })}
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    Action: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", action: "Undo" })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    Undo: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", onUndoAction: () => undefined })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>`,
    Success: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button typeName="button" onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}>
    Show Toast
  </Button>
  <Toasts />
</>`,
    Warning: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button typeName="button" onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}>
    Show Toast
  </Button>
  <Toasts />
</>`,
    Error: `import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button typeName="button" onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}>
    Show Toast
  </Button>
  <Toasts />
</>`,
  },
  pill: {
    Default: `import { Pill } from "@/components/ui/pill";
import { useState } from "react";

const [active, setActive] = useState("all");

<div className="flex flex-wrap gap-2">
  {(["all", "ready", "error"] as const).map((value) => (
    <Pill
      key={value}
      variant={active === value ? "active" : "default"}
      aria-pressed={active === value}
      onClick={() => setActive(value)}
    >
      {value}
    </Pill>
  ))}
</div>`,
  },
  "step-point": {
    Default: `import { StepPoint } from "@/components/ui/step-point";

<ul className="w-full max-w-xs">
  <StepPoint status="done">Submitted</StepPoint>
  <StepPoint status="active">Under review</StepPoint>
  <StepPoint status="idle">Approved</StepPoint>
</ul>`,
  },
};

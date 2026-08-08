# Split Button

A button that offers a primary interaction coupled with a dropdown menu offering additional actions.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Save" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:0px 6px 6px 0px
> - **Menu Alignment**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Save" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px 0px 0px 6px
>   .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:0px 6px 6px 0px
> - **Icon**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Copy page" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:0px 6px 6px 0px
> - **Title with Icon**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Save" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:0px 6px 6px 0px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Save" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:0px 6px 6px 0px
> - **Menu Alignment**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Save" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px 0px 0px 6px
>   .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:0px 6px 6px 0px
> - **Icon**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Copy page" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:0px 6px 6px 0px
> - **Title with Icon**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Save" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px 0px 0px 6px
>   .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:0px 6px 6px 0px

<!-- GEIST-RENDER-METRICS-END -->

## Default

The button's primary action should be the first item in the dropdown menu.

```tsx
import type { ButtonProps } from "@vercel/geistcn/components";
import { SplitButton, SplitButtonMenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

const SIZES: ButtonProps["size"][] = ["small", "medium", "large"];
const TYPES: Extract<ButtonProps["variant"], "default" | "secondary">[] = ["default", "secondary"];

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-between gap-8 flex-initial">
      {TYPES.map((variant) => {
        return (
          <div
            key={variant}
            className="flex flex-row items-stretch justify-start gap-4 flex-initial"
          >
            {SIZES.map((size) => {
              return (
                <SplitButton
                  buttonProps={{
                    onClick: () => {
                      alert("Clicked Saved");
                    },
                    size,
                    variant,
                  }}
                  key={`${variant}`}
                  menuButtonLabel="Select save method"
                  menuItems={
                    <>
                      <SplitButtonMenuItem
                        description="Save changes"
                        menuItemProps={{
                          onClick: () => {
                            alert("Clicked Save");
                          },
                        }}
                        title="Save"
                      />
                      <SplitButtonMenuItem
                        description="Save changes and create a new production deployment"
                        menuItemProps={{
                          onClick: () => {
                            alert("Clicked Save + Redeploy");
                          },
                        }}
                        title="Save + Redeploy"
                      />
                    </>
                  }
                  menuProps={{ width: 264 }}
                >
                  Save
                </SplitButton>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

## Menu Alignment

```tsx
import { SplitButton, SplitButtonMenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-start justify-start gap-8 flex-initial">
      <SplitButton
        buttonProps={{
          onClick: () => {
            alert("Clicked Saved");
          },
        }}
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem
              description="Save changes"
              menuItemProps={{
                onClick: () => {
                  alert("Clicked Save");
                },
              }}
              title="Save"
            />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              menuItemProps={{
                onClick: () => {
                  alert("Clicked Save + Redeploy");
                },
              }}
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save
      </SplitButton>

      <SplitButton
        buttonProps={{
          onClick: () => {
            alert("Clicked Saved");
          },
        }}
        menuAlignment="bottom-end"
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem
              description="Save changes"
              menuItemProps={{
                onClick: () => {
                  alert("Clicked Save");
                },
              }}
              title="Save"
            />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              menuItemProps={{
                onClick: () => {
                  alert("Clicked Save + Redeploy");
                },
              }}
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save
      </SplitButton>
    </div>
  );
}
```

## Icon

```tsx
import { SplitButton, SplitButtonMenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { LogoIconOpenAiSvg, LogoVZeroSvg } from "@vercel/geistcn-assets/logos";

export function Component(): JSX.Element {
  return (
    <SplitButton
      buttonProps={{
        onClick: () => {
          console.log("Copy page");
        },
        size: "small",
        variant: "secondary",
      }}
      menuButtonLabel="Copy page"
      menuItems={[
        <SplitButtonMenuItem
          key="v0"
          description="Open this page in v0"
          menuItemProps={{
            onClick: () => {
              console.log("v0");
            },
            className: "w-[200px]",
          }}
          title="Open in v0"
          icon={<LogoVZeroSvg className="w-4 h-4" />}
        />,
        <SplitButtonMenuItem
          key="chatgpt"
          description="Open this page in ChatGPT"
          menuItemProps={{
            onClick: () => {
              console.log("ChatGPT");
            },
            className: "w-[200px]",
          }}
          title="Open in ChatGPT"
          icon={<LogoIconOpenAiSvg className="w-4 h-4" />}
        />,
      ]}
      menuProps={{ width: 240 }}
    >
      Copy page
    </SplitButton>
  );
}
```

## Title with Icon

```tsx
import type { ButtonProps } from "@vercel/geistcn/components";
import { SplitButton, SplitButtonMenuItem } from "@vercel/geistcn/components";
import { IconArrowCircleUp, IconFloppyDisk } from "@vercel/geistcn-assets/icons";
import type { JSX } from "react";

const SIZES: ButtonProps["size"][] = ["small", "medium", "large"];
const VARIANTS: Extract<ButtonProps["variant"], "default" | "secondary">[] = [
  "default",
  "secondary",
];

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col justify-between gap-8">
      {VARIANTS.map((variant) => {
        return (
          <div className="flex flex-row gap-1" key={variant}>
            {SIZES.map((size) => {
              return (
                <SplitButton
                  buttonProps={{
                    onClick: () => {
                      alert("Clicked Saved");
                    },
                    size,
                    variant,
                  }}
                  key={`${variant}`}
                  menuButtonLabel="Select save method"
                  menuItems={
                    <>
                      <SplitButtonMenuItem
                        description="Save changes"
                        menuItemProps={{
                          onClick: () => {
                            alert("Clicked Save");
                          },
                        }}
                        title={
                          <span className="flex gap-2 items-center">
                            <IconFloppyDisk /> Save
                          </span>
                        }
                      />
                      <SplitButtonMenuItem
                        description="Save changes and create a new production deployment"
                        menuItemProps={{
                          onClick: () => {
                            alert("Clicked Save + Redeploy");
                          },
                        }}
                        title={
                          <span className="flex gap-2 items-center">
                            <IconArrowCircleUp /> Save + Redeploy
                          </span>
                        }
                      />
                    </>
                  }
                  menuProps={{ width: 264 }}
                >
                  Save
                </SplitButton>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

## Best Practices

- Use a Split Button when one action is the clear default and 1–4 close variants belong next to it, like Deploy paired with Deploy to Preview. For unrelated actions, use a Menu instead.

- Mirror the primary action as the first item in the dropdown so keyboard users and screen readers get the same options. The visible button label and the first item must match exactly.

- Restrict the primary type to default or secondary. The API blocks the destructive variants on purpose, since hiding a delete inside a dropdown is a sharp edge.

- Title Case every menu item label and follow Verb + Noun: Deploy to Production, Promote to Production, Rollback Deployment. Group destructive items at the bottom with a divider.

- Set menuButtonLabel to a screen-reader sentence that names the action set, like More deploy options. It becomes the aria-label on the dropdown trigger and is the only label a screen reader hears for that button.

- Default menuAlignment="bottom-start" aligns the menu under the primary button; switch to bottom-end only when the button sits flush with the right edge of its container.

Was this helpful?

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { setTokens, resetTokens, useTokens, type TokenTarget } from "@/lib/tokens";

const names = ["--primary", "--primary-foreground", "--radius", "--uni-duration-fast"] as const;

export function TokensExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [scope, setScope] = useState("local");
  const [target, setTarget] = useState<TokenTarget | null>(null);
  const options = { target: scope === "global" ? undefined : target };
  const values = useTokens(names, options);
  return (
    <div data-token-editor className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label={zh ? "作用范围" : "Scope"}
          value={scope}
          onValueChange={setScope}
          layout={{ width: 180 }}
        >
          <SelectItem value="local">{zh ? "仅演示区域" : "Demo only"}</SelectItem>
          <SelectItem value="global">{zh ? "整个页面" : "Entire page"}</SelectItem>
        </Select>
        <Button
          typeName="button"
          onClick={() =>
            setTokens({ "--primary": "#0070f3", "--primary-foreground": "#ffffff" }, options)
          }
        >
          {zh ? "蓝色" : "Blue"}
        </Button>
        <Button
          typeName="button"
          onClick={() =>
            setTokens({ "--primary": "#0b7a53", "--primary-foreground": "#ffffff" }, options)
          }
        >
          {zh ? "绿色" : "Green"}
        </Button>
        <Button typeName="button" type="secondary" onClick={() => resetTokens(names, options)}>
          {zh ? "恢复当前主题" : "Reset to theme"}
        </Button>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Select
          label={zh ? "圆角" : "Radius"}
          value={["0px", "8px", "16px"].includes(values["--radius"]) ? values["--radius"] : ""}
          placeholder={zh ? "选择圆角" : "Choose radius"}
          onValueChange={(value) => setTokens({ "--radius": value }, options)}
          layout={{ width: 180 }}
        >
          {["0px", "8px", "16px"].map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
        <Select
          label={zh ? "反馈动画时长" : "Feedback duration"}
          value={
            ["100ms", "250ms", "500ms"].includes(values["--uni-duration-fast"])
              ? values["--uni-duration-fast"]
              : ""
          }
          placeholder={zh ? "选择时长" : "Choose duration"}
          onValueChange={(value) => setTokens({ "--uni-duration-fast": value }, options)}
          layout={{ width: 180 }}
        >
          {["100ms", "250ms", "500ms"].map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div
        ref={setTarget}
        data-token-preview
        className="rounded-md border border-border bg-background p-5 text-foreground"
      >
        <p className="mb-3 text-copy-14">
          {zh
            ? "悬停或聚焦按钮，观察颜色、圆角和动画。"
            : "Hover or focus the button to inspect its color, radius and animation."}
        </p>
        <Button
          typeName="button"
          className="rounded-md transition-transform duration-(--uni-duration-fast) hover:scale-105"
        >
          {zh ? "预览按钮" : "Preview button"}
        </Button>
      </div>
      <dl data-token-values className="grid min-w-0 gap-2 text-copy-13-mono">
        {names.map((name) => (
          <div
            key={name}
            className="flex flex-wrap justify-between gap-x-4 rounded-md bg-surface px-3 py-2"
          >
            <dt className="break-all">{name}</dt>
            <dd className="break-all" data-token-value={name}>
              {values[name] || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

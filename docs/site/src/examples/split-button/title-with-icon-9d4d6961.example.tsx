import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { CircleArrowUp, Save } from "lucide-react";

export function SplitButtonTitleWithIcon9D4D6961Example() {
  return (
    <div className="flex w-full flex-col gap-8">
      {(["default", "secondary"] as const).map((variant) => (
        <div key={variant} className="flex flex-row gap-1">
          {(["small", "medium", "large"] as const).map((size) => (
            <SplitButton
              key={`${variant}-${size}`}
              buttonProps={{ size, type: variant }}
              menuButtonLabel="Select save method"
              menuItems={
                <>
                  {/* 图标必须走官方 icon prop（MenuItem prefix 槽）：嵌进 title 会让
                      description 顶到图标正下方、不随图标缩进，两行排版错位。 */}
                  <SplitButtonMenuItem
                    description="Save changes"
                    icon={<Save className="size-4" aria-hidden />}
                    title="Save"
                  />
                  <SplitButtonMenuItem
                    description="Save changes and create a new production deployment"
                    icon={<CircleArrowUp className="size-4" aria-hidden />}
                    title="Save + Redeploy"
                  />
                </>
              }
              menuProps={{ width: 264 }}
            >
              Save
            </SplitButton>
          ))}
        </div>
      ))}
    </div>
  );
}

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
                  <SplitButtonMenuItem
                    description="Save changes"
                    title={
                      <span className="flex items-center gap-2">
                        <Save className="size-4" aria-hidden /> Save
                      </span>
                    }
                  />
                  <SplitButtonMenuItem
                    description="Save changes and create a new production deployment"
                    title={
                      <span className="flex items-center gap-2">
                        <CircleArrowUp className="size-4" aria-hidden /> Save + Redeploy
                      </span>
                    }
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

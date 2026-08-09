import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface LabelProps extends Omit<
  React.ComponentProps<typeof LabelPrimitive.Root>,
  "children" | "htmlFor" | "id"
> {
  /** 关联输入控件的 id。 */
  id: string;
  /** 标签文本。 */
  value: string;
  withInput?: boolean;
  bypassCasing?: boolean;
}

function Label({ className, id, value, withInput, bypassCasing, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-with-input={withInput || undefined}
      htmlFor={id}
      className={cn(
        "mb-2 block max-w-full cursor-text text-label-13 text-foreground",
        !bypassCasing && "capitalize",
        className,
      )}
      {...props}
    >
      {value}
    </LabelPrimitive.Root>
  );
}

export { Label };

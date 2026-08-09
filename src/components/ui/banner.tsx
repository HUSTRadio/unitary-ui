import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Banner — 顶部横幅，通告重要信息。
 * flex 两端对齐：左侧内容（BannerContent）+ 右侧关闭按钮（BannerClose）。
 */
function Banner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner"
      className={cn(
        "flex items-center justify-between gap-4 border-b border-gray-alpha-400 bg-background px-6 py-3",
        className,
      )}
      {...props}
    />
  );
}

function BannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-content"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function BannerClose({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Close banner"
      className={cn("shrink-0", className)}
      {...props}
    >
      <X aria-hidden />
    </Button>
  );
}

export { Banner, BannerContent, BannerClose };

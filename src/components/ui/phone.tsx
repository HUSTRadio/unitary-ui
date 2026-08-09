import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Phone — 手机壳容器（对应官方 Phone，docs/geist-markdown-refs/components/phone.md）。
 * 壳：w-[320px] + 32px 圆角 + 8px 粗边框（border-foreground）+ bg-background + overflow-hidden + mx-auto。
 * screen：p-4 + min-h-[568px]。
 * 官方最佳实践：chrome 装饰性（aria-hidden），含义在内部截图/视频上；锁定内容宽高比。
 */
function Phone({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto w-[320px] overflow-hidden rounded-[32px] border-[8px] border-foreground bg-background",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PhoneScreen({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-h-[568px] p-4", className)} {...props} />;
}

export { Phone, PhoneScreen };

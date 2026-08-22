import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Phone — 手机壳容器（对应官方 Phone，docs/geist-markdown-refs/components/phone.md）。
 * 修复（2026-08 实测）：固定 w-[320px] 在窄容器（375px 视口 demo 容器 261px）内右缘被裁切
 * （margin 0 -59px）→ 改为 w-full max-w-[320px]，随容器收缩。
 * 壳：max-w-[320px] + 32px 圆角 + 8px 粗边框（官方为黑色 bezel、不随主题，本地改用 border-black）
 * + bg-background + overflow-hidden + mx-auto。
 * screen：p-4 + min-h-[568px]。
 * 官方最佳实践：chrome 装饰性（aria-hidden）——但本组件包裹的是实时内容（非截图），
 * 对 root 加 aria-hidden 会连带隐藏内容，故省略；含义内容应自带可访问名称。
 */
export type PhoneProps = React.ComponentProps<"div">;

function Phone({ className, children, ...props }: PhoneProps) {
  return (
    <div
      data-slot="phone"
      className={cn(
        "mx-auto w-full max-w-[320px] overflow-hidden rounded-[32px] border-[8px] border-black bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type PhoneScreenProps = React.ComponentProps<"div">;

function PhoneScreen({ className, ...props }: PhoneScreenProps) {
  return <div data-slot="phone-screen" className={cn("min-h-[568px] p-4", className)} {...props} />;
}

export { Phone, PhoneScreen };

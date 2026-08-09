import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Browser — 浏览器窗口模拟器（对应官方 Browser，docs/geist-markdown-refs/components/browser.md）。
 * 容器：flex flex-col + 12px 圆角 + 发丝线边框 + bg-background + overflow-hidden。
 * 由 BrowserHeader（红黄绿三圆点 + 地址栏）/ BrowserAddressBar / BrowserContent 组合。
 * 官方最佳实践：chrome 是装饰性框架（aria-hidden），含义在内部截图/视频上；不加可聚焦的往返按钮。
 */
function Browser({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[12px] border border-gray-alpha-400 bg-background",
        className,
      )}
    >
      {children}
    </div>
  );
}

function BrowserHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-gray-alpha-400 px-4 py-2.5",
        className,
      )}
    >
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      {children}
    </div>
  );
}

function BrowserAddressBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex-1 rounded-md bg-gray-alpha-200 px-3 py-1 text-label-12 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function BrowserContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />;
}

export { Browser, BrowserHeader, BrowserAddressBar, BrowserContent };

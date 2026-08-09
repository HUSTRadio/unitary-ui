import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * SearchInput — Geist 官方 SearchInput（docs/geist-markdown-refs/components/search-input.md 实测）。
 * 左侧放大镜图标（lucide Search），复用 Input 的尺寸 / 边框 / focus 规范。
 * 图标：absolute left-3，输入区 pl-9 避让。
 */

const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input ref={ref} className="pl-9" {...props} />
    </div>
  ),
);
SearchInput.displayName = "SearchInput";

export { SearchInput };

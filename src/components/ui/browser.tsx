import * as React from "react";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrowserProps extends React.ComponentProps<"div"> {
  address?: string;
}

function Browser({ address, className, children, ...props }: BrowserProps) {
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard?.writeText(address);
  };

  return (
    <div
      data-slot="browser"
      className={cn(
        "material-small overflow-hidden rounded-md bg-background-200 md:rounded-[1.5cqw]",
        className,
      )}
      {...props}
    >
      <div
        data-slot="browser-chrome"
        className="flex justify-between gap-4 bg-background-100 px-4 py-2 md:gap-6 md:px-5 md:py-2.5"
      >
        <div className="flex min-w-0 flex-none items-center justify-start gap-4 md:max-w-[140px] md:flex-1">
          <span className="flex items-center gap-4" aria-hidden>
            <svg viewBox="0 0 16 16" className="size-3.5 fill-[#ff5f57]">
              <circle cx="8" cy="8" r="7" />
            </svg>
            <svg viewBox="0 0 16 16" className="size-3.5 fill-[#febc2e]">
              <circle cx="8" cy="8" r="7" />
            </svg>
            <svg viewBox="0 0 16 16" className="size-3.5 fill-[#28c840]">
              <circle cx="8" cy="8" r="7" />
            </svg>
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
          {address ? (
            <div className="flex w-full items-center justify-between rounded-full border border-gray-400 bg-background-200 py-1 pr-1 pl-4 lg:max-w-xs">
              <span className="min-w-0 flex-1 truncate text-center text-copy-13 text-gray-1000">
                {address}
              </span>
              <button
                type="button"
                aria-label="Copy"
                onClick={() => void copyAddress()}
                className="flex size-6 shrink-0 items-center justify-center rounded-full outline-none hover:bg-gray-alpha-200 focus-ring"
              >
                <Copy aria-hidden className="size-3" />
              </button>
            </div>
          ) : null}
        </div>
        <div aria-hidden className="hidden min-w-0 flex-1 md:block md:max-w-[140px]" />
      </div>
      <div data-slot="browser-content">{children}</div>
    </div>
  );
}

export { Browser };

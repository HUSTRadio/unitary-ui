import * as React from "react";
import { ArrowLeft, ArrowRight, Check, Copy, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface BrowserProps extends React.ComponentProps<"div"> {
  address?: string;
}

function Browser({ address, className, children, ...props }: BrowserProps) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard?.writeText(address);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
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
          <span aria-hidden className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span aria-hidden className="hidden items-center gap-4 md:flex">
            <ArrowLeft className="size-3.5 text-gray-900" />
            <ArrowRight className="size-3.5 text-gray-900" />
            <RefreshCw className="size-3.5 text-gray-900" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
          {address ? (
            <div className="relative flex w-full items-center rounded-full border border-gray-400 bg-background-200 py-1 px-7 lg:max-w-xs">
              <span className="min-w-0 flex-1 truncate text-center text-copy-13 text-gray-1000">
                {address}
              </span>
              <button
                type="button"
                aria-label={copied ? t("Copied") : t("Copy")}
                onClick={() => void copyAddress()}
                className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 shrink-0 items-center justify-center rounded-full outline-none hover:bg-gray-alpha-200"
              >
                {copied ? (
                  <Check aria-hidden className="size-3" />
                ) : (
                  <Copy aria-hidden className="size-3" />
                )}
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

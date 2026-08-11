import * as React from "react";
import { ChevronDown } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

type CodeBlockSwitcher = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

interface CodeBlockProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  children: string;
  filename?: string;
  language?: string;
  highlightedLinesNumbers?: number[];
  addedLinesNumbers?: number[];
  removedLinesNumbers?: number[];
  referencedLinesNumbers?: number[];
  hideLineNumbers?: boolean;
  switcher?: CodeBlockSwitcher;
  tabs?: CodeBlockSwitcher;
  v0?: "ask" | "build";
}

function CodeBlockSwitcher({ config }: { config: CodeBlockSwitcher }) {
  return (
    <div className="relative flex h-6 items-center rounded-[6px] bg-gray-alpha-200 px-2 text-label-13">
      <span>{config.value}</span>
      <ChevronDown className="ml-1 size-3" aria-hidden />
      <select
        aria-label="Select language"
        value={config.value}
        onChange={(event) => config.onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {config.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CodeBlockTabs({ config }: { config: CodeBlockSwitcher }) {
  return (
    <div
      role="tablist"
      className="flex h-9 items-center gap-1 overflow-x-auto border-b border-gray-alpha-400 px-3"
    >
      {config.options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={option === config.value}
          onClick={() => config.onChange(option)}
          className="h-6 shrink-0 rounded-[6px] px-2 text-label-13 aria-selected:bg-gray-alpha-200"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      className,
      filename,
      language,
      children: code,
      highlightedLinesNumbers = [],
      addedLinesNumbers = [],
      removedLinesNumbers = [],
      referencedLinesNumbers = [],
      hideLineNumbers = false,
      switcher,
      tabs,
      v0,
      ...props
    },
    ref,
  ) => {
    const blockId = React.useId().replaceAll(":", "");
    const lines = code.replace(/\n$/, "").split("\n");
    const hasHeader = Boolean(filename || switcher);
    const v0Href = `https://v0.app/chat?q=${encodeURIComponent(code)}`;

    return (
      <div
        ref={ref}
        data-slot="code-block"
        data-language={language}
        className={cn(
          "group relative overflow-hidden rounded-[6px] border border-gray-alpha-400 bg-background-100",
          className,
        )}
        {...props}
      >
        {tabs ? <CodeBlockTabs config={tabs} /> : null}
        {hasHeader ? (
          <CodeBlockHeader>
            <span className="truncate text-label-13 text-muted-foreground">{filename}</span>
            <span className="flex shrink-0 items-center gap-2">
              {switcher ? <CodeBlockSwitcher config={switcher} /> : null}
              <CopyButton
                textToCopy={code}
                label="Copy to clipboard"
                className="size-8 rounded-[5px] bg-transparent shadow-none hover:bg-gray-alpha-200"
              />
            </span>
          </CodeBlockHeader>
        ) : (
          <CopyButton
            textToCopy={code}
            label="Copy to clipboard"
            className="absolute top-4 right-4 z-10 size-8 rounded-[5px] bg-background-200 opacity-0 shadow-none group-hover:opacity-100 focus:opacity-100"
          />
        )}
        <CodeBlockContent>
          <code className={cn("prism-code block", language && `language-${language}`)}>
            {lines.map((line, index) => {
              const number = index + 1;
              const referenced = referencedLinesNumbers.includes(number);
              return (
                <div
                  key={number}
                  id={`${blockId}-L${number}`}
                  data-code-line={number}
                  data-geist-code-block-line="true"
                  data-highlighted={highlightedLinesNumbers.includes(number)}
                  data-added={addedLinesNumbers.includes(number)}
                  data-removed={removedLinesNumbers.includes(number)}
                  data-referenced={referenced}
                  className="flex min-w-max data-[highlighted=true]:bg-[var(--code-highlight)] data-[added=true]:bg-[var(--code-added)] data-[removed=true]:bg-[var(--code-removed)] data-[referenced=true]:bg-[var(--code-referenced)]"
                >
                  {!hideLineNumbers ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Add line anchor to the URL"
                      className="w-9 shrink-0 select-none pr-3 text-right text-gray-700"
                    >
                      {number}
                    </button>
                  ) : null}
                  <span className="token-line min-w-max pr-5 whitespace-pre">
                    {addedLinesNumbers.includes(number)
                      ? "+"
                      : removedLinesNumbers.includes(number)
                        ? "-"
                        : null}
                    {line || " "}
                  </span>
                </div>
              );
            })}
          </code>
        </CodeBlockContent>
        {v0 ? (
          <div className="flex h-12 items-center justify-end border-t border-gray-alpha-400 px-3">
            <a href={v0Href} target="_blank" rel="noreferrer" className="text-label-13 text-link">
              {v0 === "ask" ? "Ask v0" : "Open in v0"}
            </a>
          </div>
        ) : null}
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

const CodeBlockHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="code-block-header"
      className={cn(
        "flex h-12 items-center justify-between border-b border-gray-alpha-400 bg-background-200 px-3",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockHeader.displayName = "CodeBlockHeader";

const CodeBlockContent = React.forwardRef<HTMLPreElement, React.ComponentPropsWithoutRef<"pre">>(
  ({ className, ...props }, ref) => (
    <pre
      ref={ref}
      data-slot="code-block-content"
      className={cn(
        "overflow-x-auto py-5 font-mono text-copy-13 leading-5 text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockContent.displayName = "CodeBlockContent";

export { CodeBlock, CodeBlockHeader, CodeBlockContent };
export type { CodeBlockProps, CodeBlockSwitcher };

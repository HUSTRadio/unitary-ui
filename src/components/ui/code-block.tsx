import * as React from "react";
import { ChevronDown } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { highlightLines } from "@/lib/highlight";
import { LanguageIcon } from "@/lib/language-icons";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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

type CodeBlockHeaderProps = React.ComponentPropsWithoutRef<"div">;
type CodeBlockContentProps = React.ComponentPropsWithoutRef<"pre">;

function CodeBlockSwitcher({ config }: { config: CodeBlockSwitcher }) {
  const { t } = useI18n();
  return (
    <MenuContainer position="bottom-end">
      <MenuButton
        variant="unstyled"
        data-slot="code-block-switcher"
        aria-label={t("Select language")}
        className="flex h-8 items-center gap-1 rounded-[5px] bg-background-200 px-2 font-sans text-[13px] leading-none whitespace-nowrap text-muted-foreground transition-colors duration-(--ds-duration-fast) hover:bg-gray-alpha-200 focus-ring"
      >
        <span translate="no">{config.value}</span>
        <ChevronDown className="size-3" aria-hidden />
      </MenuButton>
      <Menu stateful className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
        {config.options.map((option) => (
          <MenuItem
            key={option}
            active={option === config.value}
            onSelect={() => config.onChange(option)}
            translate="no"
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </MenuContainer>
  );
}

function CodeBlockTabs({ config }: { config: CodeBlockSwitcher }) {
  return (
    <div
      data-slot="code-block-tabs"
      className="flex items-center justify-between overflow-auto border-b-0 bg-background-200 pb-0 pl-4 pt-3"
    >
      <div
        role="tablist"
        className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-auto pb-px"
      >
        {config.options.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={option === config.value}
            onClick={() => config.onChange(option)}
            className="-mb-px flex h-6 shrink-0 cursor-pointer items-center rounded-md bg-gray-alpha-200 px-1.5 text-[13px] text-gray-1000 outline-none aria-selected:bg-gray-1000 aria-selected:text-background-100"
          >
            {option}
          </button>
        ))}
      </div>
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
    const { t } = useI18n();
    const blockId = React.useId().replaceAll(":", "");
    const highlightedLines = highlightLines(code.replace(/\n$/, ""), language);
    const hasHeader = Boolean(filename || switcher);
    const v0Href = `https://v0.app/chat?q=${encodeURIComponent(code)}`;

    return (
      <div
        ref={ref}
        data-slot="code-block"
        data-language={language}
        className={cn(
          "group relative overflow-hidden rounded-[6px] border border-gray-400",
          className,
        )}
        {...props}
      >
        {tabs ? <CodeBlockTabs config={tabs} /> : null}
        {hasHeader ? (
          <CodeBlockHeader>
            <div className="m-0 flex min-w-0 items-center gap-2 text-[13px] leading-[19.5px] text-muted-foreground">
              <div aria-hidden className="flex w-4 shrink-0 items-center">
                <LanguageIcon language={language} />
              </div>
              <span
                data-slot="code-block-filename"
                className="inline-block min-w-0 max-w-full truncate break-normal"
              >
                {filename}
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-2">
              {switcher ? <CodeBlockSwitcher config={switcher} /> : null}
              <CopyButton
                textToCopy={code}
                label={t("Copy to clipboard")}
                className="size-8 rounded-[5px] bg-transparent shadow-none hover:bg-gray-alpha-200"
              />
            </span>
          </CodeBlockHeader>
        ) : (
          <CopyButton
            textToCopy={code}
            label={t("Copy to clipboard")}
            className="absolute top-4 right-4 z-10 size-8 rounded-[5px] bg-background-200 opacity-0 shadow-none group-hover:opacity-100 focus:opacity-100"
          />
        )}
        <CodeBlockContent>
          <code
            className={cn(
              "prism-code block font-mono text-[13px] leading-[20px]",
              language && `language-${language}`,
            )}
          >
            {highlightedLines.map((tokens, index) => {
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
                  className="flex min-w-max px-5 data-[highlighted=true]:bg-[var(--code-highlight)] data-[added=true]:bg-[var(--code-added)] data-[removed=true]:bg-[var(--code-removed)] data-[referenced=true]:bg-[var(--code-referenced)]"
                >
                  {!hideLineNumbers ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={t("Add line anchor to the URL")}
                      className="w-9 shrink-0 select-none pr-5 text-right text-gray-600"
                    >
                      {number}
                    </button>
                  ) : null}
                  <div className="token-line min-w-max whitespace-pre">
                    {addedLinesNumbers.includes(number)
                      ? "+"
                      : removedLinesNumbers.includes(number)
                        ? "-"
                        : null}
                    {tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={`token ${token.type}`}>
                        {token.content}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </code>
        </CodeBlockContent>
        {v0 ? (
          <div
            data-slot="code-block-v0-footer"
            className="flex h-12 items-center justify-end border-t border-gray-400 bg-background-200 p-3"
          >
            <a
              href={v0Href}
              target="_blank"
              rel="noreferrer"
              role="link"
              data-slot="code-block-v0-link"
              className="relative flex h-8 max-w-full items-center justify-center rounded-md bg-background-100 px-1.5 text-sm leading-[21px] font-medium text-gray-1000 no-underline shadow-[0_0_0_1px_var(--color-gray-400)] transition-[border-color,background,color,transform,box-shadow] duration-(--ds-duration-fast) ease-in-out hover:bg-gray-100 active:bg-gray-alpha-300"
            >
              <span className="inline-block truncate px-1.5">
                <span aria-hidden className="flex items-center gap-x-1">
                  {v0 === "ask" ? t("Ask") : t("Open in")}
                  <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-3">
                    <g>
                      <path
                        d="M9.5 3.5 13 7l-3.5 3.5M13 7H3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </span>
                <span className="sr-only">{v0 === "ask" ? t("Ask v0") : t("Open in v0")}</span>
              </span>
            </a>
          </div>
        ) : null}
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="code-block-header"
      className={cn(
        "flex h-12 items-center justify-between rounded-t-md border-b border-gray-400 bg-background-200 py-0 pr-3 pl-4",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockHeader.displayName = "CodeBlockHeader";

const CodeBlockContent = React.forwardRef<HTMLPreElement, CodeBlockContentProps>(
  ({ className, ...props }, ref) => (
    <pre
      ref={ref}
      data-slot="code-block-content"
      className={cn("overflow-auto bg-background py-5", className)}
      {...props}
    />
  ),
);
CodeBlockContent.displayName = "CodeBlockContent";

export { CodeBlock, CodeBlockHeader, CodeBlockContent };
export type { CodeBlockProps, CodeBlockSwitcher, CodeBlockHeaderProps, CodeBlockContentProps };

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { CodeBlock as CodeBlockComponent } from "@/components/ui/code-block";
import { useLanguage } from "../i18n/language";
import { demoText } from "../i18n/components-demo";

export function DemoShowCode({ code }: { code: string }) {
  const { language } = useLanguage();
  const [showCode, setShowCode] = React.useState(false);
  const codeId = React.useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={showCode}
        aria-controls={codeId}
        onClick={() => setShowCode((v) => !v)}
        className={`flex h-12 w-full items-center gap-3 border-t border-gray-400 bg-background-200 px-4 text-left text-copy-14 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none${showCode ? "" : " rounded-b-lg"}`}
      >
        <ChevronRight
          className={`size-4 transition-transform${showCode ? " rotate-90" : ""}`}
          aria-hidden
        />
        {demoText(language, "Show code")}
      </button>
      {showCode ? (
        <div id={codeId} className="overflow-hidden">
          <CodeBlockComponent
            language="tsx"
            className="rounded-none rounded-b-lg border-0 border-t border-gray-alpha-400"
          >
            {code}
          </CodeBlockComponent>
        </div>
      ) : null}
    </>
  );
}

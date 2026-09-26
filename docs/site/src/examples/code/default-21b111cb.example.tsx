import { Code, InlineCode } from "@/components/ui/code";

export function CodeDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p className="text-copy-14 text-muted-foreground">
        Install with <InlineCode>npm i geist</InlineCode> and import the component.
      </p>
      <Code syntax="javascript">{`console.log("Hello")`}</Code>
    </div>
  );
}

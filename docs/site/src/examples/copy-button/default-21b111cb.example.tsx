import { CopyButton } from "@/components/ui/copy-button";

export function CopyButtonDefault21B111CBExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton textToCopy="lipsum" />
      <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
    </div>
  );
}

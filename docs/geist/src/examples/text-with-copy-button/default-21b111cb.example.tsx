import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

export function TextWithCopyButtonDefault21B111CBExample() {
  return (
    <TextWithCopyButton
      ellipsis
      successMessage="Copied to clipboard"
      textLabel="Copy"
      textToCopy="lipsum"
    />
  );
}

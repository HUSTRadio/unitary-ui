import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

export function TextWithCopyButtonWithSmallAndTertiary230FE3B9Example() {
  return (
    <TextWithCopyButton
      ellipsis
      successMessage="Copied hashed digest to clipboard"
      textLabel="Copy config digest"
      textToCopy="edgeConfigData.digest"
    />
  );
}

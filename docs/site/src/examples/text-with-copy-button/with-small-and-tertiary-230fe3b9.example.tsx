import { TextWithCopyButton } from "@hustradio/unitary-ui";

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

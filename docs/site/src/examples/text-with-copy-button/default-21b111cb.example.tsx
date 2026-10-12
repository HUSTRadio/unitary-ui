import { TextWithCopyButton } from "@hustradio/unitary-ui";

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

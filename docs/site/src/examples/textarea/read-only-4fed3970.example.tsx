import { Textarea } from "@hustradio/unitary-ui";

export function TextareaReadOnly4FED3970Example() {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Textarea
      aria-label="Read only"
      defaultValue={loremIpsum}
      readOnly
    />
  );
}

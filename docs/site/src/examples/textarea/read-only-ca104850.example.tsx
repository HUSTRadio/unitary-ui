import { Textarea } from "@/components/ui/textarea";

export function TextareaReadOnlyCA104850Example() {
  const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="flex w-full max-w-md flex-col">
      <Textarea
        aria-label="Read only"
        defaultValue={LOREM_IPSUM}
        readOnly
        />
    </div>
  );
}

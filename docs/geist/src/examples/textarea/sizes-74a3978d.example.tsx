import { Textarea } from "@/components/ui/textarea";

export function TextareaSizes74A3978DExample() {
  const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Textarea
        aria-label="Textarea"
        defaultValue={LOREM_IPSUM}
        size="small"
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={LOREM_IPSUM}
        size="medium"
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={LOREM_IPSUM}
        size="large"
      />
    </div>
  );
}

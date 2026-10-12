import { Textarea } from "@hustradio/unitary-ui";

export function TextareaError54A0E8C1Example() {
  const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Textarea
        aria-label="With error (small)"
        defaultValue={LOREM_IPSUM}
        error="There has been an error."
        size="small"
      />
      <Textarea
        aria-label="With error (medium)"
        defaultValue={LOREM_IPSUM}
        error="There has been an error."
        size="medium"
      />
      <Textarea
        aria-label="With error (large)"
        defaultValue={LOREM_IPSUM}
        error="There has been an error."
        size="large"
      />
    </div>
  );
}

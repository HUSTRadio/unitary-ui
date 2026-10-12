import { Textarea } from "@hustradio/unitary-ui";

export function TextareaRows101F2FF3Example() {
  return (
    <div className="flex w-full max-w-md flex-col">
      <Textarea
        aria-label="Textarea with fixed rows"
        placeholder="Textarea with fixed number of rows"
        rows={5}
      />
    </div>
  );
}

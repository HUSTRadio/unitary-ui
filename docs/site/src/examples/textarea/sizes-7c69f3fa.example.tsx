import { Textarea } from "@/components/ui/textarea";

export function TextareaSizes7C69F3FAExample() {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="flex flex-col gap-6">
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="small"
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="medium"
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="large"
      />
    </div>
  );
}

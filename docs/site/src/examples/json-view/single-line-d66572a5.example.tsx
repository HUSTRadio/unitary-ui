import { JsonView } from "@/components/ui/json-view";

export function JsonViewSingleLineD66572A5Example() {
  const data = {
    foo: "bar",
  };

  return (
    <JsonView data={data} defaultExpandDepth={1} />
  );
}

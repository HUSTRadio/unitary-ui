import { JsonView } from "@hustradio/unitary-ui";

export function JsonViewCollapsedB322B652Example() {
  const data = {
    trace: {
      spanId: "span_7Qk9b4",
      parentId: "span_root",
      service: "api",
    },
    request: {
      id: "req_00042",
      path: "/api/projects",
      method: "GET",
    },
    flags: ["enable-logs-json-rendering", "observability-panel"],
  };

  return (
    <JsonView data={data} defaultExpandDepth={0} />
  );
}

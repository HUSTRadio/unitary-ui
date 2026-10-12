import { JsonView, makeJsonViewHighlightPattern } from "@hustradio/unitary-ui";

export function JsonViewHighlightedF00CEE7CExample() {
  const data = {
    level: "error",
    requestId: "req_00042",
    deploymentId: "dpl_9WjH8QFQySx7",
    message: "Deployment request failed",
    statusCode: 500,
  };

  const highlightPattern = makeJsonViewHighlightPattern(["request", "failed"]);

  return (
    <JsonView data={data} defaultExpandDepth={1} highlightPattern={highlightPattern} />
  );
}

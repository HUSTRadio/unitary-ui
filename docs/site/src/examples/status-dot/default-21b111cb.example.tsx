import { StatusDot } from "@hustradio/unitary-ui";

export function StatusDotDefault21B111CBExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <StatusDot state="QUEUED" />
      <StatusDot state="BUILDING" />
      <StatusDot state="ERROR" />
      <StatusDot state="READY" />
      <StatusDot state="CANCELED" />
    </div>
  );
}

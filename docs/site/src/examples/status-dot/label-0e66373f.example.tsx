import { StatusDot } from "@hustradio/unitary-ui";

export function StatusDotLabel0E66373FExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <StatusDot label state="QUEUED" />
      <StatusDot label state="BUILDING" />
      <StatusDot label state="ERROR" />
      <StatusDot label state="READY" />
      <StatusDot label state="CANCELED" />
    </div>
  );
}

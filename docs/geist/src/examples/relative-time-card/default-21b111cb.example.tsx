import { RelativeTimeCard } from "@/components/ui/relative-time-card";

export function RelativeTimeCardDefault21B111CBExample() {
  return (
    <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />
  );
}

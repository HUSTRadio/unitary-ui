import { Progress } from "@hustradio/unitary-ui";

export function ProgressWithStops45480676Example() {
  return (
    <Progress
      value={30}
      type="success"
      aria-label="Progress with stops"
      stops={[
        { value: 10, tooltip: "10%", ariaLabel: "Build complete" },
        { value: 20, tooltip: "20%", ariaLabel: "Lint complete" },
        { value: 30, tooltip: "30%", ariaLabel: "Unit tests complete" },
        { value: 40, tooltip: "40%", ariaLabel: "Integration tests complete" },
        { value: 50, tooltip: "50%", ariaLabel: "Deploy ready" },
      ]}
    />
  );
}

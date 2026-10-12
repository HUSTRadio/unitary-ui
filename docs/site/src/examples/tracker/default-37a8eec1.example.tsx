import { Tracker } from "@hustradio/unitary-ui";

function createRandomData(days: number) {
  const colors = ["emerald", "amber", "rose"] as const;
  return Array.from({ length: days }, (_, index) => ({
    color: colors[index % 7 === 6 ? (index % 11 === 6 ? 1 : 0) : index % 13 === 5 ? 2 : 0],
    tooltip: `Day ${index + 1}`,
  }));
}

export function TrackerDefault37A8EEC1Example() {
  return <Tracker data={createRandomData(29)} />;
}

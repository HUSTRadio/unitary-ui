import { Calendar } from "@hustradio/unitary-ui";

export function CalendarCompactB6B54201Example() {
  return (
    <Calendar
      label="Select Date Range"
      compact
      comboboxLabel="Combobox Menu"
      presets={{
        "last-7-days": { text: "Last 7 Days", start: new Date(2026, 7, 14), end: new Date(2026, 7, 21) },
      }}
    />
  );
}

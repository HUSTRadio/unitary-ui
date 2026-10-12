import { Calendar } from "@hustradio/unitary-ui";

export function CalendarStacked62739DB4Example() {
  return (
    <Calendar
      label="Select Date Range"
      stacked
      comboboxLabel="Combobox Menu"
      comboboxPlaceholder="Select Period"
      presets={{
        "last-7-days": { text: "Last 7 Days", start: new Date(2026, 7, 14), end: new Date(2026, 7, 21) },
      }}
    />
  );
}

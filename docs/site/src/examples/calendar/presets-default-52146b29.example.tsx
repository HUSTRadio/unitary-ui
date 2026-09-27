import { Calendar } from "@/components/ui/calendar";

export function CalendarPresetsDefault52146B29Example() {
  return (
    <Calendar
      label="Select Date Range"
      showCombobox
      comboboxFirst
      comboboxFull
      comboboxWide
      comboboxLabel="Combobox Menu"
      comboboxPlaceholder="Select Period"
      presets={{
        "last-7-days": { text: "Last 7 Days", start: new Date(2026, 7, 14), end: new Date(2026, 7, 21) },
      }}
      presetIndex={0}
    />
  );
}

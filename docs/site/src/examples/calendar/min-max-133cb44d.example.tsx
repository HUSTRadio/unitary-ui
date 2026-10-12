import { Calendar } from "@hustradio/unitary-ui";

export function CalendarMinMax133CB44DExample() {
  const now = new Date();

  const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

  return (
    <Calendar label="Select Date Range" minValue={minDate} maxValue={maxDate} />
  );
}

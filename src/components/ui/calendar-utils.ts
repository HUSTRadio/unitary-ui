/**
 * Calendar 纯日期工具（2026-09-15 从 calendar.tsx 拆出）。
 */

/** 当月 42 格日期（从当月 1 号所在周的 weekStart 开始，覆盖 6 周）。 */
export function monthGrid(viewYear: number, viewMonth: number, weekStart: number): Date[] {
  const first = new Date(viewYear, viewMonth, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() - weekStart + 7) % 7));
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

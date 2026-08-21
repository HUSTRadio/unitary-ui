export interface RangeColorScheme {
  selectedBg: string;
  selectedFg: string;
  softBg: string;
  softFg: string;
}

/**
 * Calendar range colors deliberately use semantic CSS variables.  The values
 * resolve differently in the two themes, while consumers can override every
 * role through Calendar's `colorScheme` prop.
 */
export const defaultRangeColorScheme: RangeColorScheme = {
  selectedBg: "var(--info)",
  selectedFg: "var(--info-foreground)",
  softBg: "var(--info-soft)",
  softFg: "var(--gray-1000)",
};

export function resolveRangeColors(scheme?: Partial<RangeColorScheme>): RangeColorScheme {
  return { ...defaultRangeColorScheme, ...scheme };
}

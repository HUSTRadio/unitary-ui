export const LAYOUT_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1100, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
] as const;
export const LAYOUT_THEMES = ["light", "dark"] as const;

type LayoutCombo = {
  route: string;
  viewport: { width: number; height: number };
  theme: string;
};

/** Count identities, not just rows: duplicates must never stand in for a missing viewport/theme. */
export function layoutCoverage(routes: readonly string[], evidence: readonly LayoutCombo[]) {
  const key = ({ route, viewport, theme }: LayoutCombo) =>
    JSON.stringify([route, viewport.width, viewport.height, theme]);
  const expected = routes.flatMap((route) =>
    LAYOUT_VIEWPORTS.flatMap((viewport) =>
      LAYOUT_THEMES.map((theme) => key({ route, viewport, theme })),
    ),
  );
  const expectedSet = new Set(expected);
  const observed = new Map<string, number>();
  for (const entry of evidence) {
    const id = key(entry);
    observed.set(id, (observed.get(id) ?? 0) + 1);
  }
  const missing = expected.filter((id) => !observed.has(id));
  const unexpected = [...observed.keys()].filter((id) => !expectedSet.has(id));
  const duplicates = [...observed].filter(([, count]) => count > 1).map(([id]) => id);
  return {
    expectedCombos: expected.length,
    observedCombos: evidence.length,
    uniqueCombos: observed.size,
    missing,
    unexpected,
    duplicates,
    complete: !missing.length && !unexpected.length && !duplicates.length,
  };
}

/** Select from the canonical registry; invalid or empty filters must never produce a green no-op. */
export function selectLayoutRoutes<T extends { to: string }>(
  routes: readonly T[],
  raw?: string,
): T[] {
  if (raw === undefined) return [...routes];
  const selected: unknown = JSON.parse(raw);
  if (
    !Array.isArray(selected) ||
    !selected.length ||
    selected.some((route) => typeof route !== "string")
  ) {
    throw new Error("UNITARY_VERIFY_ROUTES must be a non-empty JSON array of canonical routes");
  }
  const known = new Set(routes.map((route) => route.to));
  for (const route of selected)
    if (!known.has(route)) throw new Error(`Unknown verification route: ${route}`);
  const wanted = new Set(selected);
  return routes.filter((route) => wanted.has(route.to));
}

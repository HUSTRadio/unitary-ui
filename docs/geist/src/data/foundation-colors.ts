export interface FoundationColor {
  step: number;
  token: `--color-${string}`;
}

export interface FoundationColorScale {
  label: string;
  usage: string;
  steps: readonly FoundationColor[];
}

const numberedSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

function scale(
  label: string,
  usage: string,
  tokenPrefix: string,
  steps: readonly number[] = numberedSteps,
): FoundationColorScale {
  return {
    label,
    usage,
    steps: steps.map((step) => ({
      step,
      token: `--color-${tokenPrefix}-${step}`,
    })),
  };
}

export const FOUNDATION_COLOR_SCALES: readonly FoundationColorScale[] = [
  scale("Backgrounds", "Page and component surfaces.", "background", [100, 200]),
  scale("Gray", "Neutral UI, text, and icons.", "gray"),
  scale("Gray alpha", "Translucent borders, dividers, and overlays.", "gray-alpha"),
  scale("Blue", "Informational and primary emphasis.", "blue"),
  scale("Red", "Destructive and error states.", "red"),
  scale("Amber", "Warning states.", "amber"),
  scale("Green", "Success states.", "green"),
  scale("Teal", "Supporting semantic emphasis.", "teal"),
  scale("Purple", "Supporting semantic emphasis.", "purple"),
  scale("Pink", "Supporting semantic emphasis.", "pink"),
];

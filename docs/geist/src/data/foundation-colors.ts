export interface FoundationColor {
  step: number;
  token: `--color-${string}`;
}

export interface FoundationColorScale {
  label: string;
  usage: string;
  steps: readonly FoundationColor[];
}

export interface FoundationColorRolePartition {
  range: string;
  label: string;
  usage: string;
  steps: readonly FoundationColor[];
}

export interface SemanticColorToken {
  token: `--${string}`;
  label: string;
  usage: string;
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

const graySteps = scale("Gray", "Neutral UI, text, and icons.", "gray").steps;

export const FOUNDATION_COLOR_ROLE_PARTITIONS: readonly FoundationColorRolePartition[] = [
  {
    range: "1–3",
    label: "Component backgrounds",
    usage: "Use for component fills and layered interaction states.",
    steps: graySteps.slice(0, 3),
  },
  {
    range: "4–6",
    label: "Borders",
    usage: "Use for structural borders and separators.",
    steps: graySteps.slice(3, 6),
  },
  {
    range: "7–8",
    label: "High contrast backgrounds",
    usage: "Use for high-emphasis component backgrounds.",
    steps: graySteps.slice(6, 8),
  },
  {
    range: "9–10",
    label: "Text and icons",
    usage: "Use for accessible text and icon contrast.",
    steps: graySteps.slice(8, 10),
  },
];

export const SEMANTIC_COLOR_TOKENS: readonly SemanticColorToken[] = [
  { token: "--background", label: "Canvas", usage: "Primary page and component surface." },
  { token: "--foreground", label: "Content", usage: "Primary text and icon color." },
  { token: "--muted-foreground", label: "Muted content", usage: "Supporting text and icons." },
  { token: "--border", label: "Border", usage: "Structural borders and separators." },
  { token: "--ring", label: "Focus ring", usage: "Visible keyboard focus indication." },
  { token: "--primary", label: "Primary action", usage: "Primary interactive emphasis." },
  { token: "--destructive", label: "Destructive", usage: "Destructive actions and error states." },
  { token: "--success", label: "Success", usage: "Successful outcomes and confirmations." },
  { token: "--warning", label: "Warning", usage: "Warnings that need attention." },
];

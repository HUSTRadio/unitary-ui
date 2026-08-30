const SCREENSHOT_PATH_PATTERNS = [
  /^src\//,
  /^public\/fonts\//,
  /^(?:index\.html|package\.json|pnpm-lock\.yaml)$/,
  /^(?:vite|tailwind|postcss)\.config\.[cm]?[jt]s$/,
  /^images\/styleguide\//,
  /^scripts\/capture-readme-screenshots\.mjs$/,
  /^scripts\/lib\/readme-screenshots\.mjs$/,
  /^README(?:\.en)?\.md$/,
];

const VISUAL_TYPES = new Set(["feat", "fix", "style", "refactor"]);
const VISUAL_SCOPES = new Set(["ui", "component", "components", "theme", "styleguide"]);

export function parseAngularCommit(message) {
  const firstLine = String(message).split(/\r?\n/, 1)[0];
  const match = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<bang>!)?:\s+.+$/.exec(firstLine);
  if (!match?.groups) return null;
  return {
    type: match.groups.type,
    scope: match.groups.scope ?? "",
    breaking: Boolean(match.groups.bang) || /(?:^|\n)BREAKING CHANGE:\s+/m.test(String(message)),
  };
}

export function classifyScreenshotImpact({ changedPaths, commits }) {
  const pathMatch = changedPaths.some((file) =>
    SCREENSHOT_PATH_PATTERNS.some((pattern) => pattern.test(file.replaceAll("\\", "/"))),
  );
  const commitMatch = commits.some((message) => {
    const parsed = parseAngularCommit(message);
    if (!parsed) return false;
    return VISUAL_TYPES.has(parsed.type) && VISUAL_SCOPES.has(parsed.scope);
  });
  return { required: pathMatch, pathMatch, commitMatch };
}

export const SCREENSHOT_IMPACT_PATTERNS = SCREENSHOT_PATH_PATTERNS;

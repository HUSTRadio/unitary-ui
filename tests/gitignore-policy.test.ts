import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../", import.meta.url));

function ignored(paths: string[]): string[] {
  return execFileSync("git", ["check-ignore", "--no-index", "--stdin"], {
    cwd: root,
    input: paths.join("\n") + "\n",
    encoding: "utf8",
  }).trim().split(/\r?\n/);
}

describe("repository publication boundaries", () => {
  it("ignores environment secrets, local captures and tool artifacts", () => {
    const paths = [
      ".env", ".env.production", "docs/.env.development",
      ".agents/runner.env.local", ".workbuddy/session.json", ".wt/task/file.ts",
      ".tmp-logo/preview.svg", ".aws/credentials", ".ssh/id_ed25519",
      ".cache/data.json", "docs/.vite/deps.json", ".pnpm-store/package.json",
      "tsconfig.app.tsbuildinfo", "debug.tmp", "file.ts.swp", "file.ts~",
      "Thumbs.db", "Desktop.ini", "test-results/navigation.png",
      "docs/geist-markdown-refs/screenshots/avatar-light.png",
    ];
    expect(ignored(paths)).toEqual(paths);
  });

  it("keeps portable task definitions, fixtures and public documentation publishable", () => {
    const paths = [
      ".env.production", // Ensure check-ignore exits successfully for the mixed input.
      ".env.example", ".env.sample", ".env.template", "docs/.env.example",
      ".agents/tasks/docs-update/task.json", ".agents/runner.config.json",
      "docs/site/build/component-examples-plugin.ts", "docs/llm/index.json",
      "docs/llm/pages/en-US/components/avatar.md",
      "docs/geist-markdown-refs/components/avatar.md",
      "images/styleguide/components-light.png", "tests/e2e/docs-network-navigation.spec.ts",
      "docs/audits/prefetch-2026-10-03.md", "OFL-1.1.txt",
    ];
    expect(ignored(paths)).toEqual([".env.production"]);
  });
});

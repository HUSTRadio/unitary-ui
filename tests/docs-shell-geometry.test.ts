import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const app = readFileSync(resolve(process.cwd(), "docs/geist/src/App.tsx"), "utf8");
const shell = readFileSync(
  resolve(process.cwd(), "docs/geist/src/components/docs-shell.tsx"),
  "utf8",
);

describe("docs wide viewport shell geometry", () => {
  it("uses the official 48px content gutters on desktop while retaining compact mobile gutters", () => {
    expect(app).toContain('className="min-w-0 flex-1 px-6 py-10 lg:px-12"');
    expect(app).not.toContain("flex-1 px-8 py-10");
  });

  it("uses the official 272px desktop sidebar track", () => {
    expect(shell).toContain(
      'className="hidden w-[272px] shrink-0 border-r border-border lg:block"',
    );
    expect(shell).not.toContain("w-[260px]");
  });
});

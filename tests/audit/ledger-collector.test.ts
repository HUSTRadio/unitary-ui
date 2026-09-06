import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { auditDir, readJson } from "./fixtures/ledger-fixture";

describe("Geist audit evidence collector (Task 3: demo / state recipe / ancestry / responsive fields)", () => {
  const collector = join(auditDir, "collect-replica-evidence.mjs");
  const legacyArgs = [
    "--dry-run",
    "--source",
    "official",
    "--slug",
    "drawer",
    "--variant",
    "default",
    "--state",
    "open",
    "--theme",
    "dark",
    "--viewport",
    "375x812",
    "--selector",
    "main",
    "--url",
    "https://vercel.com/geist/drawer",
    "--out",
    join(tmpdir(), "geist-audit-dry-run"),
  ];

  const runCollector = (extra: string[]) => {
    try {
      const output = execFileSync(process.execPath, [collector, ...extra], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      return {
        ok: true as const,
        config: JSON.parse(output),
        error: null as null | { stderr?: string; message: string },
      };
    } catch (error) {
      return {
        ok: false as const,
        config: null,
        error: error as { stderr?: string; message: string },
      };
    }
  };

  const failureText = (result: {
    ok: boolean;
    error: { stderr?: string; message: string } | null;
  }) => (result.ok ? "" : String(result.error?.stderr ?? result.error?.message));

  test("dry-run output carries demoId, stateRecipe, theme, viewport, rootSelector, ancestorDepth, roleSelectors and sourceTimestamp", { timeout: 20_000 }, () => {
    const result = runCollector([
      ...legacyArgs,
      "--demo-id",
      "custom-height",
      "--state-recipe",
      '["click:trigger","wait:open"]',
      "--root-selector",
      '[data-demo-id="custom-height"]',
      "--role-selector",
      '{"root":"[data-demo-id=\\"custom-height\\"]","content":"[data-demo-id=\\"custom-height\\"] [data-role=\\"content\\"]"}',
      "--ancestor-depth",
      "6",
    ]);
    const { ok, config } = result;
    expect(ok, `collector must exit 0: ${failureText(result)}`).toBe(true);
    expect(config.demoId).toBe("custom-height");
    expect(config.stateRecipe).toEqual(["click:trigger", "wait:open"]);
    expect(config.theme).toBe("dark");
    expect(config.viewport).toEqual({ width: 375, height: 812 });
    expect(config.rootSelector).toBe('[data-demo-id="custom-height"]');
    expect(config.ancestorDepth).toBe(6);
    expect(config.roleSelectors).toEqual({
      root: '[data-demo-id="custom-height"]',
      content: '[data-demo-id="custom-height"] [data-role="content"]',
    });
    expect(config).toHaveProperty("sourceTimestamp");
    // 既有 CLI 语义不变：cellKey 在 demo 维度上扩展，而不是替换
    expect(config.cellKey).toBe("official/drawer/default/open/dark/375x812/demo:custom-height");
    expect(config.outputPolicy).toBe("isolated-run-directory");
  });

  test("legacy invocation stays CLI-compatible and defaults the new fields", { timeout: 20_000 }, () => {
    const result = runCollector(legacyArgs);
    const { ok, config } = result;
    expect(ok, `collector must exit 0: ${failureText(result)}`).toBe(true);
    expect(config.source).toBe("official");
    expect(config.viewport).toEqual({ width: 375, height: 812 });
    expect(config.cellKey).toBe("official/drawer/default/open/dark/375x812");
    expect(config.outputPolicy).toBe("isolated-run-directory");
    expect(config.demoId).toBeNull();
    expect(config.stateRecipe).toBeNull();
    expect(config.rootSelector).toBe("main");
    expect(config.ancestorDepth).toBe(6);
    expect(config.roleSelectors).toBeNull();
    expect(config.sourceTimestamp).toBeNull();
  });

  test("demo-scoped cells refuse the main fallback", { timeout: 20_000 }, () => {
    // 未显式 --root-selector 时按 demoId 精确定位，不得回退到 main
    const auto = runCollector([...legacyArgs, "--demo-id", "custom-height"]);
    expect(auto.ok, `collector must exit 0: ${failureText(auto)}`).toBe(true);
    expect(auto.config.rootSelector).toBe('[data-demo-id="custom-height"]');
    expect(auto.config.rootSelector).not.toBe("main");

    // 显式把 demo cell 的 root 指向 main 必须被拒绝，防止 main 落成 acceptance evidence
    const rejected = runCollector([
      ...legacyArgs,
      "--demo-id",
      "custom-height",
      "--root-selector",
      "main",
    ]);
    expect(rejected.ok).toBe(false);
    expect(String(rejected.error?.stderr ?? rejected.error?.message)).toMatch(/main/);
  });

  test("state recipe and role selector JSON are validated", { timeout: 20_000 }, () => {
    const badJson = runCollector([...legacyArgs, "--demo-id", "x", "--state-recipe", "{nope"]);
    expect(badJson.ok).toBe(false);
    expect(String(badJson.error?.stderr ?? badJson.error?.message)).toMatch(/state-recipe/);

    const badVerb = runCollector([
      ...legacyArgs,
      "--demo-id",
      "x",
      "--state-recipe",
      '["fly:trigger"]',
    ]);
    expect(badVerb.ok).toBe(false);
    expect(String(badVerb.error?.stderr ?? badVerb.error?.message)).toMatch(/fly:trigger/);

    const badRole = runCollector([
      ...legacyArgs,
      "--demo-id",
      "x",
      "--role-selector",
      '{"root":42}',
    ]);
    expect(badRole.ok).toBe(false);

    const badDepth = runCollector([...legacyArgs, "--demo-id", "x", "--ancestor-depth", "0"]);
    expect(badDepth.ok).toBe(false);
  });

  test("evidence cell fixture locks the real-collection metrics contract", () => {
    const fixture = readJson("fixtures/evidence-cell.json");
    for (const field of [
      "demoId",
      "stateRecipe",
      "theme",
      "viewport",
      "rootSelector",
      "ancestorDepth",
      "roleSelectors",
      "sourceTimestamp",
      "observedTheme",
      "metrics",
      "status",
    ]) {
      expect(fixture, `cell fixture must carry "${field}"`).toHaveProperty(field);
    }
    expect(fixture.viewport).toEqual({ width: 375, height: 812 });
    expect(fixture.ancestorDepth).toBe(6);
    expect(fixture.sourceTimestamp).toBeTruthy();

    const metrics = fixture.metrics;
    expect(metrics.ancestors.length).toBeGreaterThan(0);
    for (const ancestor of metrics.ancestors) {
      expect(ancestor).toHaveProperty("rect");
      expect(ancestor).toHaveProperty("styles");
      expect(ancestor).toHaveProperty("layoutOwners");
    }
    expect(metrics.aria).toHaveProperty("role");
    expect(metrics.portal).toHaveProperty("isInPortal");
    expect(metrics.motion).toHaveProperty("transition");
    expect(metrics.motion).toHaveProperty("animation");
    expect(metrics.motion).toHaveProperty("reducedMotion");
    expect(metrics).toHaveProperty("themeMarker");
    expect(metrics).toHaveProperty("roles");
    expect(metrics.roles.root).toMatchObject({
      selector: fixture.roleSelectors.root,
      present: true,
    });
    expect(metrics.roles.content).toMatchObject({
      selector: fixture.roleSelectors.content,
      present: true,
    });

    // dry-run 规划输出字段必须全部存在于实采 cell 契约中（规划 ⊆ 契约）
    const result = runCollector([
      ...legacyArgs,
      "--demo-id",
      "custom-height",
      "--state-recipe",
      '["click:trigger","wait:open"]',
    ]);
    const { ok } = result;
    expect(ok, `collector must exit 0: ${failureText(result)}`).toBe(true);
    for (const field of [
      "demoId",
      "stateRecipe",
      "theme",
      "viewport",
      "rootSelector",
      "ancestorDepth",
      "roleSelectors",
      "sourceTimestamp",
    ]) {
      expect(
        fixture,
        `dry-run field "${field}" must be part of the real cell contract`,
      ).toHaveProperty(field);
    }
  });
});

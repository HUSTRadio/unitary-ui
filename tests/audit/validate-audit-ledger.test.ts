import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const auditDir = join(root, "tests/audit");
const allowedStatuses = new Set(["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"]);

const readJson = (name: string) => JSON.parse(readFileSync(join(auditDir, name), "utf8"));
const readReport = () => readFileSync(resolve(root, "docs/geist-replica-acceptance.md"), "utf8");
const COMPLETION_CLAIM_RE = /72\/72|576\/576/;

describe("Geist replica audit contract", () => {
  test("manifest declares exactly 72 unique official components", () => {
    const manifest = readJson("geist-audit-manifest.json");
    expect(manifest.schemaVersion).toBe(2);
    expect(manifest.components).toHaveLength(72);
    const slugs = manifest.components.map((component: { slug: string }) => component.slug);
    expect(new Set(slugs).size).toBe(72);

    for (const component of manifest.components) {
      expect(component.officialUrl).toMatch(/^https:\/\/vercel\.com\/geist\//);
      expect(component.variants.length).toBeGreaterThan(0);
      expect(component.states.length).toBeGreaterThan(0);
      expect(component.selectors.official).toBeTruthy();
      expect(component.selectors.local).toBeTruthy();
      expect(["applicable", "NOT_APPLICABLE", "pending"]).toContain(component.interaction);
      expect(component).not.toHaveProperty("approvedExclusions");
    }
  });

  test("ledger never permits an evidence-free PASS or reason-free BLOCKED", () => {
    const ledger = readJson("geist-audit-ledger.json");
    expect(ledger.schemaVersion).toBe(2);
    expect(ledger.results).toBeInstanceOf(Array);

    for (const result of ledger.results) {
      expect(allowedStatuses.has(result.status)).toBe(true);
      expect(result).toHaveProperty("evidenceStatus");
      expect(result).toHaveProperty("semanticAcceptanceStatus");
      if (result.evidenceStatus === "READY") {
        expect(result.status).toBe(result.semanticAcceptanceStatus);
        expect(result).toHaveProperty("diagnosticPixelStatus");
        expect(result).toHaveProperty("strictFailures");
        expect(result).toHaveProperty("approvedExclusions");
        expect(result.auditRunId).toBeTruthy();
        expect(result.contractDigest).toMatch(/^[a-f0-9]{64}$/);
      }
      if (result.evidenceStatus === "BLOCKED") {
        expect(result.semanticAcceptanceStatus).toBe("BLOCKED");
        expect(result.reason).toBeTruthy();
      }
      if (result.evidenceStatus === "MISSING" || result.evidenceStatus === "NOT_APPLICABLE") {
        expect(result.semanticAcceptanceStatus).toBeNull();
      }
    }
  });

  test("completion claims in the report require a populated, failure-free ledger", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const ledger = readJson("geist-audit-ledger.json");
    const report = readReport();

    const claimsCompletion = COMPLETION_CLAIM_RE.test(report);
    const evidenceComplete =
      manifest.status === "ACCEPTANCE_EVIDENCE_COMPLETE" &&
      Array.isArray(ledger.results) &&
      ledger.results.length > 0 &&
      ledger.results.every(
        (row: { status: string }) => !["FAIL", "MISSING", "BLOCKED"].includes(row.status),
      );

    // 双向门禁：报告出现 72/72 或 576/576 完成声明 ⟺ manifest/ledger 处于完整验收证据状态。
    // 不写成 if 条件，避免撤销报告后测试逃逸、失去持续约束。
    expect(
      claimsCompletion,
      "完成声明必须与 ACCEPTANCE_EVIDENCE_COMPLETE + 已填充无失败 ledger 同真同假",
    ).toBe(evidenceComplete);
  });

  test("collector validates a single isolated cell without opening a browser", () => {
    const output = execFileSync(
      process.execPath,
      [
        join(auditDir, "collect-replica-evidence.mjs"),
        "--dry-run",
        "--source",
        "official",
        "--slug",
        "button",
        "--variant",
        "default",
        "--state",
        "default",
        "--theme",
        "light",
        "--viewport",
        "375x812",
        "--selector",
        "main",
        "--url",
        "https://vercel.com/geist/button",
        "--out",
        join(tmpdir(), "geist-audit-dry-run"),
      ],
      { encoding: "utf8" },
    );
    const config = JSON.parse(output);
    expect(config.source).toBe("official");
    expect(config.viewport).toEqual({ width: 375, height: 812 });
    expect(config.cellKey).toBe("official/button/default/default/light/375x812");
    expect(config.outputPolicy).toBe("isolated-run-directory");
  });

  test("comparator emits decoded pixel diff, overlay and normalized geometry", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); im=Image.new('RGBA',(2,2),(0,0,0,255)); im.putpixel((1,1),(255,255,255,255)); im.save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({
        root: { x: 100, y: 40 },
        nodes: [{ path: "0", rect: { x: 110, y: 50, width: 20, height: 10 } }],
      }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({
        root: { x: 200, y: 80 },
        nodes: [{ path: "0", rect: { x: 211, y: 91, width: 20, height: 10 } }],
      }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
      "--official-image",
      official,
      "--local-image",
      local,
      "--official-metrics",
      officialMetrics,
      "--local-metrics",
      localMetrics,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.pixel.changed_pixels).toBe(1);
    expect(report.pixel.total_pixels).toBe(4);
    expect(report.geometry.max_geometry_delta_px).toBe(1);
    expect(report.geometry.nodes[0].official).toEqual({ x: 10, y: 10, width: 20, height: 10 });
    expect(readFileSync(join(out, "diff.png")).byteLength).toBeGreaterThan(0);
    expect(readFileSync(join(out, "overlay.png")).byteLength).toBeGreaterThan(0);
  }, 15_000);

  test("comparator records image dimension mismatches instead of aborting without artifacts", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-dimensions-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(3,2),(0,0,0,0)).save(sys.argv[1]); Image.new('RGBA',(2,2),(0,0,0,0)).save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({ root: { x: 0, y: 0, width: 3, height: 2 }, nodes: [] }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({ root: { x: 0, y: 0, width: 3, height: 2 }, nodes: [] }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
      "--official-image",
      official,
      "--local-image",
      local,
      "--official-metrics",
      officialMetrics,
      "--local-metrics",
      localMetrics,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(report.pixel.dimension_mismatch).toBe(true);
    expect(report.pixel.image_dimensions).toEqual({
      official: { width: 3, height: 2 },
      local: { width: 2, height: 2 },
      canvas: { width: 3, height: 2 },
    });
    expect(report.pixel.total_pixels).toBe(6);
    expect(report.pixel.changed_pixels).toBe(0);
    expect(readFileSync(join(out, "diff.png")).byteLength).toBeGreaterThan(0);
    expect(readFileSync(join(out, "overlay.png")).byteLength).toBeGreaterThan(0);
  }, 15_000);

  test("comparator keeps legacy output compatible while adding semantic-role fields", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-legacy-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); im=Image.new('RGBA',(2,2),(0,0,0,255)); im.putpixel((1,1),(255,255,255,255)); im.save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({
        root: { x: 100, y: 40 },
        nodes: [{ path: "0", rect: { x: 110, y: 50, width: 20, height: 10 } }],
      }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({
        root: { x: 200, y: 80 },
        nodes: [{ path: "0", rect: { x: 211, y: 91, width: 20, height: 10 } }],
      }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
      "--official-image",
      official,
      "--local-image",
      local,
      "--official-metrics",
      officialMetrics,
      "--local-metrics",
      localMetrics,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    // Task 4 输出契约：旧字段原样保留，新语义字段以 schemaVersion=2 共存。
    expect(report.schemaVersion).toBe(3);
    expect(report.pixelDiff).toEqual(report.pixel);
    expect(report.missingPaths).toEqual(report.geometry.missing_paths);
    expect(report.normalizedGeometry).toEqual(report.geometry);
    expect(report.roleComparisons).toEqual({ default: [] });
    expect(report.missingRoles).toEqual([]);
    expect(report.unexpectedRoles).toEqual([]);
    expect(report.responsiveDelta).toEqual([]);
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(report.approved_exclusions).toEqual([]);
    expect(report.artifacts).toEqual({ diff: "diff.png", overlay: "overlay.png" });
  }, 15_000);
});

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
      const output = execFileSync(process.execPath, [collector, ...extra], { encoding: "utf8" });
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

  test("dry-run output carries demoId, stateRecipe, theme, viewport, rootSelector, ancestorDepth, roleSelectors and sourceTimestamp", () => {
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

  test("legacy invocation stays CLI-compatible and defaults the new fields", () => {
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

  test("demo-scoped cells refuse the main fallback", () => {
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

  test("state recipe and role selector JSON are validated", () => {
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

describe("Geist audit manifest schema gate (Task 2: schema 基础门禁)", () => {
  const schemaPath = join(auditDir, "geist-audit-manifest.schema.json");
  const readSchema = () => JSON.parse(readFileSync(schemaPath, "utf8"));

  test("schema file exists, parses as JSON and is a draft-07 object schema", () => {
    const schema = readSchema();
    expect(schema.$schema).toBe("http://json-schema.org/draft-07/schema#");
    expect(schema.type).toBe("object");
    expect(schema.definitions.component).toBeTypeOf("object");
    expect(schema.required).toContain("components");
  });

  test("schema requires the capability matrix on live entries and blocks contracts on pending entries", () => {
    const componentSchema = readSchema().definitions.component;
    const inventoryBranch = componentSchema.allOf[0];

    expect(componentSchema.required).toContain("inventoryStatus");
    expect(inventoryBranch.if.properties.inventoryStatus.const).toBe("pending_live_enumeration");
    expect(inventoryBranch.then.properties.acceptanceContracts).toBe(false);
    for (const field of [
      "demos",
      "viewports",
      "themes",
      "interactionRecipes",
      "responsiveExpectations",
    ]) {
      expect(
        inventoryBranch.else.required,
        `live component schema must require "${field}"`,
      ).toContain(field);
    }

    expect(inventoryBranch.else.properties.selectors.$ref).toBe(
      "#/definitions/liveComponentSelectors",
    );
    expect(componentSchema.properties.demos.minItems).toBeGreaterThan(0);
    expect(componentSchema.properties.viewports.const).toEqual([
      "375x812",
      "768x1024",
      "1440x900",
      "1920x1080",
    ]);
    expect(componentSchema.properties.themes.const).toEqual(["light", "dark"]);
    expect(componentSchema.properties.interactionRecipes.minItems).toBeGreaterThan(0);
    expect(componentSchema.properties.responsiveExpectations.minItems).toBeGreaterThan(0);
  });

  test("Task 9 live components keep complete matrices; pending inventory cannot claim contracts", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const designGate = readJson("geist-design-gate.json");

    // Task 9 门禁：只有证据支撑的组件允许回填；清单见 docs/audits/geist-component-and-responsive-remediation-design.md §2。
    const BACKFILLED = new Set([
      "button",
      "calendar",
      "checkbox",
      "choicebox",
      "clearable-input",
      "code-block",
      "collapse",
      "combobox",
      "command-menu",
      "context-card",
      "context-menu",
      "description",
      "dots-menu",
      "drawer",
      "empty-state",
      "entity",
      "modal",
      "sheet",
    ]);

    // 已回填组件必须保留完整能力矩阵与具体 selector。
    const backfilled = manifest.components.filter((component: { slug: string }) =>
      BACKFILLED.has(component.slug),
    );
    expect(backfilled).toHaveLength(18);
    for (const component of backfilled as Array<{
      slug: string;
      states: string[];
      demos: Array<{ id: string }>;
      viewports: string[];
      themes: string[];
      selectors: { official: string; local: string };
      interactionRecipes: string[];
      responsiveExpectations: string[];
      interaction: string;
    }>) {
      const ids = component.demos.map((demo) => demo.id);
      expect(new Set(ids).size, `${component.slug} demo ids must be unique`).toBe(ids.length);
      expect(component.viewports).toEqual(["375x812", "768x1024", "1440x900", "1920x1080"]);
      expect(component.themes).toEqual(["light", "dark"]);
      expect(component.interactionRecipes.length).toBeGreaterThan(0);
      expect(component.responsiveExpectations.length).toBeGreaterThan(0);
      for (const [side, selector] of Object.entries(component.selectors)) {
        expect(selector, `${component.slug}.${side} selector must be specific`).not.toBe("main");
      }
      const gateEntry = designGate.components.find(
        (entry: { slug: string }) => entry.slug === component.slug,
      );
      expect(gateEntry, `${component.slug} must have a machine gate entry`).toBeDefined();
      if (gateEntry.dimensions.states === "BLOCKED") {
        expect(component.interaction, `${component.slug} blocked states cannot be applicable`).toBe(
          "pending",
        );
        expect(
          component.interactionRecipes.every((recipe) => recipe.startsWith("blocked:")),
          `${component.slug} blocked recipes must be explicitly marked`,
        ).toBe(true);
        expect(
          component.states.some((state) => state.endsWith("-blocked")),
          `${component.slug} blocked states must be visible in the manifest`,
        ).toBe(true);
      }
    }

    // 其余组件可作为 pending inventory 保留，但不得携带 acceptance contract 或伪装成正式证据。
    const skeletons = manifest.components.filter(
      (component: { slug: string }) => !BACKFILLED.has(component.slug),
    );
    expect(skeletons.length).toBe(54);
    for (const skeleton of skeletons) {
      expect(skeleton.inventoryStatus).toBe("pending_live_enumeration");
      expect(skeleton).not.toHaveProperty("acceptanceContracts");
    }
  });
});

describe("Geist audit comparator (Task 4: semantic roles / responsive deltas / field-level exemptions)", () => {
  const fixture = (name: string) =>
    JSON.parse(readFileSync(join(auditDir, "fixtures", name), "utf8"));

  const runComparator = (
    dir: string,
    officialMetrics: Record<string, unknown>,
    localMetrics: Record<string, unknown>,
  ) => {
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetricsPath = join(dir, "official.json");
    const localMetricsPath = join(dir, "local.json");
    const out = join(dir, "out");
    // 两张完全相同的纯黑图：像素差异必须为 0，viewport/角色差异只允许出现在语义字段里。
    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(officialMetricsPath, JSON.stringify(officialMetrics));
    writeFileSync(localMetricsPath, JSON.stringify(localMetrics));
    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
      "--official-image",
      official,
      "--local-image",
      local,
      "--official-metrics",
      officialMetricsPath,
      "--local-metrics",
      localMetricsPath,
      "--out",
      out,
    ]);
    return JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
  };

  test("aligns roles by semantic name and classifies missing / unexpected roles", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-roles-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );

    expect(report.schemaVersion).toBe(3);
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(Object.keys(report.roleComparisons).sort()).toEqual(["1440x900", "375x812"]);

    const byRole = Object.fromEntries(
      (report.roleComparisons["375x812"] as Array<{ role: string; classification: string }>).map(
        (row) => [row.role, row],
      ),
    );
    expect(Object.keys(byRole).sort()).toEqual([
      "content",
      "icon",
      "item",
      "portal",
      "root",
      "title",
      "trigger",
    ]);
    expect(byRole.item.classification).toBe("MISSING_ROLE");
    expect(byRole.portal.classification).toBe("UNEXPECTED_ROLE");

    // 缺失/多余角色按 viewport 报告（375x812 在 1440x900 之前，宽度升序）
    expect(report.missingRoles).toEqual([
      {
        role: "item",
        viewport: "375x812",
        selector: '[data-demo-id="drawer-demo"] [data-role="item"]',
      },
      {
        role: "item",
        viewport: "1440x900",
        selector: '[data-demo-id="drawer-demo"] [data-role="item"]',
      },
    ]);
    expect(report.unexpectedRoles).toEqual([
      {
        role: "portal",
        viewport: "375x812",
        selector: '[data-demo-id="drawer-demo"] [data-role="portal"]',
      },
      {
        role: "portal",
        viewport: "1440x900",
        selector: '[data-demo-id="drawer-demo"] [data-role="portal"]',
      },
    ]);
  }, 15_000);

  test("font-family and Lucide icon path diffs are field-level exemptions that never mask size/color/ARIA", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-exempt-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );
    const byRole = Object.fromEntries(
      (report.roleComparisons["375x812"] as Array<{ role: string; classification: string }>).map(
        (row) => [row.role, row],
      ),
    );

    // root：唯一差异是 fontFamily，无 manifest -> strict failure，无豁免
    expect(byRole.root.classification).toBe("MISMATCH");
    expect(byRole.root.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "fontFamily",
    );
    expect(byRole.root.styles.exemptions).toEqual([]);

    // trigger：唯一差异是 backgroundImage (icon path)，无 manifest -> strict failure
    expect(byRole.trigger.classification).toBe("MISMATCH");
    expect(byRole.trigger.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "backgroundImage",
    );
    expect(byRole.trigger.styles.exemptions).toEqual([]);

    // icon：尺寸 + backgroundImage 都是 strict failure
    expect(byRole.icon.classification).toBe("MISMATCH");
    expect(byRole.icon.rect.max_delta_px).toBe(8);
    expect(byRole.icon.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "width",
    );
    expect(byRole.icon.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "backgroundImage",
    );
    expect(byRole.icon.styles.exemptions).toEqual([]);

    // title：颜色与 fontFamily 同时不同 -> 都是 strict failure
    expect(byRole.title.classification).toBe("MISMATCH");
    expect(byRole.title.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "color",
    );
    expect(byRole.title.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "fontFamily",
    );
    expect(byRole.title.styles.exemptions).toEqual([]);

    // content：rect/styles 相同，aria-expanded 不同 → ARIA 差异必须 FAIL，不能被任何豁免抹掉
    expect(byRole.content.classification).toBe("MISMATCH");
    expect(byRole.content.rect.max_delta_px).toBe(0);
    expect(byRole.content.styles.failures).toEqual([]);
    expect(byRole.content.aria.failures.map((entry: { field: string }) => entry.field)).toContain(
      "aria-expanded",
    );
  }, 15_000);

  test("responsiveDelta reports same-role viewport changes instead of pixel error", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-responsive-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );

    // 图像完全相同 → 像素误差为 0；viewport 引起的差异只能出现在 responsiveDelta / 对应 viewport 的角色比较里
    expect(report.pixel.changed_ratio).toBe(0);

    const entries = report.responsiveDelta as Array<{
      role: string;
      viewportA: string;
      viewportB: string;
      classification: string;
      official: { rectDelta: Record<string, number> };
      local: { rectDelta: Record<string, number> };
      reasons: string[];
    }>;
    expect(entries.map((entry) => entry.role).sort()).toEqual(["content", "root", "trigger"]);

    const content = entries.find((entry) => entry.role === "content")!;
    expect(content.viewportA).toBe("375x812");
    expect(content.viewportB).toBe("1440x900");
    expect(content.classification).toBe("RESPONSIVE_STRUCTURE_DELTA");
    expect(content.official.rectDelta.width).toBe(700);
    expect(content.local.rectDelta.width).toBe(0);
    expect(content.reasons.join(" ")).toMatch(/width/);

    const trigger = entries.find((entry) => entry.role === "trigger")!;
    expect(trigger.classification).toBe("MATCH");
    expect(trigger.official.rectDelta.width).toBe(80);
    expect(trigger.local.rectDelta.width).toBe(80);
    expect(trigger.reasons).toEqual([]);

    // 同一 role 必须按 viewport 对齐比较：375 上 content 完全一致，1440 上才是宽度差
    const rows375 = report.roleComparisons["375x812"] as Array<{
      role: string;
      rect: { max_delta_px: number };
    }>;
    const rows1440 = report.roleComparisons["1440x900"] as Array<{
      role: string;
      rect: { max_delta_px: number };
    }>;
    expect(rows375.find((row) => row.role === "content")!.rect.max_delta_px).toBe(0);
    expect(rows1440.find((row) => row.role === "content")!.rect.max_delta_px).toBe(700);
    // icon 的尺寸差异（rect delta 8）只出现在 375 的 role 比较里，不进入 responsiveDelta
    expect(
      report.responsiveDelta.find((entry: { role: string }) => entry.role === "icon"),
    ).toBeUndefined();
  }, 15_000);

  test("style and aria comparison covers the required field sets", () => {
    const requiredStyleFields = [
      "width",
      "height",
      "padding",
      "margin",
      "border",
      "borderRadius",
      "display",
      "position",
      "background",
      "color",
      "fontFamily",
      "transition",
      "animation",
    ];
    const requiredAriaFields = ["role", "aria-label", "aria-expanded", "disabled", "tabIndex"];
    const build = (prefix: string) => ({
      viewport: "375x812",
      root: { x: 0, y: 0, width: 100, height: 100 },
      roles: {
        root: {
          present: true,
          rect: { x: 0, y: 0, width: 100, height: 100 },
          styles: Object.fromEntries(
            requiredStyleFields.map((field) => [field, `${prefix}-${field}`]),
          ),
          aria: Object.fromEntries(
            requiredAriaFields.map((field) => [
              field,
              field === "disabled" ? prefix === "official" : `${prefix}-${field}`,
            ]),
          ),
        },
      },
    });
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-coverage-"));
    const report = runComparator(dir, build("official"), build("local"));
    const row = (report.roleComparisons["375x812"] as Array<Record<string, any>>)[0];

    expect(row.classification).toBe("MISMATCH");
    const failureFields = (row.styles.failures as Array<{ field: string }>).map(
      (entry) => entry.field,
    );
    for (const field of requiredStyleFields) {
      if (field === "fontFamily") continue;
      expect(failureFields, `style field "${field}" must be compared`).toContain(field);
    }
    const exemptionFields = (row.styles.exemptions as Array<{ field: string; reason: string }>).map(
      (entry) => [entry.field, entry.reason],
    );
    expect(failureFields).toContain("fontFamily");
    expect(exemptionFields).toEqual([]);

    const ariaFailureFields = (row.aria.failures as Array<{ field: string }>).map(
      (entry) => entry.field,
    );
    for (const field of requiredAriaFields) {
      expect(ariaFailureFields, `aria field "${field}" must be compared`).toContain(field);
    }
  }, 15_000);
});

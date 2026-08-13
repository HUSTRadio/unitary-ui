import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function contractDigestFor(manifest, slug, contract) {
  return sha256(
    JSON.stringify(
      canonicalize({
        manifestSchemaVersion: manifest.schemaVersion,
        slug,
        acceptancePolicy: manifest.acceptancePolicy,
        contract,
      }),
    ),
  );
}

function requiredString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function findExactContract(component, cell) {
  const contracts = (component.acceptanceContracts ?? []).filter(
    (contract) =>
      contract.demoId === cell.demoId &&
      contract.variant === cell.variant &&
      contract.state === cell.state,
  );
  if (contracts.length !== 1) {
    throw new Error(
      `Expected one exact acceptance contract for ${component.slug}/${cell.demoId}/${cell.variant}/${cell.state}; found ${contracts.length}`,
    );
  }
  return contracts[0];
}

function selectorFor(role, source, viewportText) {
  const selectorPair = role.selectors.byViewport[viewportText] ?? role.selectors.default;
  return requiredString(selectorPair?.[source], `${source} selector for ${viewportText}`);
}

export function resolveEvidenceContract(manifest, cell) {
  if (manifest?.schemaVersion !== 2)
    throw new Error("Evidence v2 requires manifest schemaVersion 2");
  if (!new Set(["official", "local"]).has(cell.source)) {
    throw new Error(`Invalid evidence source: ${String(cell.source)}`);
  }
  const auditRunId = requiredString(cell.auditRunId, "auditRunId");
  const component = manifest.components?.find((candidate) => candidate.slug === cell.slug);
  if (!component) throw new Error(`Unknown manifest component: ${String(cell.slug)}`);
  if (!component.themes?.includes(cell.theme)) {
    throw new Error(`Theme is not declared by component ${component.slug}: ${String(cell.theme)}`);
  }
  if (!component.viewports?.includes(cell.viewportText)) {
    throw new Error(
      `Viewport is not declared by component ${component.slug}: ${String(cell.viewportText)}`,
    );
  }

  const contract = findExactContract(component, cell);
  const roleSelectors = Object.fromEntries(
    Object.entries(contract.roles).map(([roleName, role]) => [
      roleName,
      selectorFor(role, cell.source, cell.viewportText),
    ]),
  );
  const rootSelector = roleSelectors[contract.clipRole];
  if (!rootSelector) throw new Error(`clipRole has no resolved selector: ${contract.clipRole}`);

  const policyEpoch = Date.parse(manifest.acceptancePolicy.evidenceEpochNotBefore);
  const contractEpoch = Date.parse(contract.evidenceNotBefore);
  if (!Number.isFinite(policyEpoch) || !Number.isFinite(contractEpoch)) {
    throw new Error("Manifest and contract evidence epochs must be valid ISO date-times");
  }
  const effectiveEvidenceNotBefore = new Date(Math.max(policyEpoch, contractEpoch)).toISOString();
  const contractDigest = contractDigestFor(manifest, component.slug, contract);

  return {
    schemaVersion: 2,
    auditRunId,
    contractDigest,
    effectiveEvidenceNotBefore,
    component: component.slug,
    demoId: contract.demoId,
    variant: contract.variant,
    state: contract.state,
    theme: cell.theme,
    viewportText: cell.viewportText,
    source: cell.source,
    url: component.officialUrl,
    rootSelector,
    roleSelectors,
    contract: structuredClone(contract),
  };
}

export function collectEvidenceCellSemanticViolations(cell, manifest) {
  const violations = [];
  const add = (path, reason) => violations.push({ path, reason });
  const navigationStartedAt = Date.parse(cell?.navigationStartedAt);
  const stateStabilizedAt = Date.parse(cell?.stateStabilizedAt);
  const capturedAt = Date.parse(cell?.capturedAt);
  const effectiveEpoch = Date.parse(cell?.effectiveEvidenceNotBefore);

  if (
    ![navigationStartedAt, stateStabilizedAt, capturedAt, effectiveEpoch].every(Number.isFinite)
  ) {
    add("freshness", "freshness times must be valid ISO date-times");
  } else {
    if (!(navigationStartedAt <= stateStabilizedAt && stateStabilizedAt <= capturedAt)) {
      add("freshness", "evidence time order must be navigation <= stabilized <= captured");
    }
    if (stateStabilizedAt < effectiveEpoch) {
      add("stateStabilizedAt", "state stabilization precedes the effective evidence epoch");
    }
  }

  if (manifest?.schemaVersion === 2 && cell?.contract && cell?.slug) {
    const expectedDigest = contractDigestFor(manifest, cell.slug, cell.contract);
    if (cell.contractDigest !== expectedDigest) {
      add("contractDigest", "contractDigest does not match the resolved manifest contract");
    }
  } else {
    add("contractDigest", "manifest v2 and resolved contract are required for digest validation");
  }

  return violations;
}

export function buildEvidenceCellV2(config, capture) {
  return {
    schemaVersion: 2,
    source: config.source,
    slug: config.slug,
    demoId: config.demoId,
    variant: config.variant,
    state: config.state,
    theme: config.theme,
    viewport: structuredClone(config.viewport),
    viewportText: config.viewportText,
    url: config.url,
    rootSelector: config.rootSelector,
    roleSelectors: structuredClone(config.roleSelectors),
    auditRunId: config.auditRunId,
    contractDigest: config.contractDigest,
    effectiveEvidenceNotBefore: config.effectiveEvidenceNotBefore,
    contract: structuredClone(config.contract),
    navigationStartedAt: config.navigationStartedAt,
    stateStabilizedAt: config.stateStabilizedAt,
    capturedAt: capture.capturedAt,
    sourceTimestamp: null,
    producer: {
      collectorSha256: capture.collectorSha256,
      browserVersion: capture.browserVersion,
    },
    artifacts: {
      screenshot: "screenshot.png",
      metrics: "metrics.json",
    },
    localRevision: config.localRevision,
    worktreeClean: config.worktreeClean,
    localSourceDigest: config.localSourceDigest,
    localSourceFiles: structuredClone(config.localSourceFiles),
    observedTheme: structuredClone(capture.observedTheme),
    status: "captured",
  };
}

export function collectMetricsContractViolations(config, metrics) {
  const violations = [];
  const add = (role, reason) => violations.push({ path: `roles.${role}`, reason });
  const contractRoles = config?.contract?.roles ?? {};
  const metricRoles = metrics?.roles ?? {};

  for (const [roleName, roleContract] of Object.entries(contractRoles)) {
    const metric = metricRoles[roleName];
    const present = metric?.present === true;
    if (roleContract.presence === "required" && !present) {
      add(roleName, "required role is missing from collected metrics");
      continue;
    }
    if (roleContract.presence === "forbidden" && present) {
      add(roleName, "forbidden role is present in collected metrics");
      continue;
    }
    if (!present) continue;

    if (new Set(["mapped-text", "text-sized-control"]).has(roleContract.acceptanceProfile)) {
      const textEvidence = metric.textEvidence;
      const requiredFields = [
        "clientRects",
        "clientWidth",
        "scrollWidth",
        "whiteSpace",
        "overflow",
        "textOverflow",
      ];
      if (
        !textEvidence ||
        requiredFields.some((field) => textEvidence[field] === undefined) ||
        !Array.isArray(textEvidence.clientRects)
      ) {
        add(roleName, "mapped text evidence is incomplete");
      }
    }
  }

  return violations;
}

function git(repoRoot, args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: options.encoding ?? "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
}

export function computeLocalSourceState(repoRoot, inputPatterns) {
  if (!Array.isArray(inputPatterns) || inputPatterns.length === 0) {
    throw new Error("localSourceInputs must contain at least one Git pathspec");
  }
  const localRevision = git(repoRoot, ["rev-parse", "HEAD"]).trim();
  if (!/^[a-f0-9]{40}$/.test(localRevision)) {
    throw new Error(`Expected a 40-character Git revision, got ${localRevision}`);
  }
  const status = git(repoRoot, ["status", "--porcelain=v1", "-z"], { encoding: "buffer" });
  const worktreeClean = status.length === 0;
  const tracked = git(repoRoot, ["ls-files", "-z", "--", ...inputPatterns], {
    encoding: "buffer",
  });
  const localSourceFiles = tracked
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((filename) => filename.replaceAll("\\", "/"))
    .sort();
  if (localSourceFiles.length === 0) {
    throw new Error("localSourceInputs matched no Git-tracked files");
  }

  const digest = createHash("sha256");
  for (const filename of localSourceFiles) {
    digest.update(filename);
    digest.update("\0");
    digest.update(readFileSync(resolve(repoRoot, filename)));
  }

  return {
    localRevision,
    worktreeClean,
    localSourceDigest: digest.digest("hex"),
    localSourceFiles,
  };
}

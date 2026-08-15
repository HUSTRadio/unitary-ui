import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { collectManifestSemanticViolations } from "./manifest-v2-semantics.mjs";

const readJson = (filename) => JSON.parse(readFileSync(filename, "utf8"));
const defaultAuditDir = dirname(fileURLToPath(import.meta.url));

export function createAuditSchemaValidators(auditDir) {
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  const manifestSchema = readJson(resolve(auditDir, "geist-audit-manifest.schema.json"));
  const evidenceSchema = readJson(resolve(auditDir, "evidence-cell.schema.json"));
  ajv.addSchema(manifestSchema);
  return {
    validateManifest: ajv.getSchema(manifestSchema.$id),
    validateEvidenceCell: ajv.compile(evidenceSchema),
  };
}

function schemaError(validate) {
  return JSON.stringify(validate.errors, null, 2);
}

export function assertManifestV2(manifest, auditDir = defaultAuditDir) {
  const { validateManifest } = createAuditSchemaValidators(auditDir);
  if (!validateManifest(manifest)) {
    throw new Error(`Manifest v2 schema validation failed: ${schemaError(validateManifest)}`);
  }
  const violations = collectManifestSemanticViolations(manifest);
  if (violations.length) {
    throw new Error(
      `Manifest v2 semantic validation failed: ${JSON.stringify(violations, null, 2)}`,
    );
  }
}

export function assertEvidenceCellV2(cell, auditDir = defaultAuditDir) {
  const { validateEvidenceCell } = createAuditSchemaValidators(auditDir);
  if (!validateEvidenceCell(cell)) {
    throw new Error(
      `Evidence cell v2 schema validation failed: ${schemaError(validateEvidenceCell)}`,
    );
  }
}

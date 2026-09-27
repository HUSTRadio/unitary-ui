import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";
import { writeTypecheckFixtures } from "./audit/showcode-audit-lib";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outDir = path.join(repoRoot, ".hermes/audit/typecheck");
const pnpm = process.platform === "win32" ? "pnpm.exe" : "pnpm";

test(
  "typecheck all show code fixtures",
  { timeout: 360000 },
  async () => {
    const { fileCount, tsconfigPath } = await writeTypecheckFixtures(repoRoot, EXAMPLE_SOURCE, outDir);
    console.log(`fixtures: ${fileCount} 个 → ${outDir}`);

    let stdout = "";
    let exitCode = 0;
    try {
      stdout = execFileSync(pnpm, ["exec", "tsc", "--noEmit", "-p", tsconfigPath, "--pretty", "false"], {
        cwd: repoRoot,
        encoding: "utf8",
        timeout: 330000,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (cause) {
      const error = cause as { status?: number; stdout?: string; stderr?: string };
      exitCode = error.status ?? -1;
      stdout = `${error.stdout ?? ""}\n${error.stderr ?? ""}`;
    }

    const errors: { file: string; line: number; code: string; message: string }[] = [];
    for (const m of stdout.matchAll(
      /\.hermes[\\/]audit[\\/]typecheck[\\/]([0-9a-f]+)__([0-9a-f]+)\.tsx\((\d+),\d+\): error (TS\d+): (.+)/g,
    )) {
      const slug = Buffer.from(m[1], "hex").toString("utf8");
      const id = Buffer.from(m[2], "hex").toString("utf8");
      errors.push({ file: `${slug}/${id}`, line: Number(m[3]), code: m[4], message: m[5] });
    }

    const out = {
      exitCode,
      fileCount,
      errorCount: errors.length,
      uniqueErrorCodes: [...new Set(errors.map((error) => error.code))],
      errors,
    };
    await mkdir(path.join(repoRoot, ".hermes/audit"), { recursive: true });
    await writeFile(
      path.join(repoRoot, ".hermes/audit/typecheck-errors.json"),
      JSON.stringify(out, null, 2),
      "utf8",
    );
    console.log(`tsc exit: ${exitCode}, 错误: ${errors.length} 条`);
    console.log("错误码分布:", out.uniqueErrorCodes.join(", ") || "无");

    expect(exitCode, stdout).toBe(0);
    expect(errors, stdout).toEqual([]);
  },
);

/** 类型检查层（诊断）：把全部 DEMO_CODE 条目写成独立 .tsx fixture，用 tsc 全量类型检查。
 * 抓"show code 代码错误"（引用不存在组件、prop 拼错、import 错误）。
 * 运行：RUN_TYPECHECK=1 pnpm exec vitest run tests/showcode-typecheck.test.ts
 * 结果落盘 .hermes/audit/typecheck-errors.json；本测试为诊断，不强制断言。 */
import { test } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { DEMO_CODE } from "../docs/geist/src/data/demo-code";
import { writeTypecheckFixtures } from "./audit/showcode-audit-lib";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outDir = path.join(repoRoot, ".hermes/audit/typecheck");

test(
  "typecheck all show code fixtures",
  { skip: !process.env.RUN_TYPECHECK, timeout: 360000 },
  async () => {
    const { fileCount, tsconfigPath } = await writeTypecheckFixtures(repoRoot, DEMO_CODE, outDir);
    console.log(`fixtures: ${fileCount} 个 → ${outDir}`);

    let stdout = "";
    let exitCode = 0;
    try {
      stdout = execSync(`pnpm exec tsc --noEmit -p "${tsconfigPath}" --pretty false`, {
        cwd: repoRoot,
        encoding: "utf8",
        timeout: 330000,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e: any) {
      exitCode = e.status ?? -1;
      stdout = (e.stdout ?? "") + "\n" + (e.stderr ?? "");
    }

    const errors: { file: string; line: number; code: string; message: string }[] = [];
    for (const m of stdout.matchAll(
      /\.hermes[\\/]audit[\\/]typecheck[\\/]([\w-]+)__([\w-]+)\.tsx\((\d+),\d+\): error (TS\d+): (.+)/g,
    )) {
      if (m[4] === "TS2657") continue; // 多根 JSX：文档片段有意风格
      errors.push({ file: `${m[1]}/${m[2]}`, line: Number(m[3]), code: m[4], message: m[5] });
    }

    const out = {
      exitCode,
      fileCount,
      errorCount: errors.length,
      uniqueErrorCodes: [...new Set(errors.map((e) => e.code))],
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
    if (errors.length) {
      const byCode = new Map<string, number>();
      for (const e of errors) byCode.set(e.code, (byCode.get(e.code) ?? 0) + 1);
      console.log("按错误码:", [...byCode.entries()].map(([c, n]) => `${c}×${n}`).join(" "));
    }
  },
);

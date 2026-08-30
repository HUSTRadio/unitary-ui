// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  classifyScreenshotImpact,
  parseAngularCommit,
} from "../scripts/lib/pre-push-classifier.mjs";

describe("pre-push Angular Commit 与截图影响分类", () => {
  it("解析 Angular Commit Convention 的 type、scope 与 breaking 标记", () => {
    expect(parseAngularCommit("feat(ui)!: 调整应用外壳")).toEqual({
      type: "feat",
      scope: "ui",
      breaking: true,
    });
    expect(parseAngularCommit("docs: 更新说明\n\nBREAKING CHANGE: 新入口")).toEqual({
      type: "docs",
      scope: "",
      breaking: true,
    });
    expect(parseAngularCommit("not conventional")).toBeNull();
  });

  it("真实视觉路径始终触发截图检查，不依赖提交信息是否正确", () => {
    for (const changedPath of [
      "src/components/ui/button.tsx",
      "src/lib/theme.ts",
      "public/fonts/oppo-sans-l1-vf.woff2",
      "vite.config.ts",
      "package.json",
    ]) {
      expect(
        classifyScreenshotImpact({
          changedPaths: [changedPath],
          commits: ["chore: misc"],
        }),
        changedPath,
      ).toMatchObject({ required: true, pathMatch: true });
    }
  });

  it("提交元数据只提供诊断信号，不能覆盖权威路径判断", () => {
    for (const subject of [
      "feat(ui): add panel",
      "fix(component): correct button",
      "style(theme): tune dark colors",
      "refactor(styleguide): split examples",
    ]) {
      expect(
        classifyScreenshotImpact({
          changedPaths: ["tests/parser.test.ts"],
          commits: [subject],
        }),
      ).toEqual({ required: false, pathMatch: false, commitMatch: true });
    }
  });

  it("非视觉提交在无影响路径时跳过截图检查", () => {
    expect(
      classifyScreenshotImpact({
        changedPaths: ["tests/parser.test.ts"],
        commits: ["test(parser): add coverage"],
      }),
    ).toEqual({ required: false, pathMatch: false, commitMatch: false });
  });
});

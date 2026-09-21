// @vitest-environment node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { DOCS_ROUTE_SEQUENCE } from "../docs/geist/src/data/docs-routes";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LLM_DIR = path.join(ROOT, "docs", "llm");
const VP_COMMAND = process.platform === "win32" ? "vp.exe" : "vp";

function readIndex(): any {
  const indexPath = path.join(LLM_DIR, "index.json");
  expect(existsSync(indexPath), "docs/llm/index.json 必须存在").toBe(true);
  return JSON.parse(readFileSync(indexPath, "utf8"));
}

function readPage(rel: string): string {
  const pagePath = path.join(LLM_DIR, rel);
  expect(existsSync(pagePath), `页面文件必须存在: ${rel}`).toBe(true);
  return readFileSync(pagePath, "utf8");
}

describe("LLM docs export contract", () => {
  it("提供双语 corpus 入口并保持独占 preview 合同", () => {
    const zh = readFileSync(path.join(LLM_DIR, "README.md"), "utf8");
    const en = readFileSync(path.join(LLM_DIR, "README.en.md"), "utf8");
    const generator = readFileSync(path.join(ROOT, "scripts", "generate-llm-docs.ts"), "utf8");

    expect(zh).toContain("README.en.md");
    expect(en).toContain("README.md");
    for (const text of [zh, en]) {
      expect(text).toContain("index.json");
      expect(text).toContain("docs:llm:generate");
      expect(text).toContain("docs:llm:check");
      expect(text).toContain("docs/geist/src/data/docs-routes.ts");
    }
    expect(generator).not.toContain("复用已在运行的预览服务");
    expect(generator).toContain("findAvailablePort");
    expect(generator).toContain('[data-slot="video"]');
    expect(generator).toContain('[data-demo-component="${route.renderer.componentName}"]');
  });

  it("不把视频播放器的运行时计时状态写入静态语料", () => {
    const videoPage = readFileSync(
      path.join(LLM_DIR, "pages", "zh-CN", "components", "video.md"),
      "utf8",
    );

    expect(videoPage).not.toMatch(/^\d{2}:\d{2}$/m);
  });

  it("index.json 存在且路由与 canonical registry 一一对应", () => {
    const index = readIndex();
    expect(index.schemaVersion).toBe(1);
    expect(index.primaryLocale).toBe("zh-CN");
    expect(index.alternativeLocales).toEqual(["en-US"]);
    expect(index.routes.map((r: any) => r.path)).toEqual(
      DOCS_ROUTE_SEQUENCE.map((route) => route.to),
    );
  });

  it("每条路由恰有 zh-CN primary 与 en-US alternative 两个输出", () => {
    const index = readIndex();
    for (const route of index.routes) {
      expect(route.locales["zh-CN"], `${route.path} 缺少 zh-CN`).toBeTruthy();
      expect(route.locales["en-US"], `${route.path} 缺少 en-US`).toBeTruthy();
    }
    const allPages = new Set(index.routes.flatMap((r: any) => Object.values(r.locales)));
    expect(allPages.size).toBe(DOCS_ROUTE_SEQUENCE.length * 2);
  });

  it("每条路由的双语页面文件全部存在且非空", () => {
    const index = readIndex();
    let count = 0;
    for (const route of index.routes) {
      for (const rel of Object.values(route.locales) as string[]) {
        const content = readPage(rel);
        expect(content.trim().length, `${rel} 不能为空`).toBeGreaterThan(50);
        count++;
      }
    }
    expect(count).toBe(DOCS_ROUTE_SEQUENCE.length * 2);
  });

  it("每页含 route、title、summary，且无垃圾痕迹", () => {
    const index = readIndex();
    for (const route of index.routes) {
      for (const [locale, rel] of Object.entries(route.locales)) {
        const content = readPage(rel as string);
        expect(content, `${rel} 必须含路由`).toContain(route.path);
        expect(content, `${rel} 必须含标题`).toContain(
          locale === "zh-CN" ? route.title["zh-CN"] : route.title["en-US"],
        );
        // 垃圾痕迹检测只针对自然语言正文；代码围栏与 translate=no 的 API 类型/默认值是合法机器文本。
        // "undefined behavior" 是固定英文技术措辞，予以豁免。
        const prose = content
          .replace(/```[\s\S]*?```/g, "")
          .replace(/<(?:code|td)[^>]*translate="no"[^>]*>[\s\S]*?<\/(?:code|td)>/g, "")
          .replace(/undefined behavior/g, "");
        expect(prose, `${rel} 疑似泄漏 undefined 值`).not.toMatch(/\bundefined\b/);
        expect(prose).not.toContain("data-reactroot");
        expect(content).not.toMatch(/^#+\s*$/m); // 空标题
      }
    }
  });

  it("组件页含 API、最佳实践与至少一个代码围栏", () => {
    const index = readIndex();
    // 图表组件族的详情页挂在 /charts/<name>，与 /components/<name> 同属 component-detail 渲染器
    const componentRoutes = index.routes.filter(
      (r: any) =>
        (r.path.startsWith("/components/") && r.path !== "/components") ||
        r.path.startsWith("/charts/"),
    );
    expect(componentRoutes.length).toBe(
      DOCS_ROUTE_SEQUENCE.filter((route) => route.renderer.kind === "component-detail").length,
    );
    for (const route of componentRoutes) {
      for (const rel of Object.values(route.locales) as string[]) {
        const content = readPage(rel);
        expect(content, `${rel} 必须含 API 段落`).toMatch(/##\s*API/i);
        expect(content, `${rel} 必须含最佳实践/when-to-use 段落`).toMatch(
          /##\s*(最佳实践|何时使用|When to use|Best practices)/i,
        );
        expect(content, `${rel} 必须含代码围栏`).toContain("```");
      }
    }
  });

  it("exports Device as the canonical page instead of the deprecated Phone alias", () => {
    const index = readIndex();
    expect(index.routes.some((route: any) => route.path === "/components/device")).toBe(true);
    expect(index.routes.some((route: any) => route.path === "/components/phone")).toBe(false);
    expect(existsSync(path.join(LLM_DIR, "pages", "zh-CN", "components", "device.md"))).toBe(true);
    expect(existsSync(path.join(LLM_DIR, "pages", "en-US", "components", "device.md"))).toBe(true);
    expect(existsSync(path.join(LLM_DIR, "pages", "zh-CN", "components", "phone.md"))).toBe(false);
    expect(existsSync(path.join(LLM_DIR, "pages", "en-US", "components", "phone.md"))).toBe(false);
  });

  // 实测（2026-09，Windows）：`vp fmt docs/llm --check` 格式化本体约 4.4s/175 文件，
  // 但 vp 引导开销约 27s，整条命令墙钟 31.9s——30s 超时天生卡线，冷启动时会误判失败。
  // 对齐仓库重用例口径（showcode-coverage 60s），断言本身不变：仍要求 fmt --check 退出码为 0。
  it("生成语料符合仓库 formatter 合同", () => {
    const result = spawnSync(VP_COMMAND, ["fmt", LLM_DIR, "--check"], {
      cwd: ROOT,
      encoding: "utf8",
      shell: false,
    });
    expect(result.status, [result.stdout, result.stderr].filter(Boolean).join("\n")).toBe(0);
  }, 60_000);

  it("sourceHash 与实际页面内容一致（无漂移）", async () => {
    const { createHash } = await import("node:crypto");
    const index = readIndex();
    for (const route of index.routes) {
      for (const [locale, rel] of Object.entries(route.locales)) {
        const content = readPage(rel as string);
        const hash = `sha256:${createHash("sha256").update(content).digest("hex")}`;
        expect(route.sourceHash[locale], `${rel} 哈希漂移`).toBe(hash);
      }
    }
  });
});

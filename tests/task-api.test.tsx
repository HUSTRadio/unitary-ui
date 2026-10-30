import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Task } from "../src/components/ui/task";
import type { TaskStatus } from "../src/lib/task";

const render = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("Task presentation contract", () => {
  it("is fully controlled and mirrors the status it receives", () => {
    for (const status of ["idle", "running", "partial", "failed", "succeeded"] as TaskStatus[]) {
      const markup = render(<Task status={status} title="Import contacts" />);
      expect(markup, status).toContain(`data-status="${status}"`);
      expect(markup, status).toContain('data-slot="task"');
    }
  });

  it("renders title, description and stage copy as given", () => {
    const markup = render(
      <Task
        status="running"
        title="Import contacts"
        description="Reads a CSV from your device."
        stage="Uploading 3 of 12"
      />,
    );

    expect(markup).toContain("Import contacts");
    expect(markup).toContain("Reads a CSV from your device.");
    expect(markup).toContain("Uploading 3 of 12");
    expect(markup).toContain('data-slot="task-stage"');
  });

  it("shows progress only for running and partial", () => {
    for (const status of ["idle", "failed", "succeeded"] as TaskStatus[]) {
      const markup = render(<Task status={status} progress={0.5} />);
      expect(markup, status).not.toContain('data-slot="task-progress"');
      expect(markup, status).not.toContain("data-progress");
    }

    for (const status of ["running", "partial"] as TaskStatus[]) {
      const markup = render(<Task status={status} progress={0.5} />);
      expect(markup, status).toContain('data-slot="task-progress"');
      expect(markup, status).toContain('data-progress="50"');
      expect(markup, status).toContain("width:50%");
    }
  });

  it("clamps and rounds the displayed percentage", () => {
    expect(render(<Task status="running" progress={-1} />)).toContain('data-progress="0"');
    expect(render(<Task status="running" progress={4} />)).toContain('data-progress="100"');
    expect(render(<Task status="running" progress={0.333} />)).toContain('data-progress="33"');
  });

  it("offers cancel only while running", () => {
    const onCancel = () => {};
    expect(render(<Task status="running" onCancel={onCancel} />)).toContain('data-slot="task-actions"');
    for (const status of ["idle", "partial", "failed", "succeeded"] as TaskStatus[]) {
      expect(render(<Task status={status} onCancel={onCancel} />), status).not.toContain(
        'data-slot="task-actions"',
      );
    }
  });

  it("offers retry only for failed and partial", () => {
    const onRetry = () => {};
    for (const status of ["failed", "partial"] as TaskStatus[]) {
      expect(render(<Task status={status} onRetry={onRetry} />), status).toContain(
        'data-slot="task-actions"',
      );
    }
    for (const status of ["idle", "running", "succeeded"] as TaskStatus[]) {
      expect(render(<Task status={status} onRetry={onRetry} />), status).not.toContain(
        'data-slot="task-actions"',
      );
    }
    // 两个回调同时给出时，按状态只渲染该出现的那一个。
    const both = render(<Task status="running" onCancel={onRetry} onRetry={onRetry} />);
    expect(both.match(/data-slot="button"/g)).toHaveLength(1);
  });

  it("uses framework labels by default and lets callers override them", () => {
    const fallback = render(<Task status="failed" onRetry={() => {}} />);
    expect(fallback).toContain("Retry task");

    const custom = render(<Task status="failed" onRetry={() => {}} retryLabel="Run again" />);
    expect(custom).toContain("Run again");
    expect(custom).not.toContain("Retry task");
  });

  it("merges caller className and forwards div attributes", () => {
    const markup = render(<Task status="idle" className="mt-4" data-testid="task-root" />);
    expect(markup).toMatch(/class="flex w-full min-w-0 flex-col gap-2 mt-4"/);
    expect(markup).toContain('data-testid="task-root"');
  });

  it("holds no state, timers or network access", async () => {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const src = await readFile(path.join(root, "src/components/ui/task.tsx"), "utf8");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

    expect(code).not.toMatch(/useState|useReducer|useEffect/);
    expect(code).not.toMatch(/setTimeout|setInterval|requestAnimationFrame/);
    expect(code).not.toMatch(/fetch\(|XMLHttpRequest/);
  });
});

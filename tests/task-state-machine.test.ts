import { describe, expect, it } from "vitest";

import {
  canStart,
  createTaskState,
  isActive,
  isTerminal,
  taskReducer,
  type TaskAction,
  type TaskState,
  type TaskStatus,
} from "../src/lib/task";

const STATUSES: TaskStatus[] = ["idle", "running", "partial", "failed", "succeeded"];

const ACTIONS: TaskAction[] = [
  { type: "start" },
  { type: "progress", value: 0.5 },
  { type: "stage", value: "Uploading" },
  { type: "succeed" },
  { type: "fail", error: "Network" },
  { type: "partial", error: "2 of 5 failed" },
  { type: "reset" },
];

function stateAt(status: TaskStatus): TaskState {
  return createTaskState({
    status,
    progress: status === "idle" ? 0 : 0.4,
    stage: status === "running" ? "Uploading" : null,
    error: status === "failed" || status === "partial" ? "previous" : null,
    attempts: status === "idle" ? 0 : 2,
  });
}

describe("taskReducer", () => {
  it("starts from every non-running status", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "start" });
      if (status === "running") {
        expect(next, status).toBe(base);
        continue;
      }
      expect(next.status, status).toBe("running");
      expect(next.progress, status).toBe(0);
      expect(next.stage, status).toBeNull();
      expect(next.error, status).toBeNull();
      expect(next.attempts, status).toBe(base.attempts + 1);
    }
  });

  it("only advances progress while running, clamped to 0–1", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "progress", value: 0.75 });
      if (status !== "running") {
        expect(next, status).toBe(base);
      } else {
        expect(next.progress).toBe(0.75);
      }
    }

    const running = stateAt("running");
    expect(taskReducer(running, { type: "progress", value: -3 }).progress).toBe(0);
    expect(taskReducer(running, { type: "progress", value: 9 }).progress).toBe(1);
    expect(taskReducer(running, { type: "progress", value: Number.NaN }).progress).toBe(0);
    expect(taskReducer(running, { type: "progress", value: 0.4 })).toBe(running);
  });

  it("only records a stage while running", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "stage", value: "Compressing" });
      if (status !== "running") expect(next, status).toBe(base);
      else expect(next.stage).toBe("Compressing");
    }
    const running = stateAt("running");
    expect(taskReducer(running, { type: "stage", value: "Uploading" })).toBe(running);
  });

  it("succeeds only from running and clears transient fields", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "succeed" });
      if (status !== "running") {
        expect(next, status).toBe(base);
        continue;
      }
      expect(next.status).toBe("succeeded");
      expect(next.progress).toBe(1);
      expect(next.stage).toBeNull();
      expect(next.error).toBeNull();
    }
  });

  it("fails only from running and keeps progress for display", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "fail", error: "Boom" });
      if (status !== "running") {
        expect(next, status).toBe(base);
        continue;
      }
      expect(next.status).toBe("failed");
      expect(next.error).toBe("Boom");
      expect(next.progress).toBe(0.4);
      expect(next.stage).toBeNull();
    }
    expect(taskReducer(stateAt("running"), { type: "fail" }).error).toBeNull();
  });

  it("marks partial only from running and preserves progress", () => {
    for (const status of STATUSES) {
      const base = stateAt(status);
      const next = taskReducer(base, { type: "partial", error: "2 of 5 failed" });
      if (status !== "running") {
        expect(next, status).toBe(base);
        continue;
      }
      expect(next.status).toBe("partial");
      expect(next.error).toBe("2 of 5 failed");
      expect(next.progress).toBe(0.4);
    }
  });

  it("resets to the initial state and is idempotent when already clean", () => {
    for (const status of STATUSES) {
      const next = taskReducer(stateAt(status), { type: "reset" });
      expect(next).toEqual(createTaskState());
    }
    const clean = createTaskState();
    expect(taskReducer(clean, { type: "reset" })).toBe(clean);
  });

  it("covers the full status × action matrix without throwing", () => {
    for (const status of STATUSES) {
      for (const action of ACTIONS) {
        const next = taskReducer(stateAt(status), action);
        expect(STATUSES, `${status} × ${action.type}`).toContain(next.status);
        expect(next.progress).toBeGreaterThanOrEqual(0);
        expect(next.progress).toBeLessThanOrEqual(1);
      }
    }
  });

  it("reports status helpers consistently", () => {
    expect(STATUSES.filter(isTerminal)).toEqual(["partial", "failed", "succeeded"]);
    expect(STATUSES.filter(isActive)).toEqual(["running"]);
    expect(STATUSES.filter(canStart)).toEqual(["idle", "partial", "failed", "succeeded"]);
  });
});

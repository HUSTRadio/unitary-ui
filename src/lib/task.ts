/**
 * Task 纯状态机（M2-04）。
 *
 * 只做状态推导，不发起请求、不排队、不持有定时器：取消与重试由调用方执行，
 * 状态通过 reducer 显式推进，便于在任意环境（SSR、测试、后台）复现。
 *
 * 与 StatusDot 无关：StatusDotState 是构建/部署语义的封闭集合，本模块不改动它。
 */

export type TaskStatus = "idle" | "running" | "partial" | "failed" | "succeeded";

export interface TaskState {
  status: TaskStatus;
  /** 0–1，已做截断；非 running 态保留最后值供展示。 */
  progress: number;
  /** 当前阶段文案；仅 running 期间有意义。 */
  stage: string | null;
  /** 失败或部分完成的说明。 */
  error: string | null;
  /** 已开始的次数（start 递增），用于展示第几次尝试。 */
  attempts: number;
}

export type TaskAction =
  | { type: "start" }
  | { type: "progress"; value: number }
  | { type: "stage"; value: string }
  | { type: "succeed" }
  | { type: "fail"; error?: string }
  | { type: "partial"; error?: string }
  | { type: "reset" };

const TERMINAL: readonly TaskStatus[] = ["succeeded", "failed", "partial"];

/** 终态：不会自行继续推进（partial 可被 start 重新开始）。 */
export function isTerminal(status: TaskStatus): boolean {
  return TERMINAL.includes(status);
}

/** 正在执行：可接受 progress / stage / succeed / fail / partial。 */
export function isActive(status: TaskStatus): boolean {
  return status === "running";
}

/** 可以（重新）开始：非 running 的任意状态。 */
export function canStart(status: TaskStatus): boolean {
  return status !== "running";
}

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function createTaskState(overrides: Partial<TaskState> = {}): TaskState {
  return {
    status: "idle",
    progress: 0,
    stage: null,
    error: null,
    attempts: 0,
    ...overrides,
  };
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "start": {
      if (!canStart(state.status)) return state;
      return {
        status: "running",
        progress: 0,
        stage: null,
        error: null,
        attempts: state.attempts + 1,
      };
    }
    case "progress": {
      if (!isActive(state.status)) return state;
      const progress = clampProgress(action.value);
      return progress === state.progress ? state : { ...state, progress };
    }
    case "stage": {
      if (!isActive(state.status)) return state;
      if (action.value === state.stage) return state;
      return { ...state, stage: action.value };
    }
    case "succeed": {
      if (!isActive(state.status)) return state;
      return { ...state, status: "succeeded", progress: 1, stage: null, error: null };
    }
    case "fail": {
      if (!isActive(state.status)) return state;
      return { ...state, status: "failed", stage: null, error: action.error ?? null };
    }
    case "partial": {
      if (!isActive(state.status)) return state;
      return { ...state, status: "partial", stage: null, error: action.error ?? null };
    }
    case "reset": {
      if (state.status === "idle" && state.progress === 0 && state.stage === null && state.error === null && state.attempts === 0) {
        return state;
      }
      return createTaskState();
    }
    default:
      return state;
  }
}

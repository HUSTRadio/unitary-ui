import * as React from "react";

/**
 * Input modality — 输入模态检测（DD-001a，设计决策 §2）。
 *
 * 区分的是「输入模态」（手指 vs 鼠标/触控板），不是屏幕尺寸：
 * 同一台触屏笔记本两种输入并存；窄窗口的桌面浏览器仍是鼠标操作。
 *
 * 判定层级（按优先级）：
 * 1. `(pointer: coarse)` → touch —— CSS4 主指针精度，最可靠的单信号；
 * 2. `(pointer: fine)`   → pointer；
 * 3. `(hover: none)`     → touch —— 触屏主设备通常无 hover；
 * 4. UA 兜底（iPhone|iPad|Android）—— 覆盖上述信号均缺失的老旧环境；
 * 5. 默认 pointer。
 *
 * SSR 安全：hook 首帧返回 "pointer"，useEffect 后再解析真实模态，
 * 避免 hydration mismatch。matchMedia change 监听让二合一笔记本
 * 折叠/展开时组件平滑过渡到对应形态，不要求刷新。
 */

export type InputModality = "touch" | "pointer";

const MODALITY_QUERIES = ["(pointer: coarse)", "(pointer: fine)", "(hover: none)"] as const;

const TOUCH_UA_RE = /iPhone|iPad|Android/i;

export function resolveInputModality(win: Window = window): InputModality {
  if (typeof win.matchMedia === "function") {
    if (win.matchMedia("(pointer: coarse)").matches) return "touch";
    if (win.matchMedia("(pointer: fine)").matches) return "pointer";
    if (win.matchMedia("(hover: none)").matches) return "touch";
  }
  return TOUCH_UA_RE.test(win.navigator?.userAgent ?? "") ? "touch" : "pointer";
}

export function useInputModality(): InputModality {
  // SSR 默认 "pointer"；useEffect 后解析真实模态（hydration-safe）
  const [modality, setModality] = React.useState<InputModality>("pointer");

  React.useEffect(() => {
    const update = () => setModality(resolveInputModality());
    update();
    const queries = MODALITY_QUERIES.map((query) => window.matchMedia(query));
    for (const query of queries) query.addEventListener("change", update);
    return () => {
      for (const query of queries) query.removeEventListener("change", update);
    };
  }, []);

  return modality;
}

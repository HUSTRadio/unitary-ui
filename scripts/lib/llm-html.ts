/**
 * 页面内降噪脚本：移除交互噪声，保留语义内容；必须自包含以供 page.evaluate 序列化。
 * Keep this browser callback self-contained so page.evaluate can serialize it without imports.
 */
export function extractMainHtml(): string {
  const main = document.getElementById("main-content");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;

  // 代码块重建：高亮渲染器用 div.token-line 分行，textContent 拼接后会丢失换行。
  // 在移除按钮之前，把 pre 内容重建为带真实换行的纯文本。
  for (const pre of Array.from(clone.querySelectorAll("pre"))) {
    const lines = Array.from(pre.querySelectorAll(".token-line")).map(
      (line) => line.textContent ?? "",
    );
    const text = lines.length > 0 ? lines.join("\n") : (pre.textContent ?? "");
    pre.textContent = text;
  }

  // 测量截断片段与 sr-only 原文会重复且随字体度量变化；仅提取组件的真实完整值。
  // Normalize measured fragments and duplicate accessible text to the real complete value.
  for (const el of Array.from(
    clone.querySelectorAll('[data-slot="middle-truncate"][data-value]'),
  )) {
    if (!el.closest("pre, code")) el.textContent = el.getAttribute("data-value") ?? "";
  }
  // Recharts 浮动提示随鼠标、坐标与 active/payload 变化，不属于静态文档；图例和代码保留。
  // Exclude transient Recharts tooltips while retaining legends and source examples.
  for (const el of Array.from(clone.querySelectorAll(".recharts-tooltip-wrapper"))) {
    if (!el.closest("pre, code")) el.remove();
  }

  // 移除脚本、样式、SVG 装饰、侧边栏导航。
  for (const selector of ["script", "style", "svg", "nav", "aside", "form"]) {
    for (const el of Array.from(clone.querySelectorAll(selector))) el.remove();
  }
  // 交互控件与运行时状态：表单控件、媒体播放器及 token 编辑器；代码保留。
  // Remove runtime editors but retain their source examples for portable output.
  // Video 的计时文本会在媒体元数据加载前后从 00:00 变为实际时长，必须整体移除，
  // 否则同一源码的连续生成会产生非确定性语料漂移；示例代码仍保留完整用法。
  // 首页视口插画也保留标题与说明，移除随可见性变化的加载/播放区域。
  // Keep introduction guidance, excluding its viewport-dependent loading/playback region.
  for (const el of Array.from(
    clone.querySelectorAll(
      'button, input, select, textarea, [data-slot="video"], [data-token-demo], [data-motion-intro] [data-slot="lazy-load"]',
    ),
  )) {
    el.remove();
  }
  // 空链接（图标链接/跳转链接移除后的残壳）与 skip 链接。
  for (const link of Array.from(clone.querySelectorAll("a"))) {
    const text = (link.textContent ?? "").trim();
    if (!text) link.remove();
  }
  return clone.innerHTML;
}

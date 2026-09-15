/**
 * 统一剪贴板写入（copy-button / snippet 共用；2026-09-15 抽取）。
 *
 * 策略：优先 Clipboard API；失败降级到隐藏 textarea + execCommand
 * （无 clipboard 权限的 webview / 旧内核仍可完成复制）。
 *
 * 失败时抛出原始原因——调用方决定反馈语义：
 * - CopyButton：catch 后走 onError（不谎报成功）
 * - Snippet：catch 静默（按"尽力复制 + 给出反馈"的产品语义继续播报）
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable");
    await navigator.clipboard.writeText(text);
    return;
  } catch (clipboardError) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    try {
      textarea.select();
      if (typeof document.execCommand !== "function" || !document.execCommand("copy")) {
        throw clipboardError;
      }
    } finally {
      textarea.remove();
    }
  }
}

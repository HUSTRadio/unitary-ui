import * as React from "react";

/**
 * Feedback 评分表情 —— 官方 Geist 表情 SVG（verbatim 整体引用）。
 * 来源：2026-08-16 CDP 实测 vercel.com/geist/feedback 评分行 [role=radio] 内 SVG。
 * 约束：不拆解 path、不改 SVG 内容；内部 fill 原样——
 *   脸 = currentColor（继承按钮 text-gray-900），
 *   Hate it 泪痕 = var(--ds-blue-700)，
 *   Love it! 爱心眼 = var(--ds-amber-800)。
 */

type FaceProps = React.SVGProps<SVGSVGElement>;

function FeedbackHateFace(props: FaceProps) {
  return (
    <svg {...props} viewBox="0 0 16 16" height="16" width="16" data-slot="geist-icon" style={{ color: "currentcolor" }}>
      <path fill="var(--ds-blue-700)" fillRule="evenodd" d="M4 9v7h1.5V9zm8 0v7h-1.5V9z" clipRule="evenodd" />
      <path fill="currentColor" fillRule="evenodd" d="M1.5 8A6.5 6.5 0 1 1 13 12.15v2.1A7.99 7.99 0 0 0 8 0a8 8 0 0 0-5 14.25v-2.1A6.5 6.5 0 0 1 1.5 8M8 14.5q.78 0 1.5-.17v1.53a8 8 0 0 1-3 0v-1.53q.72.17 1.5.17M3.79 8.37a2.04 2.04 0 0 1 2.92 0L7.8 7.32a3.54 3.54 0 0 0-5.08 0zm6.96-.62c-.57 0-1.1.23-1.46.62L8.2 7.32a3.54 3.54 0 0 1 5.08 0L12.2 8.37a2 2 0 0 0-1.46-.62M6.25 12h3.5a1.75 1.75 0 1 0-3.5 0" clipRule="evenodd" />
    </svg>
  );
}

function FeedbackNotGreatFace(props: FaceProps) {
  return (
    <svg {...props} viewBox="0 0 16 16" height="16" width="16" data-slot="geist-icon" style={{ color: "currentcolor" }}>
      <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 7.88c1.47 0 2.76.75 3.52 1.88l.35.52-1.04.7-.34-.52a3 3 0 0 0-4.97 0l-.35.51-1.04-.7.35-.51A4.2 4.2 0 0 1 8 9.38M5.75 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5" />
    </svg>
  );
}

function FeedbackOkayFace(props: FaceProps) {
  return (
    <svg {...props} viewBox="0 0 16 16" height="16" width="16" data-slot="geist-icon" style={{ color: "currentcolor" }}>
      <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m3.87 8.83-.35.52a4.24 4.24 0 0 1-7.04 0l-.35-.51 1.04-.7.35.52a3 3 0 0 0 4.97 0l.34-.53zM5.75 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5" />
    </svg>
  );
}

function FeedbackLoveFace(props: FaceProps) {
  return (
    <svg {...props} viewBox="0 0 16 16" height="16" width="16" data-slot="geist-icon" style={{ color: "currentcolor" }}>
      <path fill="currentColor" fillRule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-11.5.97h-.62v.63c0 1.87 1.93 3.26 4.12 3.26s4.13-1.38 4.13-3.26v-.63H4.5M8 11.61c-1.4 0-2.36-.66-2.72-1.38h5.44c-.36.72-1.31 1.38-2.72 1.38" clipRule="evenodd" />
      <path fill="var(--ds-amber-800)" fillRule="evenodd" d="M6.15 4.92 5.37 3.5 4.6 4.92l-1.6.3 1.12 1.17L3.9 8l1.47-.7 1.46.7-.2-1.6 1.11-1.18zm5.25 0-.78-1.42-.77 1.42-1.6.3 1.12 1.17L9.16 8l1.47-.7 1.46.7-.2-1.6L13 5.21z" clipRule="evenodd" />
    </svg>
  );
}

export { FeedbackHateFace, FeedbackLoveFace, FeedbackNotGreatFace, FeedbackOkayFace };

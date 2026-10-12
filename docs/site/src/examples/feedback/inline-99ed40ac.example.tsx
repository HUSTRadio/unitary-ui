import { Feedback } from "@hustradio/unitary-ui";

export function FeedbackInline99ED40ACExample() {
  // 官方 demo 将胶囊在演示区水平居中（flex justify-center），保持一致。
  return (
    <div className="flex justify-center">
      <Feedback dryRun type="inline" />
    </div>
  );
}

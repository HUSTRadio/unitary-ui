import { useState } from "react";

import { Feedback } from "@/components/ui/feedback";

/**
 * 非 dryRun 的主题演示：真实提交后才渲染收据，证明 topic 确实经 onSubmit 的第 4 个
 * 参数交付（而不是被悄悄合并进 metadata）。
 */
export function FeedbackFeedbackWithTopics7C41E2ABExample() {
  const [receipt, setReceipt] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Feedback
        label="unitary"
        showTopics
        onSubmit={(rating, text, metadata, topic) => {
          setReceipt(
            `rating=${rating ?? "none"} · topic=${topic ?? "none"} · metadata=${JSON.stringify(metadata ?? {})} · text=${text || "empty"}`,
          );
        }}
      />
      <output data-slot="feedback-topics-receipt" className="text-copy-13 text-muted-foreground">
        {receipt ?? "Submit the panel to see what onSubmit receives."}
      </output>
    </div>
  );
}

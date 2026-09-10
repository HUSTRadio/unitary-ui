import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

const COPY = {
  en: {
    behind: "Rabbit position: behind the fence.",
    over: "Rabbit position: over the fence.",
  },
  "zh-CN": {
    behind: "兔子位置：栅栏后面。",
    over: "兔子位置：已跳过栅栏。",
  },
} as const;

export function ToastUndoA8283ADEExample() {
  const toasts = useToasts();
  const { locale } = useI18n();
  const [jumped, setJumped] = useState(false);
  const copy = COPY[locale];

  return (
    <div className="flex w-full flex-col gap-3">
      <Button
        typeName="button"
        onClick={() => {
          setJumped(true);
          // onUndoAction renders the localized built-in "Undo" label and keeps
          // the toast on screen longer (7s) so the user can actually undo.
          toasts.message({
            text: "The Evil Rabbit jumped over the fence.",
            onUndoAction: () => setJumped(false),
          });
        }}
      >
        Show Toast
      </Button>
      <p
        className="text-copy-14 text-gray-900"
        data-demo="fence-state"
        data-position={jumped ? "over" : "behind"}
      >
        {jumped ? copy.over : copy.behind}
      </p>
    </div>
  );
}

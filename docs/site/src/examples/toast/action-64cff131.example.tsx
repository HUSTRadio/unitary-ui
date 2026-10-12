import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

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

export function ToastAction64CFF131Example() {
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
          toasts.message({
            text: "The Evil Rabbit jumped over the fence.",
            action: "Undo",
            onAction: () => setJumped(false),
          });
        }}
      >
        Show Toast
      </Button>
      <p
        className="text-copy-14 text-muted-foreground"
        data-demo="fence-state"
        data-position={jumped ? "over" : "behind"}
      >
        {jumped ? copy.over : copy.behind}
      </p>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import { AnimatePresence, motion, MotionProvider, useMotionTransition } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

function StatePanel() {
  const [shown, setShown] = useState(true);
  const transition = useMotionTransition("state");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div className="w-full space-y-4" data-motion-demo>
      <Button typeName="button" type="secondary" data-motion-toggle onClick={() => setShown(!shown)}>
        {zh ? "切换内容" : "Toggle Content"}
      </Button>
      <div className="flex min-h-24 items-center">
        <AnimatePresence initial={false}>
          {shown && (
            <motion.div
              key="content"
              data-motion-content
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={transition}
              className="w-full rounded-lg border border-border bg-background p-4 text-copy-14"
            >
              {zh ? "内容遵循状态切换时序 token 和你的动画偏好。" : "Content follows the state timing token and your motion preference."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MotionExample() {
  return <MotionProvider><StatePanel /></MotionProvider>;
}

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { HituPlayer, type HituPlayerRef } from "@/components/ui/hitu-player";
import { HituBox, HituFile } from "@/vendor/hitu/assets";
import { MotionProvider, motion, useMotionTransition } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

const shapes = [
  {
    source: HituFile, x: 160, y: 32, scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0,
    frames: [{ frame: 0, y: 32 }, { frame: 60, y: 96 }, { frame: 119, y: 32 }],
  },
  { source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0 },
];

function Illustration({ autoPlay }: { autoPlay: boolean }) {
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const transition = useMotionTransition("feedback");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div data-motion-hitu-demo className="w-full">
      <EmptyState
        className="px-4 py-6"
        title={zh ? "暂无文件" : "No Files Yet"}
        description={zh ? "添加文件，开始整理你的工作区。" : "Add a file to start organizing your workspace."}
        icon={
          <motion.div
            initial={transition.skipAnimations ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: playing ? -4 : 0 }}
            transition={transition}
            className="w-60 max-w-full"
          >
            <HituPlayer
              ref={player}
              width={512}
              height={512}
              frames={120}
              shapes={shapes}
              defaultPlay={autoPlay}
              loop={loop}
              onPlay={setPlaying}
              className="block h-auto w-full"
            />
          </motion.div>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button typeName="button" size="small" data-motion-play onClick={() => player.current?.triggerMotion(true)}>
            {zh ? "播放" : "Play"}
          </Button>
          <Button typeName="button" type="secondary" size="small" data-motion-pause onClick={() => player.current?.triggerMotion(false)}>
            {zh ? "暂停" : "Pause"}
          </Button>
          <Button typeName="button" type="secondary" size="small" data-motion-replay onClick={() => {
            player.current?.setFrame(0);
            player.current?.triggerMotion(true);
          }}>
            {zh ? "重播" : "Replay"}
          </Button>
          <Checkbox checked={loop} data-motion-loop onChange={() => setLoop(!loop)}>
            {zh ? "循环" : "Loop"}
          </Checkbox>
        </div>
        <p role="status" className="text-label-12 text-muted-foreground">
          {playing ? (zh ? "正在播放" : "Playing") : (zh ? "已暂停" : "Paused")}
        </p>
      </EmptyState>
    </div>
  );
}

export default function HituPlayerExample({ autoPlay = false }: { autoPlay?: boolean }) {
  return <MotionProvider><Illustration autoPlay={autoPlay} /></MotionProvider>;
}

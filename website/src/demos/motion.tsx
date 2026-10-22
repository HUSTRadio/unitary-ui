import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Button, HituBox, HituFile, HituPlayer, motion, useMotionTransition, type HituPlayerRef } from "@hustradio/unitary-ui";
import { useWebsiteLanguage } from "../language";

// The same shipped illustrations and timeline used by the living docs example.
const shapes = [
  { source: HituFile, x: 160, y: 32, scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0, frames: [{ frame: 0, y: 32 }, { frame: 60, y: 96 }, { frame: 119, y: 32 }] },
  { source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0 },
];

export default function MotionDemo({ active }: { active: boolean }) {
  const zh = useWebsiteLanguage().language === "zh-CN";
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(true);
  const transition = useMotionTransition("state");
  useEffect(() => { if (!active) player.current?.triggerMotion(false); }, [active]);
  return <div className="website-motion" data-slot="motion-demo">
    <div className="website-illustration">
      <HituPlayer ref={player} width={512} height={512} frames={120} shapes={shapes} defaultPlay={false} loop={false} onPlay={setPlaying} aria-label={zh ? "文件与盒子插画" : "File and box illustration"} />
    </div>
    <div className="website-button-row">
      <Button typeName="button" onClick={() => player.current?.triggerMotion(true)} disabled={transition.skipAnimations}>{zh ? "播放" : "Play"}</Button>
      <Button typeName="button" type="secondary" onClick={() => player.current?.triggerMotion(false)}>{zh ? "暂停" : "Pause"}</Button>
      <Button typeName="button" type="secondary" disabled={transition.skipAnimations} onClick={() => { player.current?.setFrame(0); player.current?.triggerMotion(true); }}>{zh ? "重播" : "Replay"}</Button>
    </div>
    <p role="status" className="website-inline-status">{transition.skipAnimations ? (zh ? "减少动画：静态展示" : "Reduced motion: static illustration") : playing ? (zh ? "正在播放" : "Playing") : (zh ? "已暂停" : "Paused")}</p>
    <div className="website-state-demo">
      <Button typeName="button" type="tertiary" onClick={() => setShown(value => !value)}>{zh ? "切换内容" : "Toggle content"}</Button>
      <div className="website-state-stage"><AnimatePresence initial={false}>
        {shown && <motion.p key="state" data-slot="website-motion-content" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={transition}>
          {zh ? "交互有节奏，内容有分寸。" : "A little motion. A clear intention."}
        </motion.p>}
      </AnimatePresence></div>
    </div>
  </div>;
}

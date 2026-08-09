import * as React from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Video — 视频播放器容器（对应官方 Video，docs/geist-markdown-refs/components/video.md 简化版）。
 * 容器：8px 圆角 + overflow-hidden + 发丝线边框 + bg-background。
 * video 元素 w-full；底部 VideoControls 带 Play/Pause 切换。
 */
interface VideoProps {
  src: string;
  poster?: string;
  /** 是否渲染底部控制条，默认 true */
  controls?: boolean;
  className?: string;
}

function Video({ src, poster, controls = true, className }: VideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full"
        playsInline
        onClick={toggle}
      />
      {controls ? <VideoControls playing={playing} onToggle={toggle} /> : null}
    </div>
  );
}

interface VideoControlsProps {
  playing: boolean;
  onToggle: () => void;
  className?: string;
}

function VideoControls({ playing, onToggle, className }: VideoControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-gray-alpha-400 p-2",
        className,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex size-8 items-center justify-center rounded-md text-foreground transition-colors outline-none hover:bg-gray-alpha-100 focus-ring"
      >
        {playing ? (
          <Pause className="size-4" aria-hidden />
        ) : (
          <Play className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

export { Video, VideoControls };

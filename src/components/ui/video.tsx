import * as React from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Video — 视频播放器容器（对应官方 Video，docs/geist-markdown-refs/components/video.md 简化版）。
 * 容器：8px 圆角 + overflow-hidden + 发丝线边框 + bg-background。
 * video 元素填满固定宽高比容器；控制层在 hover/focus 或窄屏下显示。
 */
interface VideoProps {
  src: string;
  poster?: string;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  lazy?: boolean;
  autoPlay?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  preload?: React.VideoHTMLAttributes<HTMLVideoElement>["preload"];
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}

function Video({
  src,
  poster,
  controls = true,
  loop = true,
  muted = true,
  lazy = true,
  autoPlay = false,
  width,
  height,
  className,
  style,
  preload,
}: VideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const togglePlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  return (
    <div
      data-slot="video"
      className={cn("group relative w-full overflow-hidden rounded-[8px] bg-black", className)}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
        maxWidth: width,
        ...style,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width={width}
        height={height}
        loop={loop}
        muted={muted}
        autoPlay={autoPlay}
        preload={preload ?? (lazy ? "none" : "metadata")}
        className="block size-full object-cover"
        playsInline
        onClick={togglePlayback}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {controls ? (
        <div className="pointer-events-none absolute inset-x-[5%] bottom-[5%] flex h-12 items-center gap-3 rounded-[8px] bg-background-100 px-3 text-gray-1000 opacity-0 shadow-[var(--material-shadow-menu)] transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 max-[992px]:pointer-events-auto max-[992px]:opacity-100">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause" : "Play"}
            className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-transparent outline-none hover:bg-gray-alpha-200 focus-ring"
          >
            {playing ? (
              <Pause className="size-4 fill-current" aria-hidden />
            ) : (
              <Play className="size-4 fill-current" aria-hidden />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            aria-label="Video progress"
            className="pointer-events-auto h-1 min-w-0 flex-1 cursor-pointer accent-foreground"
          />
          <span className="shrink-0 text-label-13-mono tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { Video };

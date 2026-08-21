import * as React from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Video — 视频播放器容器（对应官方 Video，docs/geist-markdown-refs/components/video.md）。
 * 容器：8px 圆角 + overflow-hidden + bg-black；video 元素填满固定宽高比容器。
 * 控制层（官方实测对齐）：
 * - bar：absolute bottom-[5%] w-[85%] h-12，bg-background rounded-md，tooltip 阴影，
 *   hover/focus 或窄屏（max-[992px]）下显示
 * - play button：size-10（40px），svg 16x16，无 aria-label（与官方一致）
 * - time：mm:ss（'00:00'）13px tabular-nums，当前时间 + 总时长
 * - progress：原生 <progress max={100}> h-1 rounded-[5px] + 可点击轨道 + size-2.5 拇指点
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
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
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
  const trackRef = React.useRef<HTMLDivElement>(null);
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

  const seekByClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    const track = trackRef.current;
    if (!el || !track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const next = ratio * duration;
    el.currentTime = next;
    setCurrentTime(next);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

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
        <div
          role="region"
          aria-label="Video player"
          className="pointer-events-none absolute bottom-[5%] left-1/2 flex h-12 w-[85%] -translate-x-1/2 items-center rounded-md bg-background px-2 text-gray-1000 opacity-0 shadow-[var(--material-shadow-tooltip)] transition-all group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 max-[992px]:pointer-events-auto max-[992px]:opacity-100"
        >
          <button
            type="button"
            onClick={togglePlayback}
            className="pointer-events-auto flex size-10 shrink-0 items-center justify-center bg-transparent text-gray-1000 outline-none focus-visible:rounded-sm focus-ring"
          >
            {playing ? (
              <Pause className="size-4 fill-current" aria-hidden />
            ) : (
              <Play className="size-4 fill-current" aria-hidden />
            )}
          </button>
          <div className="pl-0 text-[13px] leading-10 px-3 flex-[0_0_auto] tabular-nums w-[60px] text-center">
            {formatTime(currentTime)}
          </div>
          <div
            ref={trackRef}
            onClick={seekByClick}
            className="pointer-events-auto relative flex h-[18px] min-w-0 flex-1 cursor-pointer items-center"
          >
            <progress
              max={100}
              value={progressPercent}
              aria-label="Video progress"
              className="h-1 w-full appearance-none overflow-hidden rounded-[5px] [&::-moz-progress-bar]:bg-foreground [&::-webkit-progress-bar]:bg-gray-alpha-200 [&::-webkit-progress-value]:rounded-[5px] [&::-webkit-progress-value]:bg-foreground"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_0_1px_var(--color-background)]"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[13px] leading-10 px-3 flex-[0_0_auto] tabular-nums w-[60px] text-center">
            {formatTime(duration)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Video };

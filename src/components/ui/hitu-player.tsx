import * as React from "react";

import { useMotionReduced } from "@/lib/motion-policy";
import { HituLayer } from "@/vendor/hitu/layer";
import type { HituShape } from "@/vendor/hitu/types";

export type { HituFrame, HituShape, HituShapeSource } from "@/vendor/hitu/types";

export interface HituPlayerProps extends Omit<React.SVGProps<SVGSVGElement>, "ref" | "width" | "height" | "onPlay"> {
  /** SVG canvas coordinates. CSS can resize the resulting viewport. */
  width: number;
  height: number;
  shapes: readonly HituShape[];
  /** Total frame count on the 60 fps timeline; zero-frame scenes remain static. */
  frames?: number;
  defaultFrame?: number;
  defaultPlay?: boolean;
  loop?: boolean;
  /** Reports effective playback, including visibility and reduced-motion pauses. */
  onPlay?: (play: boolean) => void;
  onFrame?: (frame: number) => void;
}

export interface HituPlayerRef {
  /** Omit the argument to toggle requested playback. Playing at the end replays. */
  triggerMotion: (play?: boolean) => void;
  setFrame: (frame: number) => void;
  getFramerInfo: () => { play: boolean; frame: number };
}

function lastFrame(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function clampFrame(value: number, frames: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(Math.max(0, frames - 1), Math.floor(value))) : 0;
}

/**
 * React 19 adaptation of ant-design/HiTu's SVG layer and RAF player.
 * See src/vendor/hitu/SOURCE.md and LICENSE for the pinned upstream source.
 */
export const HituPlayer = /* @__PURE__ */ React.forwardRef<HituPlayerRef, HituPlayerProps>(function HituPlayer({
  width, height, shapes, frames = 0, defaultFrame = 0, defaultPlay = false,
  loop = false, onPlay, onFrame, ...svgProps
}, forwardedRef) {
  const frameCount = lastFrame(frames);
  const [initialFrame] = React.useState(() => lastFrame(defaultFrame));
  const sceneInitialFrame = clampFrame(initialFrame, frameCount);
  const [frame, setCurrentFrame] = React.useState(() => sceneInitialFrame);
  const frameRef = React.useRef(frame);
  const [requested, setRequested] = React.useState(defaultPlay);
  const requestedRef = React.useRef(defaultPlay);
  const playingRef = React.useRef(false);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [inViewport, setInViewport] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(false);
  const reduced = useMotionReduced();
  const effectivePlay = requested && frameCount > 0 && inViewport && pageVisible && !reduced;
  const displayedFrame = reduced ? sceneInitialFrame : clampFrame(frame, frameCount);
  const sceneRef = React.useRef({ shapes, frameCount });
  const clock = React.useRef<{ time: number | undefined; remainder: number }>({ time: undefined, remainder: 0 });
  const revision = React.useRef(0);
  const callbacks = React.useRef({ onPlay, onFrame });
  const reportedFrame = React.useRef<number | undefined>(undefined);
  React.useEffect(() => { callbacks.current = { onPlay, onFrame }; }, [onPlay, onFrame]);

  const updateFrame = React.useCallback((next: number) => {
    frameRef.current = next;
    setCurrentFrame(next);
  }, []);

  const requestPlayback = React.useCallback((play: boolean) => {
    if (requestedRef.current !== play) revision.current += 1;
    if (!play) playingRef.current = false;
    requestedRef.current = play;
    setRequested(play);
  }, []);

  React.useImperativeHandle(forwardedRef, () => ({
    triggerMotion(play = !requestedRef.current) {
      if (reduced && play) return;
      if (play && frameRef.current >= frameCount - 1) {
        updateFrame(sceneInitialFrame < frameCount - 1 ? sceneInitialFrame : 0);
        revision.current += 1;
        clock.current = { time: undefined, remainder: 0 };
      }
      requestPlayback(play);
    },
    setFrame(next) {
      if (reduced) return;
      revision.current += 1;
      updateFrame(clampFrame(next, frameCount));
      clock.current = { time: undefined, remainder: 0 };
    },
    getFramerInfo() {
      return { play: playingRef.current, frame: reduced ? sceneInitialFrame : clampFrame(frameRef.current, frameCount) };
    },
  }), [frameCount, reduced, requestPlayback, sceneInitialFrame, updateFrame]);

  React.useEffect(() => {
    const svg = svgRef.current;
    const owner = svg?.ownerDocument;
    const view = owner?.defaultView;
    if (!svg || !owner || !view) return;
    let active = true;
    const visibility = () => { if (active) setPageVisible(!owner.hidden); };
    visibility();
    owner.addEventListener("visibilitychange", visibility);
    const Observer = view.IntersectionObserver;
    const observer = Observer ? new Observer((entries) => {
      if (!active) return;
      const entry = entries.find((item) => item.target === svg);
      if (entry) setInViewport(entry.isIntersecting);
    }) : undefined;
    if (observer) observer.observe(svg);
    else setInViewport(true);
    return () => {
      active = false;
      observer?.disconnect();
      owner.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  React.useEffect(() => {
    const previous = sceneRef.current;
    if (previous.shapes !== shapes) updateFrame(sceneInitialFrame);
    else if (previous.frameCount !== frameCount) updateFrame(clampFrame(frameRef.current, frameCount));
    sceneRef.current = { shapes, frameCount };
    revision.current += 1;
    clock.current = { time: undefined, remainder: 0 };
  }, [shapes, frameCount, sceneInitialFrame, updateFrame]);

  React.useEffect(() => {
    if (reduced) updateFrame(sceneInitialFrame);
  }, [reduced, sceneInitialFrame, updateFrame]);

  React.useEffect(() => {
    const view = svgRef.current?.ownerDocument.defaultView;
    if (!effectivePlay || !view) {
      playingRef.current = false;
      return;
    }
    let active = true;
    let scheduled: number;
    playingRef.current = true;
    clock.current = { time: undefined, remainder: 0 };
    const tick = (time: number) => {
      if (!active) return;
      const previous = clock.current;
      const elapsed = previous.time === undefined ? 0 : Math.max(0, time - previous.time);
      const total = previous.remainder + elapsed * 60 / 1000;
      const advance = Math.floor(total + 1e-8);
      clock.current = { time, remainder: Math.max(0, total - advance) };
      const version = revision.current;
      // Preserve HiTu's per-frame callbacks even when a browser RAF skips
      // timeline frames. A callback can pause, seek, replace or unmount us.
      for (let step = 0; step < advance && active && requestedRef.current && version === revision.current; step += 1) {
        let next = frameRef.current + 1;
        if (next >= frameCount) {
          if (!loop) {
            playingRef.current = false;
            requestPlayback(false);
            return;
          }
          next = 0;
        }
        updateFrame(next);
        reportedFrame.current = next;
        callbacks.current.onFrame?.(next);
      }
      if (active && requestedRef.current) scheduled = view.requestAnimationFrame(tick);
    };
    scheduled = view.requestAnimationFrame(tick);
    return () => {
      active = false;
      playingRef.current = false;
      view.cancelAnimationFrame(scheduled);
    };
  }, [effectivePlay, frameCount, loop, shapes, requestPlayback, updateFrame]);

  const reportedPlay = React.useRef(false);
  React.useEffect(() => {
    if (reportedPlay.current === effectivePlay) return;
    reportedPlay.current = effectivePlay;
    callbacks.current.onPlay?.(effectivePlay);
  }, [effectivePlay]);
  React.useEffect(() => {
    if (reportedFrame.current === displayedFrame) return;
    reportedFrame.current = displayedFrame;
    callbacks.current.onFrame?.(displayedFrame);
  }, [displayedFrame]);

  const named = Boolean(svgProps["aria-label"] || svgProps["aria-labelledby"]);
  return (
    <svg
      {...svgProps}
      ref={svgRef}
      width={width}
      height={height}
      viewBox={svgProps.viewBox ?? `0 0 ${width} ${height}`}
      role={svgProps.role ?? (named ? "img" : undefined)}
      aria-hidden={svgProps["aria-hidden"] ?? (named ? undefined : true)}
      data-slot="hitu-player"
      data-frame={displayedFrame}
      data-playing={effectivePlay}
    >
      {shapes.map((shape, index) => <HituLayer key={index} shape={shape} frame={displayedFrame} index={index} />)}
      {svgProps.children}
    </svg>
  );
});

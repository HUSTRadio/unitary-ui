import MotionDemo from "../../docs/site/src/examples/motion/default.example";
import HituDemo from "../../docs/site/src/examples/hitu-player/default.example";

export function MotionExample() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-heading-24">交互动效 · Interaction motion</h2>
        <p className="text-copy-14 text-muted-foreground">
          状态切换沿用现有时序与减少动画偏好。 / State changes use existing timing and reduced-motion preferences.
        </p>
        <MotionDemo />
      </section>
      <section className="space-y-3">
        <h2 className="text-heading-24">Hitu 插画 · Hitu illustration</h2>
        <HituDemo />
      </section>
    </div>
  );
}

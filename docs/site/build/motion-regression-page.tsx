import { createRoot } from "react-dom/client";
import { Button, ThemeProvider, useTheme } from "@hustradio/unitary-ui";
import { MotionRegressionFixture } from "./motion-regression-fixture";
import "../src/index.css";

function Page() {
  const { setPreference, setTexture } = useTheme();
  return <main style={{ padding: "calc(var(--spacing) * 4)", minHeight: "200dvh" }}>
    <h1>Motion device verification / 动画真机验收</h1>
    <p>Animations play normally. Change reduced motion in system settings. / 动画正常播放；请在系统设置中切换减少动画。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "calc(var(--spacing) * 2)", marginBlock: "calc(var(--spacing) * 4)" }}>
      <Button onClick={() => setPreference("light")}>Light</Button>
      <Button onClick={() => setPreference("dark")}>Dark</Button>
      {(["solid", "acrylic", "glass"] as const).map(texture =>
        <Button key={texture} onClick={() => setTexture(texture)}>{texture}</Button>)}
    </div>
    <div data-motion-regression style={{ width: "min(600px,100%)", background: "var(--background)" }}>
      <MotionRegressionFixture manual />
    </div>
    <p>The red images use a blue backing to expose gaps. The slow toast viewport deliberately exits in 400ms.</p>
    <p>红图下方为蓝色底，用于观察透底；慢通知视口故意使用 400ms 退出。向下滚动可检查浮层滚动锁。</p>
  </main>;
}

createRoot(document.getElementById("root")!).render(<ThemeProvider><Page /></ThemeProvider>);

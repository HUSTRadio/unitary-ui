import { Badge, Button, RadioGroup, RadioGroupItem, ThemeSwitcher, Toolbar, ToolbarGroup, ToolbarItem, Tabs, Switch, SwitchControl, Toggle, useTheme, type TexturePreference } from "@hustradio/unitary-ui";
import { useState } from "react";
import { useWebsiteLanguage } from "../language";

const textures = ["solid", "acrylic", "aero", "glass"] as const;
const textureLabels = { solid: "Solid", acrylic: "Acrylic", aero: "Aero", glass: "Glass" } as const;

export default function AppearanceDemo() {
  const zh = useWebsiteLanguage().language === "zh-CN";
  const { texture, resolvedTexture, setTexture } = useTheme();
  const [variant, setVariant] = useState("regular");
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState("one"), [mode, setMode] = useState("one"), [preview, setPreview] = useState(false);
  return <div className="website-appearance" data-slot="appearance-demo">
    <div className="website-appearance-controls">
      <div><p className="website-demo-label">{zh ? "显示主题" : "Display theme"}</p><ThemeSwitcher /></div>
      <fieldset><legend className="website-demo-label">{zh ? "材质" : "Texture"}</legend>
        <RadioGroup name="website-texture" value={texture} onChange={value => setTexture(value as TexturePreference)} className="website-texture-options" aria-label={zh ? "材质" : "Texture"}>
          {textures.map(value => <RadioGroupItem key={value} value={value} className="website-texture-option">{textureLabels[value]}</RadioGroupItem>)}
        </RadioGroup>
      </fieldset>
    </div>
    {texture === "glass" && <div className="website-glass-variants" role="group" aria-label={zh ? "玻璃用途" : "Glass purpose"}>
      {(["clear", "regular", "dense"] as const).map(value=><Button key={value} type="secondary" aria-pressed={variant===value} onClick={()=>setVariant(value)}>{value === "clear" ? "Clear" : value === "regular" ? "Regular" : "Dense"}</Button>)}
    </div>}
    <div className="website-material-stage">
      <div className="website-refraction-grid" aria-hidden="true" />
      <div className="website-material-wrap" data-glass-variant={texture === "glass" ? variant : "regular"}>
      {texture === "glass" && variant !== "dense" && <div className="website-glass-backing" aria-hidden="true" />}
      {texture === "glass" && variant === "clear" ? <Button type="secondary" className="material-glass-clear relative" onClick={() => setPlaying(!playing)}>{playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")} · 00:42</Button>
        : texture === "glass" && variant === "regular" ? <div className="relative grid gap-4 p-4">
          <Toolbar aria-label={zh ? "媒体操作" : "Media actions"}><ToolbarGroup><ToolbarItem label={playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")} active={playing} onSelect={() => setPlaying(!playing)} /></ToolbarGroup></Toolbar>
          <Tabs variant="secondary" ariaLabel={zh ? "媒体分类" : "Media category"} tabs={[{title:zh?"全部":"All",value:"one"},{title:zh?"收藏":"Saved",value:"two"}]} selected={view} setSelected={setView} />
          <Switch name="appearance-mode" value={mode} onValueChange={setMode}><SwitchControl value="one" label={zh?"列表":"List"} /><SwitchControl value="two" label={zh?"网格":"Grid"} /></Switch>
          <Toggle checked={preview} onChange={() => setPreview(!preview)}>{zh?"预览":"Preview"}</Toggle>
        </div> : <>
      <div className={`material-menu website-material-panel material-glass-${variant}`} data-material="floating">
        {variant === "clear" && texture === "glass" ? <div className="website-glass-media-controls"><Button type="tertiary" onClick={()=>setPlaying(!playing)}>{playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")}</Button><span>00:42</span></div> : <>
        <Badge variant="outline" size="compact">{zh ? "真实材质" : "Live material"}</Badge>
        <h3>{zh ? "让内容保持清晰。" : "Keep the content clear."}</h3>
        <p>{zh ? "背景表达层次，文字与操作保持可读。" : "Depth in the background. Clarity in the content."}</p>
        <Button typeName="button" type="secondary" onClick={() => setTexture(textures[(textures.indexOf(texture) + 1) % textures.length])}>{zh ? "切换材质" : "Change texture"}</Button>
        </>}
      </div>
      </>}
      </div>
    </div>
    <p className="website-inline-status">{texture === "glass" ? (zh ? "Clear 用于媒体短标签；Regular 增透并响应指针和按压，此处提供均匀衬底；Dense 保护文字阅读。" : "Clear for short media labels; more transparent Regular responds to direction and press, with uniform backing here; Dense protects reading.") : (zh ? "同一场景切换四种材质，比较背景透射、模糊与边缘高光。" : "Compare background transmission, blur and edge highlights across four materials in the same scene.")}</p>
    <p className="website-inline-status" role="status">{zh ? "实际外观" : "Applied texture"}: {textureLabels[resolvedTexture]}{texture !== resolvedTexture && (zh ? " · 当前浏览器或辅助功能偏好使用 Solid" : " · Browser or accessibility preferences require Solid")}</p>
  </div>;
}

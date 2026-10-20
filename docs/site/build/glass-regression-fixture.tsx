import { StrictMode, useLayoutEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  Button, ThemeProvider, MotionProvider, useTheme, Toolbar, ToolbarGroup, ToolbarItem, Select, SelectItem,
  MenuContainer, MenuButton, Menu, MenuItem, Modal, ModalTrigger, ModalContent, ModalTitle, ModalDescription,
  Drawer, DrawerTitle, DrawerDescription, Tabs, Switch, SwitchControl, Toggle, Navbar, SiteNavigation, type TexturePreference,
} from "@hustradio/unitary-ui";
import "../src/index.css";
import "./glass-regression-fixture.css";

type Usage = "button" | "clear" | "regular" | "dense" | "tabs" | "switch" | "toggle" | "navigation";
declare global {
  interface Window {
    __glassFixture: {
      activate: (texture: TexturePreference) => void;
      addRoot: () => void;
      removeRoot: () => void;
      unmount: () => void;
    };
  }
}

const parameters = new URLSearchParams(location.search);
const usage = (parameters.get("usage") ?? "regular") as Usage;
let extraRoot: Root | undefined;
let extraHost: HTMLDivElement | undefined;
const root = createRoot(document.getElementById("root")!);
const removeRoot = () => { extraRoot?.unmount(); extraRoot = undefined; extraHost?.remove(); extraHost = undefined; };

function Fixture() {
  const { setTexture, resolvedTexture } = useTheme();
  const [playing, setPlaying] = useState(false), [pinned, setPinned] = useState(false);
  const [value, setValue] = useState("item-0"), [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState("one"), [choice, setChoice] = useState("one"), [checked, setChecked] = useState(false);
  const drawerTrigger = useRef<HTMLButtonElement>(null);
  const chromeClass = parameters.get("chrome") === "filter" ? "backdrop-blur-none" : parameters.get("chrome") === "fill" ? "bg-red-500" : "";
  const panelClass = parameters.get("panel") === "fill" ? "bg-red-500" : parameters.get("panel") === "filter" ? "backdrop-blur-none" : undefined;
  useLayoutEffect(() => {
    window.__glassFixture = {
      activate: setTexture,
      addRoot() {
        if (extraRoot) return;
        extraHost = document.createElement("div"); document.body.append(extraHost); extraRoot = createRoot(extraHost);
        extraRoot.render(<StrictMode><ThemeProvider defaultTexture="glass"><div className="material-menu" data-material="floating" style={{ width:120,height:80,borderRadius:12 }} /></ThemeProvider></StrictMode>);
      },
      removeRoot,
      unmount() { root.unmount(); },
    };
    document.documentElement.dataset.glassFixtureReady = "true";
  }, [setTexture]);
  useLayoutEffect(() => {
    // Record actual React state commits, without changing production components.
    window.dispatchEvent(new CustomEvent("glass-fixture:commit", { detail: { playing,pinned,value,tab,choice,checked,texture:resolvedTexture } }));
  }, [playing,pinned,value,tab,choice,checked,resolvedTexture]);
  return <main className="glass-fixture" data-usage={usage}>
    <div className="glass-fixture-controls">
      <Button type="tertiary" onClick={() => setTexture("solid")}>Solid</Button>
      <Button type="tertiary" onClick={() => setTexture("acrylic")}>Acrylic</Button>
      <Button type="tertiary" onClick={() => setTexture("aero")}>Aero</Button>
      <Button type="tertiary" onClick={() => setTexture("glass")}>Glass</Button>
    </div>
    <div className="glass-fixture-stage" data-testid="scroll-stage">
      <div className="glass-fixture-landscape">
        <div className="glass-fixture-sticky">
          {["tabs","switch","toggle"].includes(usage) && <div className="glass-fixture-reading-backing" aria-hidden="true" />}
          {usage === "navigation" ? <Navbar scrollBehavior="auto-hide" forceVisible height={72} className={`glass-fixture-navbar ${chromeClass}`}>
            <SiteNavigation panelClassName={panelClass} desktopBreakpoint={768} label="Fixture navigation" items={[{id:"browse",label:"Browse",groups:[{title:"Explore",links:[{label:"Photo collection",href:"#photos",description:"Explore the collection"}]}]},{id:"about",label:"About",href:"#about"}]} />
            <Button type="secondary">Header action</Button>
          </Navbar> : usage === "button" ? <Button type="secondary" className="material-glass-regular" data-testid="optical-owner" aria-pressed={pinned} onClick={() => setPinned(!pinned)}>Pin</Button> : usage === "clear" ? <div className="glass-fixture-media">
            <div className="glass-fixture-media-backing" data-testid="media-backing" />
            <Button type="secondary" className="material-glass-clear glass-fixture-media-surface" data-testid="optical-owner" aria-label="Playback" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"} · 00:42</Button>
          </div> : usage === "regular" ? <Toolbar className="material-glass-regular glass-fixture-toolbar" aria-label="Navigation" data-testid="optical-owner">
            <ToolbarGroup><ToolbarItem label="Pin" active={pinned} onSelect={() => setPinned(!pinned)} /><ToolbarItem label="Share" disabled /></ToolbarGroup>
          </Toolbar> : usage === "tabs" ? <Tabs variant="secondary" ariaLabel="Views" tabs={[{ title:"First view",value:"one" },{ title:"Second view",value:"two" }]} selected={tab} setSelected={setTab} />
            : usage === "switch" ? <Switch name="view" value={choice} onValueChange={setChoice}><SwitchControl value="one" label="First view" /><SwitchControl value="two" label="Second view" /></Switch>
            : usage === "toggle" ? <Toggle size="large" aria-label="Enable preview" checked={checked} onChange={() => setChecked(!checked)}>Preview</Toggle>
            : <Select aria-label="Choose file" value={value} onValueChange={setValue} className="glass-fixture-select">
            {Array.from({ length:30 }, (_,index) => <SelectItem key={index} value={`item-${index}`}>{`Project file ${String(index).padStart(2,"0")}`}</SelectItem>)}
          </Select>}
        </div>
      </div>
    </div>
    <output className="glass-fixture-status">{playing ? "Playing" : pinned ? "Pinned" : value}</output>
    {parameters.has("extras") && <div className="glass-fixture-extra">
      <MenuContainer><MenuButton variant="secondary">Open menu</MenuButton><Menu><MenuItem onSelect={() => setPinned(!pinned)}>Toggle pin</MenuItem><MenuItem disabled>Unavailable</MenuItem></Menu></MenuContainer>
      <Modal><ModalTrigger asChild><Button type="secondary">Open modal</Button></ModalTrigger><ModalContent><ModalTitle>File details</ModalTitle><ModalDescription>Dense reading surface.</ModalDescription><Button type="secondary">Nested action</Button></ModalContent></Modal>
      <Button ref={drawerTrigger} type="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
      <Drawer show={drawer} onDismiss={() => setDrawer(false)} restoreFocusTo={drawerTrigger} height={280}><DrawerTitle>Recent files</DrawerTitle><DrawerDescription>Dense drawer with a sampling boundary.</DrawerDescription><Button type="secondary">Drawer action</Button></Drawer>
    </div>}
  </main>;
}

root.render(<StrictMode><ThemeProvider defaultTexture="solid">{parameters.get("motion") === "reduced" ? <MotionProvider reducedMotion="always"><Fixture /></MotionProvider> : <Fixture />}</ThemeProvider></StrictMode>);

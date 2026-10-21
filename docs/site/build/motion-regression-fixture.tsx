import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  Button, Carousel, createToastStore, Toasts, Modal, ModalContent, ModalTitle, ModalDescription,
  Drawer, BottomSheet, ResponsiveDrawer, ResponsiveDrawerContent, ResponsiveDrawerTitle,
  ResponsiveDrawerDescription, ResponsiveDrawerTrigger, SidePanel, SidePanelTitle, SidePanelDescription, HamburgerMenu,
} from "@hustradio/unitary-ui";

const red = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path fill="red" d="M0 0h40v40H0z"/></svg>')}`;
const images = [0, 1, 2].map(i => ({ src: red, alt: `Red ${i}` }));

export function MotionRegressionFixture({ manual = false }: { manual?: boolean }) {
  const [store] = React.useState(createToastStore);
  const [panel, setPanel] = React.useState("");
  const [slow, setSlow] = React.useState(true);
  const reopenTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(reopenTimer.current), []);
  const Control = manual ? Button : "button";
  const close = manual ? <Button onClick={() => setPanel("")}>Close panel</Button> : null;
  return <>
    <div>{["modal", "drawer", "drawer-reject", "bottom-sheet", "side-panel", "side-panel-left", "expand-panel"].map(name =>
      <Control key={name} data-open={name} onClick={() => setPanel(value => value === name ? "" : name)}>{name}</Control>)}</div>
    <Control data-add-toast onClick={() => store.message({ text: "Motion toast", preserve: true })}>Add toast</Control>
    <Control data-dismiss-toast onClick={() => store.getSnapshot().forEach(item => store.dismiss(item.id))}>Dismiss toast</Control>
    <Control data-unmount-slow onClick={() => setSlow(value => manual ? !value : false)}>{manual ? "Toggle slow viewport" : "Unmount slow viewport"}</Control>
    <Toasts store={store} data-toast-view="fast" style={{ right: "8px", bottom: "8px" }} />
    {slow && <Toasts store={store} data-toast-view="slow" style={{ right: "8px", bottom: "100px", "--uni-duration-fast": "400ms" } as React.CSSProperties} />}
    <Carousel variant="fade-scale" images={images.map(image => ({ ...image }))} style={{ background: "blue" }} />
    <Modal open={panel === "modal"} onOpenChange={open => { if (!open) setPanel(""); }}>
      <ModalContent><ModalTitle>Motion modal</ModalTitle><ModalDescription>Test content</ModalDescription><Control onClick={() => setPanel("")}>Close</Control></ModalContent>
    </Modal>
    <Drawer show={panel === "drawer" || panel === "drawer-reject"} onDismiss={() => { if (panel !== "drawer-reject") setPanel(""); }} aria-label="Motion drawer"><div style={{ height: 200 }}>Drawer {close}</div></Drawer>
    <BottomSheet open={panel === "bottom-sheet"} onOpenChange={open => { if (!open) setPanel(""); }} aria-label="Motion bottom sheet">Sheet {close}</BottomSheet>
    <ResponsiveDrawer open={panel === "responsive-drawer"} onOpenChange={open => setPanel(open ? "responsive-drawer" : "")}>
      <ResponsiveDrawerTrigger asChild><Control data-open="responsive-drawer">responsive-drawer</Control></ResponsiveDrawerTrigger>
      <ResponsiveDrawerContent><ResponsiveDrawerTitle>Motion responsive drawer</ResponsiveDrawerTitle><ResponsiveDrawerDescription>Test content</ResponsiveDrawerDescription>{close}</ResponsiveDrawerContent>
    </ResponsiveDrawer>
    <SidePanel show={panel.startsWith("side-panel")} side={panel === "side-panel-left" ? "left" : "right"} onDismiss={() => setPanel("")}><SidePanelTitle>Motion side panel</SidePanelTitle><SidePanelDescription>Test content</SidePanelDescription>{close}</SidePanel>
    <HamburgerMenu anchor="sidebar" direction="left" open={panel === "expand-panel"} onOpenChange={open => { if (!open) setPanel(""); }} disableSearch showCloseButton={manual}
      toolbarLeft={manual ? <Button onClick={() => {
        setPanel("");
        window.clearTimeout(reopenTimer.current);
        // Deliberately reverse inside the default 150ms exit for device checks.
        reopenTimer.current = window.setTimeout(() => setPanel("expand-panel"), 50);
      }}>Close and reopen</Button> : undefined}
      items={[{ label: "Motion panel", to: "#motion-panel" }]} />
  </>;
}

export function mountMotionRegressionFixture() {
  const host = document.createElement("div");
  host.dataset.motionRegression = "";
  Object.assign(host.style, { position: "fixed", top: "80px", left: "8px", width: "min(600px,95vw)", zIndex: "90", background: "var(--background)" });
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(<MotionRegressionFixture />);
  return () => { root.unmount(); host.remove(); };
}

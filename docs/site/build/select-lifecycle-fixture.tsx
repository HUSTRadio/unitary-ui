import * as React from "react";
import { createRoot } from "react-dom/client";
import { Select, SelectItem } from "@hustradio/unitary-ui";

function SelectLifecycleFixture() {
  const [value, setValue] = React.useState("a");
  const [open, setOpen] = React.useState(false);
  const [blocked, setBlocked] = React.useState(false);
  const [declined, setDeclined] = React.useState(false);
  const [commits, setCommits] = React.useState(0);
  const [cycles, setCycles] = React.useState(0);
  const cancel = (event: React.SyntheticEvent) => { if (blocked) event.preventDefault(); };
  const items = () => <>
    <SelectItem value="a">Alpha</SelectItem>
    <SelectItem value="disabled" disabled>Unavailable</SelectItem>
    <SelectItem value="b" onPointerUp={cancel} onClick={cancel}
      onKeyDown={event => { if (["Enter", " "].includes(event.key)) cancel(event); }}>Beta</SelectItem>
  </>;
  return <section data-select-lifecycle="" data-controlled-open={String(open)} data-cycle={cycles}>
    <form aria-label="Uncontrolled form" onSubmit={event => event.preventDefault()}>
      <Select name="choice" label="Uncontrolled choice" defaultValue="a">{items()}</Select>
      <button type="reset">Reset choice</button>
    </form>
    <Select label="Controlled choice" value={value} open={open} onOpenChange={setOpen}
      onValueChange={next => { setCommits(count => count + 1); if (!declined) setValue(next); }}>{items()}</Select>
    <output data-select-value="">{value}</output>
    <output data-select-commits="">{commits}</output>
    <button type="button" onClick={() => {
      setOpen(false);
      requestAnimationFrame(() => { setOpen(true); setCycles(count => count + 1); });
    }}>Interrupt controlled close</button>
    <label><input type="checkbox" checked={blocked} onChange={event => setBlocked(event.target.checked)} />Cancel item selection</label>
    <label><input type="checkbox" checked={declined} onChange={event => setDeclined(event.target.checked)} />Decline controlled value</label>
    <Select label="Disabled choice" disabled defaultValue="a">{items()}</Select>
  </section>;
}

/** Public components only; opt-in browser fixture, outside product routes. */
export function mountSelectLifecycleFixture() {
  const host = document.createElement("div");
  Object.assign(host.style, { position: "fixed", inset: "80px 20px auto", maxWidth: "280px", zIndex: "999", padding: "16px", background: "var(--background)" });
  document.body.append(host);
  const root = createRoot(host);
  root.render(<React.StrictMode><SelectLifecycleFixture /></React.StrictMode>);
  return () => { root.unmount(); host.remove(); };
}

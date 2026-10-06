import * as React from "react";
import { createRoot } from "react-dom/client";

import { Toggle } from "../../../src/components/ui/toggle";

function MotionFixture() {
  const [values, setValues] = React.useState({ small: false, medium: false, large: false });
  const [disabled, setDisabled] = React.useState(false);
  return <>
    {(["small", "medium", "large"] as const).map((size) => <div key={size} data-test-toggle-size={size}>
      <Toggle checked={values[size]} size={size} disabled={disabled} aria-label={`Motion ${size}`}
        onChange={() => setValues((values) => ({ ...values, [size]: !values[size] }))} />
    </div>)}
    <button onClick={() => setDisabled((value) => !value)}>Change disabled state</button>
    <Toggle checked={false} aria-label="Declined controlled change" onChange={() => {}} />
    <form><Toggle defaultChecked aria-label="Native motion reset" size="medium" />
      <button type="reset">Reset native toggle</button>
    </form>
  </>;
}

/** Exercise the public Toggle directly, using the documentation app's real CSS. */
export function mountToggleMotionFixture() {
  const host = document.createElement("div");
  host.dataset.testToggleMotionFixture = "";
  Object.assign(host.style, { position: "fixed", top: "20px", left: "340px", zIndex: "99999",
    display: "grid", gap: "16px", padding: "20px", background: "var(--background)" });
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(<MotionFixture />);
}

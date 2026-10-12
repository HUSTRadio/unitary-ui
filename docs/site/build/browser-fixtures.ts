// Optional browser verification entry, never imported by the docs application.
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Toggle } from "@hustradio/unitary-ui";

export { React };
export * as ReactDOM from "react-dom/client";
export { Button, ButtonLink, Toolbar, Radio, RadioGroup, RadioGroupItem } from "@hustradio/unitary-ui";

function ToggleMotionFixture() {
  const [values, setValues] = React.useState({ small: false, medium: false, large: false });
  const [disabled, setDisabled] = React.useState(false);
  return React.createElement(React.Fragment, null,
    ...(["small", "medium", "large"] as const).map((size) => React.createElement("div", {
      key: size, "data-test-toggle-size": size,
    }, React.createElement(Toggle, {
      checked: values[size], size, disabled, "aria-label": `Motion ${size}`,
      onChange: () => setValues((values) => ({ ...values, [size]: !values[size] })),
    }))),
    React.createElement("button", { onClick: () => setDisabled((value) => !value) }, "Change disabled state"),
    React.createElement(Toggle, {
      checked: false, "aria-label": "Declined controlled change", onChange: () => {},
    }),
    React.createElement("form", null,
      React.createElement(Toggle, { defaultChecked: true, "aria-label": "Native motion reset", size: "medium" }),
      React.createElement("button", { type: "reset" }, "Reset native toggle"),
    ),
  );
}

/** Exercise the public Toggle directly, using the documentation app's real CSS. */
export function mountToggleMotionFixture() {
  const host = document.createElement("div");
  host.dataset.testToggleMotionFixture = "";
  Object.assign(host.style, { position: "fixed", top: "20px", left: "340px", zIndex: "99999",
    display: "grid", gap: "16px", padding: "20px", background: "var(--background)" });
  document.body.appendChild(host);
  createRoot(host).render(React.createElement(ToggleMotionFixture));
}

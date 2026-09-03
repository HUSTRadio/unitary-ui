import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

export function CodeBlockLanguageSwitcherWithTabs22834C2CExample() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      tabs={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}

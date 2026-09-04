import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockOpenInV0CA6FBF0AExample() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <div className="flex flex-col gap-4">
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">
        {code}
      </CodeBlock>
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">
        {code}
      </CodeBlock>
    </div>
  );
}

import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockDefault37A8EEC1Example() {
  const code = `// Usage:
  //   enabled by \`--debug-prerender\`
  //   route patterns: [id...] or [...id]
  //   NODE_OPTIONS='--debug-prerender' node
  function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
      {code}
    </CodeBlock>
  );
}

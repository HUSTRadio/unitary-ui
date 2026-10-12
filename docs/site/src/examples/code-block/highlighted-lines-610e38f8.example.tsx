import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockHighlightedLines610E38F8Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="highlighted.jsx"
      language="jsx"
      highlightedLinesNumbers={[1, 4]}
    >
      {code}
    </CodeBlock>
  );
}

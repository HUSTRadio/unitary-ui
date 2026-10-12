import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockNoFilenameC9029DC2Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}

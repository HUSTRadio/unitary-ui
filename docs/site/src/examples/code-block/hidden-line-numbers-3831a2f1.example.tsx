import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockHiddenLineNumbers3831A2F1Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>Good to see you</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="hidden-line-numbers.jsx"
      language="jsx"
      hideLineNumbers
    >
      {code}
    </CodeBlock>
  );
}

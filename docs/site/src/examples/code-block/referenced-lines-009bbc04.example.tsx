import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockReferencedLines009BBC04Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Count: {props.count}</h1>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx" referencedLinesNumbers={[4]}>
      {code}
    </CodeBlock>
  );
}

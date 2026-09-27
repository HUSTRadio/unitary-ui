import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockAddedRemovedLinesED9789E1Example() {
  const code = `module.exports = {
    experimental: {
      appDir: true,
    },
    appDir: true,
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="next.config.js"
      language="jsx"
      addedLinesNumbers={[5]}
      removedLinesNumbers={[2, 3, 4]}
    >
      {code}
    </CodeBlock>
  );
}

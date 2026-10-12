import { CodeBlock } from "@hustradio/unitary-ui";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeTs = `function MyComponent(props: Props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeNext = `export default async function Page() {
  const data = await fetch("https://api.example.com").then((res) => res.json());
  return <main>{data.title}</main>;
}`;

const codeLua = `local b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local decode_table = {}
for i = 1, #b64 do
  decode_table[b64:byte(i)] = i - 1
end

function BloomFilter:has(key)
  local ptr = self.ptr
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if bit.band(sextet, bit.lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

// 切换器要驱动 filename / language / code 三者一起变，否则下拉只改了自己的选中态。
const snippets: Record<string, { filename: string; language: string; code: string }> = {
  JavaScript: { filename: "language-switcher.jsx", language: "jsx", code },
  TypeScript: { filename: "language-switcher.tsx", language: "tsx", code: codeTs },
  "Next.js": { filename: "app/page.tsx", language: "tsx", code: codeNext },
  Lua: { filename: "bloom-filter.lua", language: "lua", code: codeLua },
};

export function CodeBlockLanguageSwitcherEFBF544EExample() {
  const [language, setLanguage] = useState("JavaScript");
  const snippet = snippets[language] ?? snippets.JavaScript;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename={snippet.filename}
      language={snippet.language}
      switcher={{
        options: Object.keys(snippets),
        value: language,
        onChange: setLanguage,
      }}
    >
      {snippet.code}
    </CodeBlock>
  );
}

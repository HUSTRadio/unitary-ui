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

// 每个 tab 都要有自己的 filename / language / code：切换时三者必须一起换，
// 否则只有选中态移动、内容不变，选项卡看起来就是失效的。
const snippets: Record<string, { filename: string; language: string; code: string }> = {
  JavaScript: { filename: "language-switcher.jsx", language: "jsx", code },
  TypeScript: { filename: "language-switcher.tsx", language: "tsx", code: codeTs },
  "Next.js": { filename: "app/page.tsx", language: "tsx", code: codeNext },
  Lua: { filename: "bloom-filter.lua", language: "lua", code: codeLua },
};

export function CodeBlockLanguageSwitcherWithTabs22834C2CExample() {
  const [language, setLanguage] = useState("JavaScript");
  const snippet = snippets[language] ?? snippets.JavaScript;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename={snippet.filename}
      language={snippet.language}
      tabs={{
        options: Object.keys(snippets),
        value: language,
        onChange: setLanguage,
      }}
    >
      {snippet.code}
    </CodeBlock>
  );
}

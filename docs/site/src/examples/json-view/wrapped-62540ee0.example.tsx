import { JsonView } from "@hustradio/unitary-ui";

export function JsonViewWrapped62540EE0Example() {
  const data = {
    browserApiUrl:
      "https://api.example.com/screenshot?url=https%3A%2F%2Fexample.com&width=1440&height=900&fullPage=true",
  };

  return (
    <JsonView data={data} defaultExpandDepth={1} />
  );
}

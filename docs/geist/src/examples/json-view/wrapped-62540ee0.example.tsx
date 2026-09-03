import { JsonView } from "@/components/ui/json-view";

export function JsonViewWrapped62540EE0Example() {
  const data = {
    browserApiUrl:
      "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
  };

  return (
    <JsonView data={data} defaultExpandDepth={1} />
  );
}

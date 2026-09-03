import { Snippet } from "@/components/ui/snippet";

export function SnippetCallback32E8D276Example() {
  return (
    <Snippet onCopy={() => alert("You copied the text!")} text="npm init next-app" width="300px" />
  );
}

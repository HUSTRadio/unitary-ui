import { SplitButton, SplitButtonMenuItem } from "@hustradio/unitary-ui";
import { ExternalLink, Rocket } from "lucide-react";

export function SplitButtonIconA35ABCD6Example() {
  return (
    <SplitButton
      buttonProps={{ size: "small", type: "secondary" }}
      menuButtonLabel="Copy page"
      menuItems={[
        <SplitButtonMenuItem
          key="v0"
          description="Open this page in v0"
          menuItemProps={{ className: "w-[200px]" }}
          title="Open in v0"
          icon={<Rocket className="size-4" aria-hidden />}
        />,
        <SplitButtonMenuItem
          key="chatgpt"
          description="Open this page in ChatGPT"
          menuItemProps={{ className: "w-[200px]" }}
          title="Open in ChatGPT"
          icon={<ExternalLink className="size-4" aria-hidden />}
        />,
      ]}
      menuProps={{ width: 240 }}
    >
      Copy page
    </SplitButton>
  );
}

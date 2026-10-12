import { Button } from "@hustradio/unitary-ui";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@hustradio/unitary-ui";

export function ContextCardRenderProp84FF0355Example() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <div className="flex items-center gap-8">
      <ContextCardTrigger
        content={card}
        side="top"
        render={<Button type="default" typeName="button">Default wrapper</Button>}
      />
      <ContextCardTrigger
        content={card}
        side="top"
        render={
          <a href="#render-prop" className="text-blue-700 underline underline-offset-2">
            Rendered as a link
          </a>
        }
      />
    </div>
  );
}

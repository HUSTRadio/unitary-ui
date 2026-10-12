import { Button } from "@hustradio/unitary-ui";
import { ArrowUp } from "lucide-react";

export function ButtonShapesE729E861Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button aria-label="Upload" shape="square" size="tiny" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" size="small" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" size="large" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="tiny" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="small" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="large" svgOnly typeName="button">
        <ArrowUp />
      </Button>
    </div>
  );
}

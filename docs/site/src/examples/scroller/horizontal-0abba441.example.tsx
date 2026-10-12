import { Scroller } from "@hustradio/unitary-ui";

export function ScrollerHorizontal0ABBA441Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height="100%" overflow="x" width="100%">
        <div
          className="flex flex-row items-stretch justify-start gap-4"
          style={{ minWidth: "120%" }}
        >
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
        </div>
      </Scroller>
    </div>
  );
}

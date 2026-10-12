import { Scroller } from "@hustradio/unitary-ui";

export function ScrollerVertical727CD3A6Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="y" width="100%">
        <div
          className="flex flex-col items-stretch justify-start gap-4"
          style={{ width: 400 }}
        >
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
        </div>
      </Scroller>
    </div>
  );
}

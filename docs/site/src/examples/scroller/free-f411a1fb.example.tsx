import { Scroller } from "@hustradio/unitary-ui";

export function ScrollerFreeF411A1FBExample() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="both" width="100%">
        <div className="grid grid-flow-col grid-rows-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-96 w-96 bg-primary" />
          ))}
        </div>
      </Scroller>
    </div>
  );
}

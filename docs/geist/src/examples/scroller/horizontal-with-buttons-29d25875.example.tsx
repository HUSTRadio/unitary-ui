import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontalWithButtons29D25875Example() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Scroller
        childrenContainerClassName="gap-4"
        height="100%"
        overflow="x"
        width="100%"
        withButtons
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-64 w-96 shrink-0 bg-gray-1000" />
        ))}
      </Scroller>
    </div>
  );
}

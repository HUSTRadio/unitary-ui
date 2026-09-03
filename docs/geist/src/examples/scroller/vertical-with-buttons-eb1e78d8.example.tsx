import { Scroller } from "@/components/ui/scroller";

export function ScrollerVerticalWithButtonsEB1E78D8Example() {
  return (
    <div className="flex max-w-full flex-col gap-4">
      <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-60 w-96 shrink-0 bg-gray-1000" />
        ))}
      </Scroller>
    </div>
  );
}

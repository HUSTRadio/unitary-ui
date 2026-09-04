import { Scroller } from "@/components/ui/scroller";

export function ScrollerVertical727CD3A6Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="y" width="100%">
        <div
          className="flex flex-col items-stretch justify-start gap-4"
          style={{ width: 400 }}
        >
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
        </div>
      </Scroller>
    </div>
  );
}

import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontal0ABBA441Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height="100%" overflow="x" width="100%">
        <div
          className="flex flex-row items-stretch justify-start gap-4"
          style={{ minWidth: "120%" }}
        >
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
        </div>
      </Scroller>
    </div>
  );
}

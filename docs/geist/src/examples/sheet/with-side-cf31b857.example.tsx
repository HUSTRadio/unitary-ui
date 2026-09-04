import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetWithSideCF31B857Example() {
  const sides = ["top", "right", "bottom", "left"] as const;

  return (
    <div className="flex items-center justify-center gap-4">
      {sides.map((side) => (
        <Sheet key={side} modal>
          <SheetTrigger asChild>
            <Button type="default" typeName="button">
              Open {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <p className="text-copy-14 text-foreground">This sheet slides in from the {side}.</p>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

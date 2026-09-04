import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetDefault37A8EEC1Example() {
  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button type="default" typeName="button">
          Open Sheet
        </Button>
      </SheetTrigger>
      <SheetContent className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col">
        <SheetHeader className="p-6 text-left">
          <SheetTitle>Sheet Title</SheetTitle>
          <p className="text-copy-14 text-foreground">Sheet description</p>
        </SheetHeader>
        <SheetDescription className="px-6 py-4 text-copy-14">Sheet body</SheetDescription>
        <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
          <SheetClose asChild>
            <Button type="secondary" typeName="button">
              Close
            </Button>
          </SheetClose>
          <Button typeName="button">Next</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";

export function ComboboxInsideSheet95E13F11Example() {
  const SHARED_VARS = [
    { key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", target: "Preview and Production" },
    { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
    { key: "DATABASE_URL", target: "Production" },
    // ...
  ];

  const [linked, setLinked] = useState<string[]>([]);

  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button size="small" typeName="button">
          Link Shared Variable
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-clip rounded-2xl bg-background-100 p-0 lg:w-5/6 sm:max-w-[auto]"
      >
        <div className="flex flex-shrink-0 items-center justify-between pt-3 pl-4 pr-3">
          <SheetTitle className="text-heading-20">Link Shared Variable</SheetTitle>
          <SheetClose asChild>
            <Button aria-label="Close" shape="square" svgOnly type="tertiary" typeName="button">
              <X className="size-4" aria-hidden />
            </Button>
          </SheetClose>
        </div>
        <p className="px-4 pb-2 text-copy-14 text-gray-900">
          Changes to shared variables sync automatically across all linked projects.
        </p>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
          <Combobox
            aria-label="Search for shared environment variables"
            onValueChange={(value) =>
              setLinked((current) => (current.includes(value) ? current : [...current, value]))
            }
            placeholder="Search for shared environment variables…"
            value=""
          >
            <ComboboxInput />
            <ComboboxList>
              {SHARED_VARS.filter((v) => !linked.includes(`${v.key}::${v.target}`)).map((v) => (
                <ComboboxOption
                  ignoreDefaultHeight
                  key={`${v.key}::${v.target}`}
                  value={`${v.key}::${v.target}`}
                >
                  <div className="flex flex-col items-stretch justify-start py-[15px] px-2">
                    <p className="font-mono text-sm font-medium">{v.key}</p>
                    <p className="mt-[3px] text-xs text-gray-900">{v.target}</p>
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxList>
          </Combobox>
        </div>
      </SheetContent>
    </Sheet>
  );
}

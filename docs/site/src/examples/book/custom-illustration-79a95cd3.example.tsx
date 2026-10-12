import { Book } from "@hustradio/unitary-ui";
import { ChartColumn, Waves } from "lucide-react";

export function BookCustomIllustration79A95CD3Example() {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Book
        illustration={<Waves className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
      />
      <Book
        illustration={<ChartColumn className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
        variant="simple"
      />
    </div>
  );
}

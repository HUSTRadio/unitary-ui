import { Book } from "@/components/ui/book";
import { ArrowRight, Atom, Triangle } from "lucide-react";

export function BookCustomIconEE5755A2Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book icon={<Triangle className="size-4" aria-hidden />} title="Unitary Platform Guide" />
      <Book icon={<ArrowRight className="size-4" aria-hidden />} title="Next.js Documentation" />
      <Book icon={<Atom className="size-4" aria-hidden />} title="React Essentials" />
    </div>
  );
}

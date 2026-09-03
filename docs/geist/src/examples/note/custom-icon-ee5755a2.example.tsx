import { Note, NoteContent } from "@/components/ui/note";
import { Sparkles } from "lucide-react";

export function NoteCustomIconEE5755A2Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note icon={<Sparkles className="size-4" aria-hidden />}>
        <NoteContent>A custom icon replaces the variant's default.</NoteContent>
      </Note>
      <Note icon={null}>
        <NoteContent>Pass a null icon to render no icon at all.</NoteContent>
      </Note>
    </div>
  );
}

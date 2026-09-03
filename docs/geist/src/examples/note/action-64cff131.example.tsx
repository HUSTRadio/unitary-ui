import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteAction64CFF131Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note>
        <NoteContent>This note details some information.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small">
            Upgrade
          </Button>
        </NoteAction>
      </Note>
      <Note>
        <NoteContent>
          This note details a large amount information that could potentially wrap into two
          or more lines.
        </NoteContent>
        <NoteAction>
          <Button typeName="button" size="small">
            Upgrade
          </Button>
        </NoteAction>
      </Note>
    </div>
  );
}

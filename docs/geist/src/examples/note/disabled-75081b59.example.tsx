import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteDisabled75081B59Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note disabled fill variant="warning">
        <NoteContent>This note details a warning.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small">
            Upgrade
          </Button>
        </NoteAction>
      </Note>
    </div>
  );
}

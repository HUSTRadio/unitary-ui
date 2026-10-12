import { Button } from "@hustradio/unitary-ui";
import { Note, NoteAction, NoteContent } from "@hustradio/unitary-ui";

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

import { Note, NoteContent } from "@hustradio/unitary-ui";

export function NoteSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note size="small">
        <NoteContent>A small note.</NoteContent>
      </Note>
      <Note>
        <NoteContent>A medium note.</NoteContent>
      </Note>
    </div>
  );
}

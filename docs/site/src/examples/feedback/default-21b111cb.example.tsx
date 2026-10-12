import { Feedback } from "@hustradio/unitary-ui";
import { Note, NoteContent } from "@hustradio/unitary-ui";

export function FeedbackDefault21B111CBExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="unitary" dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}

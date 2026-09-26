import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackDefault21B111CBExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}

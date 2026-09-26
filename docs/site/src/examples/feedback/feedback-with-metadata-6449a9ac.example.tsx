import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithMetadata6449A9ACExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="vercel"
          dryRun
          metadata={{
            userId: "user_12345",
            location: "post-checkout",
            orderId: "order_123456",
          }}
        />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}

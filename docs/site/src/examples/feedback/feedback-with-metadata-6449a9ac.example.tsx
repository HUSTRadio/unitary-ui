import { Feedback } from "@hustradio/unitary-ui";
import { Note, NoteContent } from "@hustradio/unitary-ui";

export function FeedbackFeedbackWithMetadata6449A9ACExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="unitary"
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

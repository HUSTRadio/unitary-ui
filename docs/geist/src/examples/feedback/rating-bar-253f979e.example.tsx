import { Feedback } from "@/components/ui/feedback";

export function FeedbackRatingBar253F979EExample() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Feedback label="vercel" dryRun defaultValue="love" />
        <Feedback label="vercel" dryRun defaultValue="not-great" />
        <Feedback label="vercel" dryRun defaultValue="hate" />
      </div>
    </>
  );
}

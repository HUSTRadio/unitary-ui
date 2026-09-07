import { RatingPill } from "@/components/ui/rating-pill";

/** Local Unitary extension; not one of the six official Geist Feedback demos. */
export function FeedbackRatingBar253F979EExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <RatingPill label="Was this helpful?" defaultValue="love" />
      <RatingPill label="Was this helpful?" defaultValue="not-great" />
      <RatingPill label="Was this helpful?" defaultValue="hate" />
    </div>
  );
}

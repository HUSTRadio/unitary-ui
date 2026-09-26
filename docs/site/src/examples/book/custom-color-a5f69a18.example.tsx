import { Book } from "@/components/ui/book";

export function BookCustomColorA5F69A18Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
      <Book
        color="#7DC1C1"
        textColor="white"
        title="Design Engineering at Vercel"
        variant="simple"
      />
      <Book color="#FED954" title="The user experience of the Frontend Cloud" />
    </div>
  );
}

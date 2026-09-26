import { Book } from "@/components/ui/book";

export function BookTexturedB29877FBExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
        <Book color="#9D2127" textured title="Design Engineering at Vercel" />
        <Book color="#FED954" textured title="Design Engineering at Vercel" />
      </div>
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book
          color="#7DC1C1"
          textColor="white"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#9D2127"
          textColor="#ece4db"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#FED954"
          textColor="#9d3b05"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
      </div>
    </div>
  );
}

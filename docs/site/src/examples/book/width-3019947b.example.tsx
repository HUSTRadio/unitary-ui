import { Book } from "@/components/ui/book";

export function BookWidth3019947BExample() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" width={300} />
      <Book title="The user experience of the Frontend Cloud" width={200} />
      <Book title="The user experience of the Frontend Cloud" width={150} />
    </div>
  );
}

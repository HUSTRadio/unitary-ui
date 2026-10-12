import { Input } from "@hustradio/unitary-ui";

export function InputErrorCA00FCCFExample() {
  return (
    <div className="flex flex-col items-start justify-start gap-8">
      <Input size="small" error="An error message." placeholder="long-error@gmail.com" />
      <Input error="An error message." placeholder="long-error@gmail.com" />
      <Input size="large" error="An error message." placeholder="long-error@gmail.com" />
    </div>
  );
}

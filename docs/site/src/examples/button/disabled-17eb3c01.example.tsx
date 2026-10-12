import { Button } from "@hustradio/unitary-ui";

export function ButtonDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button disabled size="small" typeName="button">Upload</Button>
      <Button disabled typeName="button">Upload</Button>
      <Button disabled size="large" typeName="button">Upload</Button>
    </div>
  );
}

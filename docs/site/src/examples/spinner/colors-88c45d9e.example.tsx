import { Spinner } from "@hustradio/unitary-ui";

export function SpinnerColors88C45D9EExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Default:</span>
        <Spinner />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Red:</span>
        <Spinner className="text-danger" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Green:</span>
        <Spinner className="text-success" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Blue:</span>
        <Spinner className="text-info" />
      </div>
    </div>
  );
}

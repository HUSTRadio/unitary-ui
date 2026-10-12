import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastDefault21B111CBExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
      >
        Show Toast
      </Button>
    </>
  );
}

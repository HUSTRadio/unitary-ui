import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastMultiLine15F3E22CExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence." })
        }
      >
        Show Toast
      </Button>
    </>
  );
}

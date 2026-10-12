import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastError54A0E8C1Example() {
  const toasts = useToasts();

  return (
    <>
      <Button typeName="button" onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}>
        Show Toast
      </Button>
    </>
  );
}

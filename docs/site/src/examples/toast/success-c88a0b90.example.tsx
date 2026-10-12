import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastSuccessC88A0B90Example() {
  const toasts = useToasts();

  return (
    <>
      <Button typeName="button" onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}>
        Show Toast
      </Button>
    </>
  );
}

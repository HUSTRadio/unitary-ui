import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastWarningE981DDAEExample() {
  const toasts = useToasts();

  return (
    <>
      <Button typeName="button" onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}>
        Show Toast
      </Button>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

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

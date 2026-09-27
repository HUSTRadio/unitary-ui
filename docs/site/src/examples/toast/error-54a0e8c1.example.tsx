import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

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

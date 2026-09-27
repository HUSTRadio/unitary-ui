import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

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

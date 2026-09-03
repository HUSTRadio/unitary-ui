import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastAction64CFF131Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({ text: "The Evil Rabbit jumped over the fence.", action: "Undo" })
        }
      >
        Show Toast
      </Button>
    </>
  );
}

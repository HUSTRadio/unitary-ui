import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastUndoA8283ADEExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({ text: "The Evil Rabbit jumped over the fence.", onUndoAction: () => undefined })
        }
      >
        Show Toast
      </Button>
    </>
  );
}

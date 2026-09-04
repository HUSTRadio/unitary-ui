import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastPreserve25DFADC0Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true })}
      >
        Show Toast
      </Button>
    </>
  );
}

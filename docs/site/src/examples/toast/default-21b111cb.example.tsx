import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastDefault21B111CBExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
      >
        Show Toast
      </Button>
    </>
  );
}

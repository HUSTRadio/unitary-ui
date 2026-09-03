import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastWithJsx76A6D122Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({
            text: (
              <>
                <span className="text-heading-14">The Evil Rabbit</span> jumped over the fence.
              </>
            ),
            preserve: true,
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}

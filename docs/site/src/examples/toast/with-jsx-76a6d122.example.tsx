import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

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

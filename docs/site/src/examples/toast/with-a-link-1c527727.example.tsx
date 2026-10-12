import { Button } from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";

export function ToastWithALink1C527727Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({
            text: (
              <>
                The Evil Rabbit jumped over the{" "}
                <a href="#/components" className="font-medium text-foreground underline underline-offset-4">
                  fence again
                </a>
                .
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

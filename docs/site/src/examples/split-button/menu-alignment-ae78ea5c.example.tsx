import { SplitButton, SplitButtonMenuItem } from "@hustradio/unitary-ui";

export function SplitButtonMenuAlignmentAE78EA5CExample() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <SplitButton
        buttonProps={{ type: "default" }}
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem description="Save changes" title="Save" />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save (bottom-start)
      </SplitButton>
      <SplitButton
        buttonProps={{ type: "secondary" }}
        menuAlignment="bottom-end"
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem description="Save changes" title="Save" />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save (bottom-end)
      </SplitButton>
    </div>
  );
}

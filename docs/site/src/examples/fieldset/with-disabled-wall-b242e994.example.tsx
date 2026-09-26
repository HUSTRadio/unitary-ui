import {
  DisabledWall,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithDisabledWallB242E994Example() {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Advanced Features</FieldsetTitle>
        <FieldsetSubtitle>Access premium capabilities and tools</FieldsetSubtitle>
        <div className="relative mt-2 rounded-[6px] border border-gray-alpha-400 p-3">
          <p className="text-copy-14">
            This content is behind a disabled wall and not accessible to free users.
          </p>
          <p className="mt-2 text-copy-14">
            It contains advanced configuration options and premium features.
          </p>
          <DisabledWall />
        </div>
      </FieldsetContent>
      <FieldsetFooter highlight>
        <FieldsetFooterStatus>
          <span>Upgrade to a Pro plan to access these features.</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}

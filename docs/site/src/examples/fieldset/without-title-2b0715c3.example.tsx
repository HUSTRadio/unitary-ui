import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
} from "@/components/ui/fieldset";

export function FieldsetWithoutTitle2B0715C3Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetSubtitle>
          This fieldset contains only a subtitle with no title. It can be used for informational
          sections or supplementary content.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Information only</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}

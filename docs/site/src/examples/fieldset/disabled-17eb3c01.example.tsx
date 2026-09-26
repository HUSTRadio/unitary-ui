import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetDisabled17EB3C01Example() {
  return (
    <Fieldset>
      <FieldsetContent disabled>
        <FieldsetTitle>Transfer Project</FieldsetTitle>
        <FieldsetSubtitle>Move this project to another team or account</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter highlight>
        <FieldsetFooterStatus>
          <span>You need additional permissions to transfer projects.</span>
        </FieldsetFooterStatus>
      </FieldsetFooter>
    </Fieldset>
  );
}

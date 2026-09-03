import {
  Fieldset,
  FieldsetContent,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetWithoutFooterED163245Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Account Information</FieldsetTitle>
        <FieldsetSubtitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
          ultricies, nisl nisl aliquam nisl.
        </FieldsetSubtitle>
      </FieldsetContent>
    </Fieldset>
  );
}

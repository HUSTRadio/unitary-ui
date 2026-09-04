import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

export function FieldsetDefault37A8EEC1Example() {
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Account Settings</FieldsetTitle>
        <FieldsetSubtitle>Manage your account preferences and settings</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>
            Need help?{" "}
            <a href="#" className="cursor-pointer text-link hover:underline">
              View documentation
            </a>
          </span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction>Save Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
    </Fieldset>
  );
}

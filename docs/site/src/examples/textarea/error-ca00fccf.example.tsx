import { Textarea } from "@hustradio/unitary-ui";

export function TextareaErrorCA00FCCFExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-8">
      <Textarea
        aria-label="With error (small)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="small"
      />
      <Textarea
        aria-label="With error (medium)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="medium"
      />
      <Textarea
        aria-label="With error (large)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="large"
      />
    </div>
  );
}

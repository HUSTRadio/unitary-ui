import { Select } from "@/components/ui/select";

export function SelectErrorCA00FCCFExample() {
  return (
    <>
    <Select aria-label="Small with error" error="Please select a value." placeholder="Small" size="small" />
    <Select aria-label="Default with error" error="Please select a value." placeholder="Default" />
    <Select aria-label="Large with error" error="Please select a value." placeholder="Large" size="large" />
    </>
  );
}

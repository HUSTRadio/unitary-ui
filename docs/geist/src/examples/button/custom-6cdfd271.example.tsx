import { CustomButton } from "@/components/ui/button";

export function ButtonCustom6CDFD271Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <CustomButton
        active={{
          foreground: "#fff",
          background: "var(--blue-700)",
          border: "var(--blue-700)",
        }}
        hover={{
          foreground: "#fff",
          background: "#0B7BFE",
          border: "var(--blue-700)",
        }}
        normal={{
          foreground: "#fff",
          background: "var(--blue-700)",
          border: "var(--blue-700)",
        }}
        width={160}
      >
        Upgrade to Pro
      </CustomButton>
    </div>
  );
}

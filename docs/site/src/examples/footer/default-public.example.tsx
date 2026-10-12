import { Footer } from "@hustradio/unitary-ui";

export default function FooterExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Footer
        columns={[{ title: "Resources", links: [{ label: "Components", href: "#/components" }, { label: "Guides", href: "#/guides" }] }]}
        slotLeading={<strong className="text-sm">Unitary</strong>}
      />
    </div>
  );
}

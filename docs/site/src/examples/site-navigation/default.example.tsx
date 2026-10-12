import { SiteNavigation } from "@hustradio/unitary-ui";

export default function SiteNavigationExample() {
  return (
    <div className="min-h-80 w-full rounded-md border border-gray-alpha-400">
      <div className="relative border-b border-gray-alpha-400 p-4">
        <SiteNavigation
          label="Site navigation"
          desktopBreakpoint={768}
          items={[
            {
              id: "research",
              label: "Research",
              groups: [
                {
                  title: "Explore",
                  links: [
                    { label: "Overview", href: "/research" },
                    {
                      label: "Projects",
                      href: "/projects",
                      description: "Discover our latest work",
                    },
                  ],
                },
              ],
            },
            { id: "news", label: "News", href: "/news" },
          ]}
          mobileActions={
            <a href="/contact" className="inline-flex min-h-11 items-center">
              Contact
            </a>
          }
        />
      </div>
    </div>
  );
}

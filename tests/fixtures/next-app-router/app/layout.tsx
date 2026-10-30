import type { ReactNode } from "react";

import "@hustradio/unitary-ui/styles.css";

export const metadata = {
  title: "Unitary Next.js App Router fixture",
  description: "Verifies the packed @hustradio/unitary-ui tarball inside a real App Router application.",
};

// Server component root layout: no "use client" here.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

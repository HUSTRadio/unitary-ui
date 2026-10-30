import Boom from "./boom";

// Request-time rendering: the deliberate failure must happen while serving the
// request (not while prerendering at build time).
export const dynamic = "force-dynamic";

export default function BrokenPage() {
  return <Boom />;
}

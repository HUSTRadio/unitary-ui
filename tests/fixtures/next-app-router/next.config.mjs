import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // The fixture is copied into a temp directory whose ancestors may contain
  // unrelated lockfiles; pin the tracing root to the application itself.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // The fixture intentionally ships no ESLint setup; linting happens at the repository root.
  eslint: { ignoreDuringBuilds: true },
  // Type errors must fail the verification, exactly like a real consumer build.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;

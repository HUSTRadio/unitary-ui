import { readFileSync } from "node:fs";
import path from "node:path";

export const artifactMode = Boolean(process.env.UNITARY_DOCS_ARTIFACT);
type Entry = { file: string; src?: string; imports?: string[]; dynamicImports?: string[]; isDynamicEntry?: boolean };
const manifest: Record<string, Entry> = artifactMode
  ? JSON.parse(readFileSync(path.join(process.env.UNITARY_DOCS_ARTIFACT!, ".vite/manifest.json"), "utf8"))
  : {};

/** Resolve a real output chunk for delayed loading and prefetch assertions. */
export function artifactModule(source: string): string {
  const match = Object.entries(manifest).find(([key, value]) => key.endsWith(source) || value.src?.endsWith(source));
  if (!match) throw new Error(`Built docs manifest is missing ${source}`);
  return `/${match[1].file}`;
}

export function artifactModules(pattern: RegExp): string[] {
  return [...new Set(Object.entries(manifest)
    .filter(([key, value]) => pattern.test(key) || Boolean(value.src && pattern.test(value.src)))
    .map(([, value]) => `/${value.file}`))];
}

export function moduleRequest(source: string, devPattern: string): string {
  return artifactMode ? `**${artifactModule(source)}` : devPattern;
}

export function requestsModule(url: string, source: string, devSubstring: string): boolean {
  return artifactMode ? new URL(url).pathname === artifactModule(source) : url.includes(devSubstring);
}

/** The npm package preserves its lazy motion entry under a generated JS filename. */
export function motionFeaturesRequest(): string {
  if (!artifactMode) return "**/src/lib/motion-features.ts*";
  const pattern = /(?:^|[\/_])motion-features(?:-[\w-]+)?\.(?:js|ts)$/;
  const entries = Object.entries(manifest).filter(([key, value]) =>
    pattern.test(key) || Boolean(value.src && pattern.test(value.src)) || pattern.test(value.file));
  // A shared implementation chunk can use the same prefix as the package's
  // small re-export entry. Delay the actual dynamic import when both exist.
  const dynamicEntries = entries.filter(([, value]) => value.isDynamicEntry);
  const chunks = [...new Set((dynamicEntries.length ? dynamicEntries : entries).map(([, value]) => `/${value.file}`))];
  if (chunks.length !== 1) throw new Error(`Built docs must contain one lazy motion features entry; found ${chunks.length}`);
  return `**${chunks[0]}`;
}

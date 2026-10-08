#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verificationOptions, verifyWorkspace } from "./lib/verification.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
async function main() {
  return verifyWorkspace(root, verificationOptions(process.argv.slice(2)));
}
main()
  .then(({ code }) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(`[verify] ${error.message}`);
    process.exitCode = 1;
  });

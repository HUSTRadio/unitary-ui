/**
 * Windows-only guard for `next build`.
 *
 * Next.js appends its build trace through `fs.createWriteStream(.next/trace)`
 * without listening for stream errors. On Windows that open intermittently
 * fails with `EPERM` while the build directory is being created/scanned, which
 * aborts an otherwise healthy build. Trace data is diagnostic only, so this
 * preload replaces that single stream with a discarding sink. Every other file
 * access, and the entire build pipeline, stays untouched.
 *
 * Loaded through NODE_OPTIONS only by scripts/test-next-app-router.mjs.
 */
const fs = require("node:fs");
const { Writable } = require("node:stream");

const originalCreateWriteStream = fs.createWriteStream;
const traceSuffix = "/.next/trace";

fs.createWriteStream = function createWriteStreamWithoutBuildTrace(file, ...rest) {
  if (process.platform === "win32" && String(file).replaceAll("\\", "/").endsWith(traceSuffix)) {
    return new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
  }
  return originalCreateWriteStream.call(fs, file, ...rest);
};

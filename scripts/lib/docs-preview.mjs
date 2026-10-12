import http from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4",
  ".wasm": "application/wasm", ".map": "application/json",
};

/** Serve only a built artifact. Missing assets fail instead of falling back to source. */
export async function startDocsPreview(directory, port = 0) {
  const root = await realpath(directory);
  if (!(await stat(path.join(root, "index.html"))).isFile()) throw new Error("Missing built docs index.html");
  const inside = (file) => {
    const relative = path.relative(root, file);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
  };
  const server = http.createServer(async (request, response) => {
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        response.writeHead(405); response.end(); return;
      }
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const target = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
      if (!inside(target)) throw new Error("Outside artifact");
      const file = await realpath(target);
      if (!inside(file)) throw new Error("Outside artifact");
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      const start = range ? Number(range[1]) : 0;
      const end = range?.[2] ? Number(range[2]) : info.size - 1;
      if (range && (start > end || end >= info.size)) {
        response.writeHead(416, { "Content-Range": `bytes */${info.size}` }); response.end(); return;
      }
      response.writeHead(range ? 206 : 200, {
        "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
        "Content-Length": range ? end - start + 1 : info.size,
        "Accept-Ranges": "bytes", "Cache-Control": "no-store",
        ...(range ? { "Content-Range": `bytes ${start}-${end}/${info.size}` } : {}),
      });
      if (request.method === "HEAD") { response.end(); return; }
      const stream = createReadStream(file, { start, end });
      stream.on("error", () => response.destroy());
      stream.pipe(response);
    } catch {
      response.writeHead(404); response.end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => {
      server.closeAllConnections();
      server.close((error) => error ? reject(error) : resolve());
    }),
  };
}

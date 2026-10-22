import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servers = [];
let closing;
const close = () => closing ??= Promise.allSettled(servers.map(server => server.close()));

try {
  const docs = await createServer({ configFile: path.join(root, "website/docs.vite.config.ts"), server: { host: "127.0.0.1", port: 5181, strictPort: true } });
  servers.push(docs);
  await docs.listen();
  const website = await createServer({
    configFile: path.join(root, "website/vite.config.ts"),
    server: { host: "127.0.0.1", port: 5180, strictPort: true, proxy: { "/docs/": { target: "http://127.0.0.1:5181", ws: true } } },
  });
  servers.push(website);
  await website.listen();
  website.printUrls();
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => { void close(); });
} catch (error) {
  await close();
  console.error(error);
  process.exitCode = 1;
}

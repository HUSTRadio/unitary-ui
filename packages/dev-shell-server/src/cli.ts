import { createDevShellServer } from "./server.js";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { runAgentSmoke } from "./agent/smoke.js";
import type { AgentBackend } from "@hustradio/dev-shell-contract";

const command = process.argv[2] ?? "start";
if (command === "dev" || command === "start") {
  const server = createDevShellServer();
  const shutdown = async () => { await server.close(); process.exit(0); };
  process.once("SIGINT", () => { void shutdown(); });
  process.once("SIGTERM", () => { void shutdown(); });
  try {
    const address = await server.listen();
    console.log(`Dev Shell listening on http://${server.config.host}:${address.port}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unable to start Dev Shell");
    await server.close(); process.exitCode = 1;
  }
} else if (command === "smoke:codebuddy" || command === "smoke:agents") {
  const scratch = path.resolve(import.meta.dirname, "../../../.scratch");
  await mkdir(scratch, {recursive: true});
  const backends: AgentBackend[] = command === "smoke:codebuddy" ? ["codebuddy"] : ["codebuddy", "codex", "opencode-v2"];
  for (const backend of backends) {
  const dataDir = await mkdtemp(path.join(scratch, `dev-shell-${backend}-smoke-`));
  const server = createDevShellServer({config: {port: 0, dataDir}});
  let visitorId: string | undefined;
  try {
    const address = await server.listen();
    const owner = server.service.bootstrapOwner("Smoke operator");
    const credentials = server.service.createVisitor(owner.visitor.id, "agent", "Read-only CLI smoke");
    visitorId = credentials.visitor.id;
    const result = {backend, ...await runAgentSmoke({backend, dataDir, mcpUrl: `http://127.0.0.1:${address.port}/mcp`,
      agentToken: credentials.token, agentVisitorId: visitorId,
      timeoutMs: 60_000,
      wasVisitorMeCalled: () => (server.mcpVisitorReads.get(credentials.visitor.id) ?? 0) > 0})};
    await writeFile(path.join(dataDir, "result.json"), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch {
    const result = {backend, ok: false, error: "AGENT_SMOKE_FAILED", detail: "Unable to complete the local read-only protocol check"};
    await writeFile(path.join(dataDir, "result.json"), JSON.stringify(result, null, 2));
    console.error(JSON.stringify(result));
    process.exitCode = 1;
  } finally {
    if (visitorId) {
      const owner = server.service.listVisitors().find(visitor => visitor.kind === "human");
      if (owner) server.service.revokeVisitor(owner.id, visitorId);
    }
    await server.close();
  }
  }
} else {
  console.error("Usage: cli.ts [dev|start|smoke:codebuddy|smoke:agents]"); process.exitCode = 1;
}

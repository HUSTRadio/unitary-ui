import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface ServerConfig {
  host: string;
  port: number;
  dataDir: string;
  databasePath: string;
  webDistDir: string;
  workspace: string;
  defaultTarget: string;
  allowedOrigins: string[];
  shellAllowedOrigins: string[];
  targetAllowedOrigins: string[];
}

const repositoryRoot = resolve(fileURLToPath(new URL("../../../", import.meta.url)));
const integer = (value: string | undefined, fallback: number) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) throw new Error("DEV_SHELL_PORT must be a valid port");
  return parsed;
};

export function loadConfig(overrides: Partial<ServerConfig> = {}): ServerConfig {
  const host = overrides.host ?? process.env.DEV_SHELL_HOST ?? "127.0.0.1";
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) throw new Error("Dev Shell must listen on a loopback address");
  const port = overrides.port ?? integer(process.env.DEV_SHELL_PORT, 5274);
  const shellAllowedOrigins = overrides.shellAllowedOrigins ?? overrides.allowedOrigins ?? [`http://${host === "::1" ? "[::1]" : host}:${port}`, "http://127.0.0.1:5273"];
  const defaultTarget = overrides.defaultTarget ?? process.env.DEV_SHELL_TARGET ?? `http://127.0.0.1:${port}/fixture`;
  const dataDir = resolve(overrides.dataDir ?? process.env.DEV_SHELL_DATA_DIR ?? resolve(repositoryRoot, ".workbuddy/dev-shell"));
  const config: ServerConfig = {
    host,
    port,
    dataDir,
    databasePath: resolve(overrides.databasePath ?? process.env.DEV_SHELL_DATABASE ?? resolve(dataDir, "workbench.sqlite")),
    webDistDir: resolve(overrides.webDistDir ?? resolve(repositoryRoot, "packages/dev-shell/dist")),
    workspace: resolve(overrides.workspace ?? process.env.DEV_SHELL_WORKSPACE ?? repositoryRoot),
    defaultTarget,
    allowedOrigins: shellAllowedOrigins,
    shellAllowedOrigins,
    targetAllowedOrigins: overrides.targetAllowedOrigins ?? [new URL(defaultTarget).origin],
  };
  mkdirSync(dataDir, { recursive: true });
  return config;
}

# External development workbench

[Frontend VibeShell](https://github.com/LeonhardtHUST/frontend-vibeshell) is an independent utility,
installed through [`@leonhardthust/frontend-vibeshell`](https://www.npmjs.com/package/@leonhardthust/frontend-vibeshell).
Unitary UI keeps a development dependency and launch commands; the workbench source, tests,
and agent runtime are maintained in the independent repository.

Requires Node.js 22.13+ and an installed, authenticated CodeBuddy, Codex or OpenCode v2 CLI.
Start the project preview and workbench in separate terminals:

```sh
pnpm install
pnpm dev
# Another terminal, still at this repository root
pnpm dev:dev-shell --backend codex
```

Both `dev:dev-shell` and `start:dev-shell` invoke the installed `frontend-vibeshell` command,
bind the workspace to this repository, and preview `http://127.0.0.1:5173`.
The workbench defaults to `http://127.0.0.1:5274`. To use another preview address:

```sh
pnpm exec frontend-vibeshell --workspace . --target http://127.0.0.1:5174 --backend codex
```

Existing `.workbuddy/dev-shell/` data is retained. Stop the old server first, then reuse
the database from its original workspace:

```sh
pnpm exec frontend-vibeshell --workspace . --data-dir .workbuddy/dev-shell --target http://127.0.0.1:5173
```

The workspace must match the database's saved settings. Use separate data for other projects.
New default data directories are isolated by workspace; browser credentials are stored per workbenchId.
The `dev-shell` command alias, `DEV_SHELL_*` variables, MCP identifier and old tokens remain compatible.
Refer to the utility README for backend authentication and real MCP limitations, permissions,
backups and proxy compatibility.

# Publishing to npmjs

[简体中文](./npm-release.md)

The package is `@hustradio/unitary-ui`; the first stable version is `0.1.0`, published under `latest`. Only a formal GitHub Release's `published` event triggers publishing. Drafts, prereleases and tag pushes do not publish.

## Configure the first publication

1. Confirm your npm account can create and publish packages in the `@hustradio` scope and has 2FA enabled. The GitHub repository must be public for public-package provenance.
2. Create the GitHub Environment `npmjs` and allow version tags to deploy. Configure required reviewers if desired; the publishing job enters this environment after validation succeeds.
3. Create a short-lived granular npm token with only the required scope publishing permissions and bypass 2FA enabled. Save it as the Environment Secret `NPM_TOKEN`. Keep it out of source, examples and logs.
4. Review the preparation changes before merging. These preparation tools do not commit, push, create an online Release or publish.

npm requires the package to exist before configuring its trusted publisher. The workflow injects the temporary token only when the package is missing and its version is exactly `0.1.0`. Later versions use OIDC with no token fallback. [Trusted publishing](https://docs.npmjs.com/trusted-publishers/) · [npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/)

## Local preparation and acceptance

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
python -m pip install --requirement tests/audit/requirements.txt
pnpm run test:package
pnpm run verify -- --dry-run --full
pnpm run verify -- --full
```

`test:package` cleans and builds `dist`, packs with pnpm, installs the tarball in an independent temporary consumer, and checks types, ESM/CJS, SSR, hydration and both themes' CSS. Internal packing uses `--config.ignore-scripts=true` to avoid repeated `prepack`; standalone `pnpm pack` still builds automatically.

Artifacts appear in `.scratch/npm-release/`: `hustradio-unitary-ui-0.1.0.tgz`, `files.json`, `summary.json` and `SHA256SUMS`. They are ignored local output and must not be committed. Restricted network or browser access requires rerunning in an environment with those permissions, not skipping checks.

Generate and review any corpus or screenshot drift using repository commands, then rerun deterministic checks and full verification. Retain all 16 font subsets, bilingual third-party notices and existing risk disclosure; fonts are not relicensed under MIT.

## Create a formal Release

1. Keep `package.json` at `0.1.0`; point `v0.1.0` at a reviewed and validated commit in `master` history.
2. Prepare a GitHub Release draft using the [0.1.0 draft notes](./npm-release-0.1.0.md), verify its tag and clear the prerelease flag. During preparation, keep changes under `Unreleased` in both changelogs.
3. Publish the formal Release. The workflow checks the event, tag, commit, version and registry, then calls all existing CI and nightly checks, including Windows README screenshots.
4. After every check passes, create and validate the final tarball. The publishing job downloads that exact artifact, checks its digest and the registry again, then publishes publicly with provenance. It does not install project dependencies, rebuild or execute tarball lifecycle scripts.
5. Inspect `npm-package`, `npm-publication-evidence` and final verification in Actions. The workflow checks the version, `latest`, public access, integrity and provenance bundle, allowing brief registry synchronization.

## Switch to OIDC after the first release

Configure the package's npm Settings trusted publisher with Organization/user `HUSTRadio`, Repository `unitary-ui`, Workflow filename `publish.yml`, Environment `npmjs`, and permission for direct `npm publish`. Names must match exactly. Use GitHub-hosted runners, Node 24 and npm ≥11.5.1; the workflow grants `id-token: write`. [Official configuration](https://docs.npmjs.com/trusted-publishers/)

Delete the GitHub `NPM_TOKEN` Environment Secret and revoke the temporary token on npm. For subsequent publications, increment the version and tag and create another formal Release. Published `0.1.0` cannot be reused.

## Recovery

- Validation fails before publishing: inspect the failed job and artifacts, fix the problem, and prepare the version on the correct commit. Do not bypass failed checks.
- First-release authentication fails while the registry remains 404: check scope permissions, token expiry and bypass 2FA, then rerun the failed workflow.
- Later OIDC authentication fails: check the npm trusted publisher's repository, filename, environment and permissions. Do not add token fallback.
- Publishing or post-publication verification fails: first run `npm view @hustradio/unitary-ui@0.1.0 --registry=https://registry.npmjs.org/ --json`. If the version exists, retain the original artifact digest and check integrity, `latest` and provenance. Do not republish it; a complete rerun deliberately rejects existing versions.
- The version exists but verification is incomplete: download the original run's `npm-package` and evidence and complete the comparison against registry metadata. Content defects require a new version. If only `latest` differs, a maintainer can repair the dist-tag after confirming the published package. Do not delete a version to attempt republishing.

After confirming the online publication, archive the relevant changelog entries under `0.1.0` in both languages with the actual publication date. Keep subsequent changes under `Unreleased`.

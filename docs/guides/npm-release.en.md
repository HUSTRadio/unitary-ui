# Publishing to npmjs

[简体中文](./npm-release.md)

The package is `@hustradio/unitary-ui`; the initial `0.1.0-beta.0` has been published, and `0.1.0-beta.1` is currently being prepared for `beta` by manually dispatching `publish.yml` on `master`, without publishing a GitHub Release. Future stable versions still publish under `latest` through formal Releases. Drafts, prerelease Releases and tag pushes do not publish automatically.

## Configure the first publication

1. Confirm your npm account can create and publish packages in the `@hustradio` scope and has 2FA enabled. The GitHub repository must be public for public-package provenance.
2. Create the GitHub Environment `npmjs` and allow the `master` branch and version tags to deploy. Configure required reviewers if desired; the publishing job enters this environment after validation succeeds.
3. Create a short-lived granular npm token with only the required scope publishing permissions and bypass 2FA enabled. Save it as the Environment Secret `NPM_TOKEN`. Keep it out of source, examples and logs.
4. Complete full validation before merging preparation changes; commits, pushes and publication require maintainer authorization.

npm requires the package to exist before configuring its trusted publisher. The workflow injects the temporary token only when the package is missing and its version is exactly the initial beta `0.1.0-beta.0` (or the future initial stable `0.1.0`). Later versions use OIDC with no token fallback. [Trusted publishing](https://docs.npmjs.com/trusted-publishers/) · [npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/)

## Local preparation and acceptance

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
python -m pip install --requirement tests/audit/requirements.txt
pnpm run test:package
pnpm run verify -- --dry-run --full
pnpm run verify -- --full
```

`test:package` cleans and builds `dist`, packs once with pnpm, and checks types, ESM/CJS, SSR, hydration and both themes' CSS in an independent consumer. It then installs the same tarball into the complete docs application with a standalone frozen dependency lock, checks its types and static build, compares the bilingual corpus, and runs the complete browser matrix. `pnpm run test:docs:package` invokes this same validation without creating a second archive. Internal packing uses `--config.ignore-scripts=true` to avoid repeated `prepack`; standalone `pnpm pack` still builds automatically.

Artifacts appear in `.scratch/npm-release/`: `hustradio-unitary-ui-0.1.0-beta.1.tgz`, `files.json`, `summary.json` and `SHA256SUMS`. They are ignored local output and must not be committed. Restricted network or browser access requires rerunning in an environment with those permissions, not skipping checks.

Generate and review any corpus or screenshot drift using repository commands, then rerun deterministic checks and full verification. Retain all 16 font subsets, bilingual third-party notices and existing risk disclosure; fonts are not relicensed under MIT.

## Publish the beta without a Release

Prepare the next unused beta version (`0.1.0-beta.1` for this update) in `package.json`, commit the validated changes to `master`, then manually run:

```sh
gh workflow run publish.yml --repo HUSTRadio/unitary-ui --ref master -f version=0.1.0-beta.1
```

The requested version must match the package and be a `-beta.N` version. All CI, the full browser matrix and Windows README screenshots remain required. The final tarball is published with `--tag beta --provenance`; verification checks the `beta` tag and provenance from `refs/heads/master`. No Release or version tag is required. Keep the stable Release as a draft. Keep changelog entries in `Unreleased` until registry verification succeeds.

## Create a formal Release

1. Keep `package.json` at `0.1.0`; point `v0.1.0` at a reviewed and validated commit in `master` history.
2. Prepare a GitHub Release draft using the [0.1.0 draft notes](./npm-release-0.1.0.md), verify its tag and clear the prerelease flag. During preparation, keep changes under `Unreleased` in both changelogs.
3. Publish the formal Release. The workflow checks the event, tag, commit, version and registry, then calls all existing CI and nightly checks, including Windows README screenshots.
4. After every check passes, create and validate the final tarball. The publishing job downloads that exact artifact, checks its digest and the registry again, then publishes publicly with provenance. It does not install project dependencies, rebuild or execute tarball lifecycle scripts. npm runs from the runner temporary directory so the repository's pnpm-only `devEngines` does not block archive publication.
5. Inspect `npm-package`, `npm-publication-evidence` and final verification in Actions. The workflow checks the version, `latest`, public access, integrity and provenance bundle, polling read-only for up to 20 minutes while npm scans accepted uploads, within a 30-minute publishing job. A timeout never repeats publication. [npm scanning](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/)

## Switch to OIDC after the first release

Configure the package's npm Settings trusted publisher with Organization/user `HUSTRadio`, Repository `unitary-ui`, Workflow filename `publish.yml`, Environment `npmjs`, and permission for direct `npm publish`. Names must match exactly. Use GitHub-hosted runners, Node 24 and npm ≥11.5.1; the workflow grants `id-token: write`. [Official configuration](https://docs.npmjs.com/trusted-publishers/)

Delete the GitHub `NPM_TOKEN` Environment Secret and revoke the temporary token on npm. Increment subsequent beta versions and manually dispatch the same workflow; stable versions use a new version tag and formal Release. Published versions cannot be reused.

New trusted publisher configurations must complete their first successful OIDC publication within 48 hours. Otherwise they expire and must be deleted and recreated before the next publication. The initial token publication does not validate a publisher configured afterward. Do not publish an extra version merely to validate it. [Current npm requirements](https://docs.npmjs.com/trusted-publishers/)

## Recovery

- Validation fails before publishing: inspect the failed job and artifacts, fix the problem, and prepare the version on the correct commit. Do not bypass failed checks.
- First-release authentication fails while the registry remains 404: check scope permissions, token expiry and bypass 2FA, then rerun the failed workflow.
- Later OIDC authentication fails: check the npm trusted publisher's repository, filename, environment and permissions. Do not add token fallback.
- Publishing or post-publication verification fails: read the exact version from the original run's `summary.json` and query that version; for this update, run `npm view @hustradio/unitary-ui@0.1.0-beta.1 --registry=https://registry.npmjs.org/ --json`. If the version exists, retain the original artifact digest and check integrity, `beta` (`latest` for stable versions) and provenance. Do not republish it; a complete rerun deliberately rejects existing versions.
- The version exists but verification is incomplete: download the original run's `npm-package` and evidence and complete the comparison against registry metadata. Content defects require a new version. If only the target dist-tag differs, a maintainer can repair the dist-tag after confirming the published package. Do not delete a version to attempt republishing.

- If npm accepted the upload but the version is still unavailable, wait for scanning before interpreting a 404 as publication failure. Once available, restore the original `npm-package` files to `.scratch/npm-release/` and run `node scripts/npm-release.mjs verify` with the original run's `GITHUB_SHA`, `GITHUB_REF` and `GITHUB_EVENT_NAME`. Retain `published.json`; do not rerun the publishing job.
- For a package's first beta, npm also assigns `latest` despite `--tag beta`; removing `latest` can return HTTP 400 after successful 2FA. Retain the beta version and disclose the actual tags. Install explicitly with `@beta` or the version. Do not create a fictitious stable version or republish to change this behavior. [npm CLI issue](https://github.com/npm/cli/issues/8490)

After confirming the online publication, archive the relevant changelog entries under the published version (`0.1.0-beta.0` initially) in both languages with the actual publication date. Keep subsequent changes under `Unreleased`.

## Build the published-package documentation artifact

After publication verification, the `docs-static` job checks out the same release commit and downloads both the candidate tarball and `published.json`. It builds with the exact registry version and verifies its integrity against the candidate, retaining the same external dependency tree. The full browser and corpus checks run on the built application; test fixtures are then disabled for a fresh production build and another corpus comparison.

The `unitary-docs-<version>-<sha>` Actions artifact contains deployable static files and `build-metadata.json` with the library version, integrity, release commit and dependency lock digest. Its name uses the exact release version and full commit SHA. Hosting is configured separately; this workflow does not deploy a website. `docs-publication-evidence` retains the frozen consumer manifest, lock and verification output.

To recover only the docs artifact, restore the original `npm-package` and `npm-publication-evidence` files under `.scratch/npm-release/`, use a clean checkout of the original release commit, and run:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run build:docs:registry -- --receipt .scratch/npm-release/published.json
```

The result is `.scratch/npm-release/docs-static/`. This command does not publish and does not resolve a floating dist-tag. It rejects a dirty candidate, a dirty release checkout, mismatched source or dependency locks, and any registry tarball that differs from the validated candidate. A local package test may run on uncommitted changes, but its receipt is marked dirty and cannot be used as the release artifact. Revalidate from the clean release checkout before publication.

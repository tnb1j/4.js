# 4.js GitHub Deployment Preparation

**Prepared:** August 7, 2026
**Project:** `fourjs@0.185.1-four.0`
**Source state:** Extracted source snapshot with no `.git` directory, commits, tags, branches, or verifiable upstream commit hash.

## Repository Profile

The measurements below exclude `node_modules`, `.puppeteer_profile`, generated E2E output, and ignored `*.tgz` package archives.

| Metric | Current Value |
| --- | ---: |
| Files | 6,067 |
| Working-tree size | 593.77 MiB |
| Files over 50 MiB | 0 |
| Files over 100 MiB | 0 |
| Selected Git LFS files | 7 |
| Selected Git LFS payload | 122.16 MiB |

| Directory | Size |
| --- | ---: |
| `examples/` | 422.20 MiB |
| `manual/` | 123.90 MiB |
| `build/` | 20.75 MiB |
| `docs/` | 9.70 MiB |
| `test/` | 8.57 MiB |
| `src/` | 4.37 MiB |
| `editor/` | 1.72 MiB |
| `files/` | 1.18 MiB |
| `devtools/` | 0.89 MiB |
| `utils/` | 0.32 MiB |

GitHub warns when a regular Git object is larger than 50 MiB and blocks files larger than 100 MiB. GitHub also recommends keeping repositories ideally below 1 GB and strongly recommends keeping them below 5 GB. This snapshot is below those limits, but the selected large binary assets should use Git LFS to avoid repeatedly storing their full content in normal Git history.

## Git LFS Plan

Use exact path rules, not extension-wide rules. The repository already contains these entries in `.gitattributes`.

| File | Size |
| --- | ---: |
| `examples/models/ifc/rac_advanced_sample_project.ifc` | 40.85 MiB |
| `examples/models/gltf/Xbot.blend` | 22.98 MiB |
| `examples/models/gltf/kira.glb` | 11.61 MiB |
| `examples/models/gltf/BoomBox.glb` | 10.73 MiB |
| `manual/examples/resources/models/windmill_2/windmill_normal.tga` | 12.00 MiB |
| `manual/examples/resources/models/windmill_2/windmill_diffuse.tga` | 12.00 MiB |
| `manual/examples/resources/models/windmill_2/windmill_spec.tga` | 12.00 MiB |
| **Total** | **122.16 MiB** |

Initial setup:

```powershell
git init -b main
git lfs install

git add .gitattributes
git add examples/models/ifc/rac_advanced_sample_project.ifc
git add examples/models/gltf/Xbot.blend
git add examples/models/gltf/kira.glb
git add examples/models/gltf/BoomBox.glb
git add manual/examples/resources/models/windmill_2/windmill_normal.tga
git add manual/examples/resources/models/windmill_2/windmill_diffuse.tga
git add manual/examples/resources/models/windmill_2/windmill_spec.tga

git lfs ls-files
git lfs fsck
```

Attribute verification:

```powershell
git check-attr filter diff merge text -- `
  examples/models/ifc/rac_advanced_sample_project.ifc `
  examples/models/gltf/Xbot.blend `
  examples/models/gltf/kira.glb `
  examples/models/gltf/BoomBox.glb `
  manual/examples/resources/models/windmill_2/windmill_normal.tga `
  manual/examples/resources/models/windmill_2/windmill_diffuse.tga `
  manual/examples/resources/models/windmill_2/windmill_spec.tga
```

Expected for every listed file:

```text
filter: lfs
diff: lfs
merge: lfs
text: unset
```

Git LFS storage and download bandwidth are metered against the repository owner's account. GitHub Actions downloads of LFS files also consume that account's LFS bandwidth. Confirm the owner or organization budget and alerts before enabling the E2E matrix on every pull request.

## Ignore Strategy

The existing `.gitignore` intentionally excludes:

| Category | Patterns |
| --- | --- |
| Dependencies | `**/node_modules` |
| Local tools and editors | `.claude/`, `.idea/`, `.project`, `.puppeteer_profile/`, `.vs/`, `.vscode/`, `*.swp` |
| Local secrets | `.env`, `.env.*`, with `!.env.example` allowed |
| Logs and caches | `*.log`, `.eslintcache`, `.cache/`, npm/pnpm/yarn debug logs |
| Generated test output | coverage, E2E screenshots, Playwright reports, tree-shake bundles, and `test/unit/build` |
| Package archives | `*.tgz` |
| OS metadata | `.DS_Store` |

`build/` and `docs/` are deliberately not ignored:

- Retain `build/` because direct browser imports, compatibility bundles, and npm packaging consume it.
- Retain `docs/` if the repository will publish static API documentation or provide generated docs in source snapshots.
- Treat both as generated artifacts: regenerate them from reviewed source changes and do not hand-edit generated files.
- Keep npm tarballs out of Git. Publish them through npm and/or attach them to a GitHub Release.

## Size Optimization

- [x] Exclude dependency installs, browser profiles, caches, reports, and package archives.
- [x] Put the seven current large binary/model assets in Git LFS.
- [ ] Run `git-sizer` after the first commit and after any major asset import.
- [ ] Avoid committing duplicate archives of `examples/`, `manual/`, `build/`, or `docs/`.
- [ ] Use GitHub Releases for distributable archives rather than normal Git objects.
- [ ] Require new binary assets to include provenance, license information, and a size justification.

There is no history to squash in this extracted snapshot. If upstream Git history is imported later, perform that import before the public launch, then use `git filter-repo` only from a backed-up clone if large objects or secrets must be removed. Rewriting public history after contributors clone the repository should be avoided.

Useful local measurements after initialization:

```powershell
git count-objects -vH
git lfs ls-files --size
git-sizer --verbose
```

## Initial Commit Structure

Create reviewable commits rather than one initial 594 MiB snapshot commit.

| Order | Suggested Commit | Scope |
| ---: | --- | --- |
| 1 | `chore(repo): establish licensing and repository policy` | Unchanged MIT `LICENSE`, `NOTICE`, `UPSTREAM.md`, `SECURITY.md`, Code of Conduct, issue templates, `.gitignore`, and `.gitattributes` |
| 2 | `chore(build): establish 4.js package and compatibility identity` | `package.json`, lockfile, canonical Four entrypoints, legacy wrappers, build identity, Rollup configuration, and devtools bridge |
| 3 | `docs(migration): rebrand project documentation and add migration tooling` | README, migration guide, changelog, `four-migrate`, rebrand synchronization, docs templates, and LLM docs generation |
| 4 | `feat(core): add diagnostics, capabilities, scheduling, and render graph APIs` | `CapabilitiesReport`, `Diagnostics`, `AssetScheduler`, `RenderGraph`, exports, and focused unit tests |
| 5 | `feat(temporal): add the TemporalPipeline and display nodes` | `TemporalPipeline`, `TAAUNode`, `SharpenNode`, addon wrappers, example, screenshot, and focused unit tests |
| 6 | `test(ci): add compatibility, migration, package, and browser gates` | Rebranding tests, migration tests, CI, CodeQL branch coverage, and E2E coverage configuration |
| 7 | `chore(release): regenerate distribution bundles and API docs` | Final Node.js 26 `build/`, generated `docs/`, and synchronized `llms*.txt` files |

Before each commit:

```powershell
git diff --cached --check
git status --short
```

The initial imported Three.js r185 snapshot contains pre-existing trailing whitespace and blank-line-at-EOF warnings. Record that baseline without mass-formatting unrelated upstream files; treat new warnings in 4.js-authored changes as blocking after the import commit.

Do not publish any remote until the full staged content and commit boundaries have been reviewed.

## Remote Setup

Use deployment-time placeholders until the owner and repository name are decided:

```powershell
git remote add origin https://github.com/<github-owner>/<repository>.git
git remote -v
git push -u origin main
```

Do not replace `<github-owner>` or `<repository>` in tracked files until the final repository exists.

## Prepared Package

The locally verified package archive is:

```text
File:   fourjs-core-0.185.1-four.0.tgz
Size:   7,681,039 bytes
Files:  1,226
SHA256: C47540B827B551AA34BB35EBAED99B7C5A91BF38FB1F5923C8DDF12C03A98A59
```

The archive was installed into an isolated consumer and verified under Node.js 24.19.0 and Node.js 26.3.0. Keep the tarball outside normal Git history; use it for local verification, npm publication, or a GitHub Release asset.

## GitHub Configuration

- [ ] Set `main` as the default branch.
- [ ] Enable GitHub Actions and run the workflows once before selecting required checks.
- [ ] Protect `main`; require pull requests, at least one approving review, resolved conversations, and successful CI/CodeQL checks.
- [ ] Keep force pushes and branch deletion disabled for `main`.
- [ ] Select the exact unique status-check names produced by the first workflow run.
- [ ] Confirm the E2E checkout uses `lfs: true`; Actions checkout does not fetch LFS objects by default.
- [ ] Enable private vulnerability reporting and test administrator/security-manager notifications.
- [ ] Configure a monitored private security contact and update `SECURITY.md`.
- [ ] Configure a private conduct-reporting channel and replace the current placeholder text in `.github/CODE_OF_CONDUCT.md`.
- [ ] Review repository visibility, contributor permissions, Actions permissions, Dependabot, and CodeQL settings.
- [ ] Verify the npm scope and package name at publication time; current availability checks do not reserve a name.
- [ ] Review the three current development-only transitive audit findings (`brace-expansion`, `js-yaml`, and `linkify-it`) without applying an automatic dependency rewrite.

## Clean-Clone Verification

Run this from a fresh machine or clean virtual machine with Git, Git LFS, npm 11, and a supported browser environment.

```powershell
git lfs install
git clone https://github.com/<github-owner>/<repository>.git
Set-Location <repository>
git lfs pull
git lfs fsck
git lfs ls-files

node --version
npm --version
npm ci
npm ls --all
```

Node.js 24 acceptance:

```powershell
npm run build
npm run lint-core
npm run lint-utils
npm run test-rebranding
npm run test-migrate
npm run test-unit
npm run test-unit-addons
npm run test-treeshake
npm run test-e2e-cov
node test/e2e/puppeteer.js webgl_geometry_cube webgpu_instance_mesh webgpu_upscaling_taau
```

Repeat the build and entrypoint parity check under Node.js 26:

```powershell
npm run build
npm run test-rebranding
```

Rebuild once more under the release Node.js version before packaging so committed distribution bundles have a known generator environment.

Package verification:

```powershell
npm pack --dry-run --json
npm pack --json

New-Item -ItemType Directory ..\fourjs-package-smoke
Set-Location ..\fourjs-package-smoke
npm init -y
npm install ..\<repository>\fourjs-core-0.185.1-four.0.tgz
```

The isolated consumer must verify:

- [ ] Native ESM and CommonJS.
- [ ] Native WebGPU and TSL.
- [ ] Legacy ESM and CommonJS.
- [ ] Legacy WebGPU and package-specific legacy TSL.
- [ ] Direct addon imports, including TAAU and sharpening wrappers.
- [ ] `four-migrate --version`, `--help`, check mode, and write mode.
- [ ] `LICENSE`, `NOTICE`, `UPSTREAM.md`, `MIGRATION.md`, and `CHANGELOG.4JS.md` in the installed package.

Run the sharded complete E2E suite in GitHub Actions before tagging a public release. The local targeted screenshot checks do not replace that full release gate.

## License and Provenance

This section is general engineering guidance, not legal advice.

- Keep the original Three.js MIT `LICENSE` text and copyright notice unchanged.
- Include that license notice in all copies or substantial portions of the derivative software.
- Keep `NOTICE` and `UPSTREAM.md` in the repository and npm package to document derivative authorship and provenance.
- Do not redirect 4.js funding, issue support, security reports, or conduct reports to upstream Three.js maintainers.
- Complete a formal asset and dependency license review before public launch; this engineering audit did not produce a legal clearance opinion.

## Official References

- GitHub large-file limits: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- Configure Git LFS: https://docs.github.com/en/repositories/working-with-files/managing-large-files/configuring-git-large-file-storage
- Git LFS billing: https://docs.github.com/en/billing/concepts/product-billing/git-lfs
- Protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Private vulnerability reporting: https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configuring-private-vulnerability-reporting-for-a-repository
- Security policy guidance: https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository
- Actions checkout inputs: https://github.com/actions/checkout

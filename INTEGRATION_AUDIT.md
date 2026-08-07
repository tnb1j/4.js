# 4.js Integration Audit

**Audit date:** August 7, 2026
**Baseline:** Three.js r185 source snapshot, rebranded as `@tnb1j/4js@0.185.1-four.1`
**Scope:** Native and legacy modules, package exports, build scripts, examples, generated docs, migration tooling, repository automation, and release packaging.

## Findings

| File | Issue | Fix Applied | Reason |
| --- | --- | --- | --- |
| `examples/webgl_loader_gltf_progressive_lod.html`<br>`examples/webgl_renderer_pathtracer.html` | `four-migrate-preserve` comments were placed inside `type="importmap"` script blocks, making the blocks invalid JSON. | Moved each preservation comment immediately before its import-map script. | Import maps must remain valid JSON while the migration tool still needs an explicit directive to preserve third-party `three/examples/` specifiers. |
| `examples/webgpu_upscaling_taau.html` | The TemporalPipeline example did not map `@tnb1j/4js/tsl`; the browser failed while loading `Inspector.js` and rendered a black frame. | Added `@tnb1j/4js/tsl` to the example import map, targeting `../build/4.tsl.js`. | The example and its addon dependency now resolve all package-style specifiers natively in the browser. |
| `examples/screenshots/webgpu_upscaling_taau.jpg` | The E2E reference image represented the pre-integration temporal history/jitter output. | Regenerated only the TemporalPipeline reference after confirming the intended render and import-map fix. | Keeps screenshot comparison aligned with the approved feature without changing unrelated baselines. |
| `utils/build/rollup.config.js`<br>`package.json`<br>`build/three.tsl.package.js`<br>`test/rebranding/dual-entrypoints.js` | `@tnb1j/4js/legacy/tsl` resolved through raw `three/webgpu`, which required an unrelated installed `three` package. | Added a package-specific legacy TSL bundle that imports `@tnb1j/4js/legacy/webgpu`, mapped the package export to it, and added a binding-identity assertion. | Package consumers receive a self-contained compatibility surface while raw browser/import-map compatibility remains available through `build/three.tsl.js`. |
| `utils/docs/template/tmpl/layout.tmpl`<br>`utils/docs/template/static/index.html`<br>`utils/docs/template/static/styles/highlight-four.css`<br>`docs/` | Generated API pages retained upstream Three.js titles and style filenames after the source rebrand. | Updated the docs templates and generated output to use `4.js Docs` and `highlight-four.css`. | Prevents stale branding and broken stylesheet references in generated documentation. |
| `.github/FUNDING.yml`<br>`.github/ISSUE_TEMPLATE/config.yml`<br>`.github/CODE_OF_CONDUCT.md`<br>`.github/CONTRIBUTING.md`<br>`.github/renovate.json`<br>`.github/workflows/codeql-code-scanning.yml` | Operational links and contacts still routed 4.js users, funding, reports, or automation to upstream Three.js maintainers; CodeQL covered only `dev`. | Removed the upstream funding redirect, removed upstream support and reporting routes, replaced contribution commands with repository-neutral placeholders, removed the upstream Renovate PR URL, and covered both `main` and `dev` in CodeQL. | Attribution must remain, but the derivative project must not assign operational responsibility to upstream maintainers. |
| `utils/rebrand/sync-project.js` | Bulk brand synchronization would rewrite intentional upstream Three.js references in manually governed policy, audit, and deployment documents. | Excluded the Code of Conduct, integration audit, and deployment guide from automatic brand-text replacement. | Preserves accurate upstream attribution and operational-boundary language while keeping normal source/docs synchronization automated. |
| `.github/workflows/ci.yml` | CI did not build before entrypoint parity tests, did not run migration tests, did not verify Node.js 26 parity, and E2E checkout did not fetch LFS objects. | Added build, rebranding, and migration gates to Node.js 24; added a focused Node.js 26 build/parity job; enabled `lfs: true` for E2E checkout. | CI now exercises the dual package surface under both supported Node lines and supplies binary assets required by browser tests. |

## Integration Checks

- [x] Native ESM and CommonJS entrypoints share revision and constructor identity.
- [x] Legacy ESM and CommonJS entrypoints remain importable.
- [x] Native and legacy WebGPU and TSL entrypoints resolve without an external `three` package.
- [x] Direct addon imports resolve from the packaged artifact.
- [x] Migration check reports no pending package, namespace, or build-file rewrites in the audited source areas.
- [x] Project brand synchronization reports no pending changes.
- [x] All 42 repository JSON files parse successfully.
- [x] Example import audit parsed 608 modules with zero parse or resolution failures.
- [x] `npm ls --all --json` reports a complete installed dependency tree.
- [x] Targeted WebGL, WebGPU, and TemporalPipeline screenshot checks pass.
- [x] Git LFS and ignore rules were validated in a disposable repository.

## Release Verification

- [x] Node.js 26.3.0: production build completed.
- [x] Node.js 26.3.0: core lint and utility lint completed.
- [x] Node.js 26.3.0: rebranding parity and migration tests completed.
- [x] Node.js 26.3.0: core unit suite reported 1,326 passed, 1 todo, and 0 failed.
- [x] Node.js 26.3.0: addon unit suite reported 15 passed and 0 failed.
- [x] Node.js 26.3.0: WebGL, WebGPU, and WebGPU-nodes tree-shake builds completed.
- [x] Node.js 24.19.0: production build and rebranding parity completed.
- [x] Node.js 24.19.0: core unit suite reported 1,326 passed, 1 todo, and 0 failed.
- [x] Node.js 24.19.0: addon unit suite reported 15 passed and 0 failed.
- [x] Final production bundles were rebuilt under Node.js 26.3.0.
- [x] Targeted E2E checks passed: `webgl_geometry_cube` 0.0%, `webgpu_instance_mesh` 0.1%, and `webgpu_upscaling_taau` 0.0%.
- [x] `npm pack --dry-run` reported 1,226 files, 7.33 MiB packed, and 32.73 MiB unpacked, with no required files missing and no forbidden docs/test/dependency files.
- [x] The real `tnb1j-4js-0.185.1-four.1.tgz` archive was created and installed into an isolated consumer.
- [x] The isolated package passed native and legacy ESM/CommonJS, WebGPU, TSL, GLTFLoader, TAAU, sharpening, provenance-file, and migration CLI checks under Node.js 24 and Node.js 26.
- [x] The isolated consumer contained no separately installed `three` package and reported zero vulnerabilities.
- [x] The production dependency audit reported zero vulnerabilities.
- [x] Ports `1234` and `8080` were not listening after verification.

## Verification Boundary

- The complete E2E screenshot suite did not finish within the earlier full-run time limit, so it is not reported as passing.
- The targeted E2E set covers `webgl_geometry_cube`, `webgpu_instance_mesh`, and `webgpu_upscaling_taau`.
- GitHub-hosted Actions have not run because this source snapshot is not yet connected to a GitHub repository.
- The extracted source contains no Git metadata, so an exact upstream commit hash cannot be proven from this directory.
- The full development dependency audit reports three high-severity transitive advisories in `brace-expansion`, `js-yaml`, and `linkify-it`; production dependencies report zero vulnerabilities. No automatic audit fix was applied.
- The installed formal OSS-review workflow could not run because its required legal practice profile is not configured. License statements in this project are general engineering guidance, not a legal clearance opinion.

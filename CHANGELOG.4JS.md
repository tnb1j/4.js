# 4.js Change Log

This file records changes introduced by the 4.js fork. Upstream Three.js
history remains attributable through [UPSTREAM.md](UPSTREAM.md).

## 0.186.1-four.0 - 2026-09-30

### Upstream Upgrade (Three.js r186)

- Synchronized full codebase with Three.js r186 release (`0.186.1`).
- Added upstream interactive `tsl/` playground and guide, including 685 TSL exports in `4.tsl.js`.
- Added upstream modules: `TextureSource.js`, `DirectRenderPipeline.js`, `ReferenceElementNode.js`, `Packed4x8IntegerNode.js`, and `src/nodes/materialx/` (`MaterialXColor.js`, `MaterialXColorTransform.js`, `MaterialXCore.js`, `MaterialXNoise.js`).
- Preserved backward compatibility for `Source.js` (re-exporting from `TextureSource.js` with `isSource` flag).
- Synchronized all unit tests from Three.js r186 (`test/unit/addons/tsl/*.tests.js`, `TextureSource.tests.js`, loader tests).
- Replaced legacy manual language directories with r186 flat page structure (`manual/pages/*.html`) and integrated origin-safe `redirectLegacyLanguage()` handling.

### Enhancements & Fixes

- **TypeScript Definitions**: Added native, first-class `.d.ts` declaration files (`types/index.d.ts`, `types/webgpu.d.ts`, `types/tsl.d.ts`, `types/addons.d.ts`, `types/legacy.d.ts`) exported via package `types` and `exports`.
- **Local Dev Server (`utils/server.js`)**: Added missing 3D MIME types (`.ply`, `.splat`, `.ksplat`, `.obj`, `.mtl`, `.dae`, `.stl`, `.3mf`, `.amf`, `.bvh`, `.drc`, `.tif`, `.gcode`, `.pcd`, `.vox`, `.vrm`, `.usdz`, `.basis`, `.zip`), CORS headers (`Access-Control-Allow-Origin: *`), `OPTIONS` preflight, `HEAD` method support, and robust byte-range request validation with HTTP 416 responses.
- **Node Pipeline Fix**: Added missing `NodeUpdateType` import in `SharpenNode.js` and eliminated circular dependency in `SharpenNode` and `TAAUNode`.
- **WebGLRenderLists Bug Fix**: Fixed crash when `camera` argument is omitted in `WebGLRenderList.push()`.
- **Windows Rollup Concurrency**: Resolved file-lock write collision on Windows by deduplicating core bundle write steps.
- **Unit Test Runner**: Fixed `puppeteer.unit.js` race condition by waiting for `window._QUnitStats`.

## 0.185.1-four.2 - 2026-08-19

### Fixes

- Migrated deprecated `PCFSoftShadowMap` to `PCFShadowMap` in the editor and
  examples; `PCFShadowMap` now applies the same soft filtering, so saved scenes
  stop emitting the WebGLShadowMap deprecation warning.
- Made the offscreen-canvas security tests tolerant of slow software
  (SwiftShader) rendering, eliminating a flaky blank-canvas failure on CI.

## 0.185.1-four.1 - 2026-08-07

### Packaging

- Changed the npm package identity to `@tnb1j/4js` after npm rejected the
  unscoped `fourjs` name because it was too similar to an existing package.
- Retained the `preview` distribution tag and all native and legacy entry
  points.
- No runtime API changes were introduced relative to `0.185.1-four.0`.
- `0.185.1-four.0` was tagged in Git but was not published to npm.

## 0.185.1-four.0 - 2026-08-07

### Identity

- Rebranded the canonical project, source entry points, documentation, examples,
  and generated bundles as 4.js.
- Adopted `FOUR` as the native namespace and `fourjs` as the package name.
- Added native `4.*` builds and compatibility `three.*` builds from one source.
- Added migration tooling for package names, namespaces, import maps, and build
  filenames.

### Features

- Added `CapabilitiesReport`.
- Added structured `Diagnostics`.
- Added prioritized `AssetScheduler`.
- Added experimental `RenderGraph`.
- Added `TemporalPipeline` for WebGPU temporal antialiasing and upscaling.

### Compatibility

- Retained legacy source entry wrappers and legacy bundle exports.
- Preserved the original MIT license and Three.js copyright notice.

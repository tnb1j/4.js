# 4.js Change Log

This file records changes introduced by the 4.js fork. Upstream Three.js
history remains attributable through [UPSTREAM.md](UPSTREAM.md).

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

# 4.js Change Log

This file records changes introduced by the 4.js fork. Upstream Three.js
history remains attributable through [UPSTREAM.md](UPSTREAM.md).

## 0.185.1-four.0 - 2026-08-07

### Identity

- Rebranded the canonical project, source entry points, documentation, examples,
  and generated bundles as 4.js.
- Adopted `FOUR` as the native namespace and `@fourjs/core` as the package name.
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

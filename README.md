# 4.js

4.js is an enhanced, backward-compatible fork of Three.js r185 for modern
WebGL, WebGPU, and WebXR applications. The native package is `@fourjs/core`,
and the recommended namespace is `FOUR`.

This repository is an independent derivative project. It is not an official
Three.js release. See [UPSTREAM.md](UPSTREAM.md), [NOTICE](NOTICE), and
[LICENSE](LICENSE) for provenance and licensing details.

## Experimental Preview

This repository is an experimental public preview, not a stable release.
Build, lint, unit, migration, and entry-point compatibility checks are release
gates. The inherited screenshot comparison suite is available as a manually
triggered CI check while its cross-environment reference differences are
reviewed. Screenshot baselines are not regenerated automatically.

## Requirements

- Node.js 24 or newer
- npm 11 (authoritative package manager)

Node.js 26 is also used for verification.

## Install

`@fourjs/core` is the intended package identity, but it has not been published
to npm. For this preview, clone the repository and use `npm ci`. The following
command is reserved for a future package release:

```sh
npm install @fourjs/core
```

```js
import * as FOUR from '@fourjs/core';

const scene = new FOUR.Scene();
const camera = new FOUR.PerspectiveCamera( 70, innerWidth / innerHeight, 0.01, 100 );
const renderer = new FOUR.WebGLRenderer( { antialias: true } );

renderer.setSize( innerWidth, innerHeight );
document.body.appendChild( renderer.domElement );
```

WebGPU and TSL use dedicated entry points:

```js
import * as FOUR from '@fourjs/core/webgpu';
import { color, pass } from '@fourjs/core/tsl';
```

Addons remain available under the familiar addon layout:

```js
import { OrbitControls } from '@fourjs/core/addons/controls/OrbitControls.js';
```

## Migration

The repository ships a migration utility:

```sh
npx four-migrate --check src
npx four-migrate --write src
```

Legacy bundles and entry points remain available during the compatibility
window. See [MIGRATION.md](MIGRATION.md) for package aliases, import maps,
namespace changes, and staged migration guidance.

## 4.js APIs

- `FOUR.CapabilitiesReport`: portable renderer and platform capability reports
- `FOUR.Diagnostics`: structured, bounded diagnostic event collection
- `FOUR.AssetScheduler`: prioritized, cancellable asset task scheduling
- `FOUR.RenderGraph`: experimental dependency-aware render task graph
- `FOUR.TemporalPipeline`: WebGPU temporal antialiasing and upscaling pipeline

## Development

```sh
npm ci
npm run build
npm test
npm run test-rebranding
npm run test-migrate
```

Run the development server with:

```sh
npm run dev
```

The source tree is intentionally large because it includes examples, manual
content, and test assets. See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) before
publishing a new repository.

## License

4.js is distributed under the MIT License inherited from Three.js. The
original copyright and permission notice must remain with copies or substantial
portions of the software. Modified distributions should also retain
[NOTICE](NOTICE).

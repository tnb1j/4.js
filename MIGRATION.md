# Migrating from Three.js to 4.js

4.js r185 compatibility is designed for staged adoption. New code should use
`@tnb1j/4js` and the `FOUR` namespace. Existing projects can retain legacy
imports temporarily while migrating file by file.

## Direct Migration

```diff
- import * as THREE from 'three';
- import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
+ import * as FOUR from '@tnb1j/4js';
+ import { OrbitControls } from '@tnb1j/4js/addons/controls/OrbitControls.js';

- const scene = new THREE.Scene();
+ const scene = new FOUR.Scene();
```

WebGPU and TSL:

```diff
- import * as THREE from 'three/webgpu';
- import { pass } from 'three/tsl';
+ import * as FOUR from '@tnb1j/4js/webgpu';
+ import { pass } from '@tnb1j/4js/tsl';
```

## Automated Migration

Dry-run:

```sh
npx four-migrate --check src examples
```

Apply:

```sh
npx four-migrate --write src examples
```

Available controls:

```text
--no-build-files
--no-namespace
--no-package
```

The transformer updates package specifiers, import-map keys, standard build
filenames, `THREE` namespace bindings, and `@three_import` documentation tags.
Review generated diffs before committing, particularly files that intentionally
refer to third-party packages or historical upstream material.

## Package Alias Bridge

Projects that cannot change every `three` import immediately may install the
same 4.js version under both names:

```json
{
  "dependencies": {
    "@tnb1j/4js": "0.185.1-four.1",
    "three": "npm:@tnb1j/4js@0.185.1-four.1"
  }
}
```

Keep `@tnb1j/4js` installed during this bridge because migrated 4.js addons
use the native package name internally.

## Import Map Bridge

```html
<script type="importmap">
{
  "imports": {
    "@tnb1j/4js": "./build/4.module.js",
    "@tnb1j/4js/addons/": "./examples/jsm/",
    "three": "./build/three.module.js",
    "three/addons/": "./examples/jsm/"
  }
}
</script>
```

The `three.*` files are compatibility builds generated from the same canonical
4.js source as the native `4.*` files.

## Package Entry Points

| Import | Purpose |
| --- | --- |
| `@tnb1j/4js` | Native WebGL entry |
| `@tnb1j/4js/webgpu` | Native WebGPU entry |
| `@tnb1j/4js/tsl` | Native TSL entry |
| `@tnb1j/4js/legacy` | Legacy-named WebGL bundle |
| `@tnb1j/4js/legacy/webgpu` | Legacy-named WebGPU bundle |
| `@tnb1j/4js/legacy/tsl` | Legacy-named TSL bundle |

## Migration Checklist

- [ ] Replace package specifiers with `@tnb1j/4js`.
- [ ] Rename application namespace bindings from `THREE` to `FOUR`.
- [ ] Update build filenames from `three.*` to `4.*`.
- [ ] Keep third-party package names unchanged.
- [ ] Run the application test suite and representative examples.
- [ ] Remove the `three` npm alias after all legacy imports are gone.
- [ ] Replace compatibility entry points with native entry points.

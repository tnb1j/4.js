# SimplifyModifier

This class can be used to modify a geometry by simplifying it. A typical use case for such a modifier is automatic LOD generation.

The implementation is based on [Progressive Mesh type Polygon Reduction Algorithm](https://web.archive.org/web/20230610044040/http://www.melax.com/polychop/) by Stan Melax in 1998.

## Code Example

```js
const modifier = new SimplifyModifier();
geometry = modifier.modify( geometry );
```

## Import

SimplifyModifier is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { SimplifyModifier } from '@fourjs/core/addons/modifiers/SimplifyModifier.js';
```

## Constructor

### new SimplifyModifier()

## Methods

### .modify( geometry : BufferGeometry, count : number ) : BufferGeometry

Returns a new, modified version of the given geometry by applying a simplification. Please note that the resulting geometry is always non-indexed.

**geometry**

The geometry to modify.

**count**

The number of vertices to remove.

**Returns:** A new, modified geometry.

## Source

[examples/jsm/modifiers/SimplifyModifier.js](../../examples/jsm/modifiers/SimplifyModifier.js)
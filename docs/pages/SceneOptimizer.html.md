# SceneOptimizer

This class can be used to optimized scenes by converting individual meshes into [BatchedMesh](BatchedMesh.html). This component is an experimental attempt to implement auto-batching in 4.js.

## Import

SceneOptimizer is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { SceneOptimizer } from '@fourjs/core/addons/utils/SceneOptimizer.js';
```

## Constructor

### new SceneOptimizer( scene : Scene, options : SceneOptimizer~Options )

Constructs a new scene optimizer.

**scene**

The scene to optimize.

**options**

The configuration options.

## Methods

### .disposeMeshes( meshesToRemove : Set.<Mesh> )

Removes the given array of meshes from the scene.

**meshesToRemove**

The meshes to remove.

### .removeEmptyNodes( object : Object3D )

Removes empty nodes from all descendants of the given 3D object.

**object**

The 3D object to process.

### .toBatchedMesh() : Scene

Performs the auto-baching by identifying groups of meshes in the scene that can be represented as a single [BatchedMesh](BatchedMesh.html). The method modifies the scene by adding instances of `BatchedMesh` and removing the now redundant individual meshes.

**Returns:** The optimized scene.

### .toInstancingMesh() : Scene (abstract)

Performs the auto-instancing by identifying groups of meshes in the scene that can be represented as a single [InstancedMesh](InstancedMesh.html). The method modifies the scene by adding instances of `InstancedMesh` and removing the now redundant individual meshes.

This method is not yet implemented.

**Returns:** The optimized scene.

## Type Definitions

### .Options

Constructor options of `SceneOptimizer`.

**debug**  
boolean

Whether to enable debug mode or not.

Default is `false`.

## Source

[examples/jsm/utils/SceneOptimizer.js](../../examples/jsm/utils/SceneOptimizer.js)
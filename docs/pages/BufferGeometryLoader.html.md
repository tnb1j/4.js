*Inheritance: Loader →*

# BufferGeometryLoader

Class for loading geometries. The files are internally loaded via [FileLoader](FileLoader.html).

## Code Example

```js
const loader = new FOUR.BufferGeometryLoader();
const geometry = await loader.loadAsync( 'models/json/pressure.json' );
const material = new FOUR.MeshBasicMaterial( { color: 0xF5F5F5 } );
const object = new FOUR.Mesh( geometry, material );
scene.add( object );
```

## Constructor

### new BufferGeometryLoader( manager : LoadingManager )

Constructs a new geometry loader.

**manager**

The loading manager.

## Methods

### .load( url : string, onLoad : function, onProgress : onProgressCallback, onError : onErrorCallback )

Starts loading from the given URL and pass the loaded geometry to the `onLoad()` callback.

**url**

The path/URL of the file to be loaded. This can also be a data URI.

**onLoad**

Executed when the loading process has been finished.

**onProgress**

Executed while the loading is in progress.

**onError**

Executed when errors occur.

**Overrides:** [Loader#load](Loader.html#load)

### .parse( json : Object ) : BufferGeometry

Parses the given JSON object and returns a geometry.

**json**

The serialized geometry.

**Overrides:** [Loader#parse](Loader.html#parse)

**Returns:** The parsed geometry.

## Source

[src/loaders/BufferGeometryLoader.js](../../src/loaders/BufferGeometryLoader.js)
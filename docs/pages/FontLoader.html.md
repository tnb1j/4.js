*Inheritance: Loader →*

# FontLoader

A loader for loading fonts.

You can convert fonts online using [facetype.js](https://gero3.github.io/facetype.js/).

## Code Example

```js
const loader = new FontLoader();
const font = await loader.loadAsync( 'fonts/helvetiker_regular.typeface.json' );
```

## Import

FontLoader is an addon, and must be imported explicitly, see [Installation#Addons](../../manual/#en/installation).

```js
import { FontLoader } from '@tnb1j/4js/addons/loaders/FontLoader.js';
```

## Constructor

### new FontLoader( manager : LoadingManager )

Constructs a new font loader.

**manager**

The loading manager.

## Methods

### .load( url : string, onLoad : function, onProgress : onProgressCallback, onError : onErrorCallback )

Starts loading from the given URL and passes the loaded font to the `onLoad()` callback.

**url**

The path/URL of the file to be loaded. This can also be a data URI.

**onLoad**

Executed when the loading process has been finished.

**onProgress**

Executed while the loading is in progress.

**onError**

Executed when errors occur.

**Overrides:** [Loader#load](Loader.html#load)

### .parse( json : Object ) : Font

Parses the given font data and returns the resulting font.

**json**

The raw font data as a JSON object.

**Overrides:** [Loader#parse](Loader.html#parse)

**Returns:** The font.

## Source

[examples/jsm/loaders/FontLoader.js](../../examples/jsm/loaders/FontLoader.js)
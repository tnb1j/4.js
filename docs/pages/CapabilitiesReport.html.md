# CapabilitiesReport

Produces portable, serializable graphics capability reports.

The synchronous constructor captures environment, renderer, and WebGL data. Call [`refresh()`](CapabilitiesReport.html#refresh) with `requestAdapter: true` to request optional WebGPU adapter details.

## Constructor

### new CapabilitiesReport( options : Object )

Constructs a capability report.

**options**

Collection options.

**renderer**

Optional renderer.

Default is `null`.

**canvas**

Optional canvas used for WebGL probing.

Default is `null`.

**context**

Optional WebGL context.

Default is `null`.

**probeWebGL**

Whether to create a WebGL2 context when needed.

Default is `true`.

**globalObject**

Optional global object for testing or isolation.

Default is `null`.

## Properties

### .data : Object

The latest serializable report data.

### .isCapabilitiesReport : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

## Methods

### .refresh( options : Object ) : Promise.<CapabilitiesReport> (async)

Refreshes the report and optionally requests WebGPU adapter information.

**options**

Options merged with constructor options.

**requestAdapter**

Whether to request a WebGPU adapter.

Default is `false`.

**powerPreference**

Optional WebGPU power preference.

**adapter**

Existing adapter to inspect.

Default is `null`.

**Returns:** A promise resolving to this report.

### .toJSON() : Object

Returns a detached serializable report object.

**Returns:** Capability report data.

### .toString() : string

Returns formatted JSON suitable for bug reports.

**Returns:** Formatted report data.

## Static Methods

### .generate( options : Object ) : Promise.<CapabilitiesReport> (async)

Creates and refreshes a report.

**options**

Collection options.

**Returns:** The populated report.

## Source

[src/core/CapabilitiesReport.js](../../src/core/CapabilitiesReport.js)
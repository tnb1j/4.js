*Inheritance: EventDispatcher →*

# AssetTask

Represents one scheduled asset operation.

## Constructor

### new AssetTask( scheduler : AssetScheduler, key : *, executor : function, options : Object )

Constructs an asset task.

**scheduler**

Owning scheduler.

**key**

Deduplication key.

**executor**

Task executor.

**options**

Task options.

## Methods

### .cancel( reason : string ) : AssetTask

Cancels this task.

**reason**

Cancellation reason.

Default is `'Asset task cancelled.'`.

**Returns:** A reference to this task.

### .setPriority( priority : number ) : AssetTask

Updates the priority of a queued task.

**priority**

New priority.

**Returns:** A reference to this task.

## Source

[src/loaders/AssetScheduler.js](../../src/loaders/AssetScheduler.js)
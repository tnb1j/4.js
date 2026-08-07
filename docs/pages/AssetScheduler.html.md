*Inheritance: EventDispatcher →*

# AssetScheduler

Schedules asynchronous asset work with priorities, concurrency limits, cancellation, dependency blocking, and in-flight deduplication.

## Constructor

### new AssetScheduler( options : Object )

Constructs an asset scheduler.

**options**

Scheduler options.

**maxConcurrent**

Maximum concurrent tasks.

Default is `4`.

**retain**

Retain completed tasks for result reuse.

Default is `false`.

## Properties

### .isAssetScheduler : boolean (readonly)

This flag can be used for type testing.

Default is `true`.

## Methods

### .cancel( key : *, reason : * ) : boolean

Cancels one task.

**key**

Task key.

**reason**

Cancellation reason.

Default is `'Asset task cancelled.'`.

**Returns:** Whether a task was found.

### .cancelAll( reason : * ) : AssetScheduler

Cancels all pending and active tasks.

**reason**

Cancellation reason.

Default is `'All asset tasks cancelled.'`.

**Returns:** A reference to this scheduler.

### .clear() : AssetScheduler

Removes retained terminal tasks.

**Returns:** A reference to this scheduler.

### .enqueue( key : *, executor : function, options : Object ) : AssetTask

Alias for [`schedule()`](AssetScheduler.html#schedule).

**key**

Stable deduplication key.

**executor**

Task executor.

**options**

Task options.

**Returns:** The scheduled task.

### .get( key : * ) : AssetTask

Returns a task by key.

**key**

Task key.

**Returns:** The task, or `null`.

### .getStats() : Object

Returns scheduler counters.

**Returns:** Scheduler status.

### .has( key : * ) : boolean

Returns whether a task key is registered.

**key**

Task key.

**Returns:** Whether the key exists.

### .pause() : AssetScheduler

Pauses starting new tasks.

**Returns:** A reference to this scheduler.

### .resume() : AssetScheduler

Resumes starting queued tasks.

**Returns:** A reference to this scheduler.

### .schedule( key : *, executor : function, options : Object ) : AssetTask

Schedules asset work.

Scheduling the same key while a task is pending returns the existing task.

**key**

Stable deduplication key.

**executor**

Async or synchronous task executor.

**options**

Task options.

**priority**

Higher values run first.

Default is `0`.

**dependencies**

Tasks or promises that must resolve first.

**signal**

External cancellation signal.

Default is `null`.

**retain**

Retain this task after completion.

Default is `false`.

**Returns:** The scheduled or deduplicated task.

### .setConcurrency( maxConcurrent : number ) : AssetScheduler

Updates the concurrency limit.

**maxConcurrent**

Maximum concurrent tasks.

**Returns:** A reference to this scheduler.

### .setPriority( key : *, priority : number ) : AssetScheduler

Updates a queued task's priority.

**key**

Task key.

**priority**

New priority.

**Returns:** A reference to this scheduler.

### .whenIdle() : Promise.<void>

Returns a promise that resolves when no tasks remain pending or active.

**Returns:** Idle promise.

## Source

[src/loaders/AssetScheduler.js](../../src/loaders/AssetScheduler.js)
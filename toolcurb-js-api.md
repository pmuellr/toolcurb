toolcurb JavaScript API
================================================================================

Description of a JavaScript API over the toolcurb protocol.

When using the stand-alone JavaScript file for the browser, a global `toolcurb`
is installed, with the same value as the `toolcurb` module exports.



module `toolcurb`
================================================================================

The `toolcurb` module exports two functions:

* `createClient(opts, cb)`
* `createTarget(opts, cb)`


function `createClient(opts, cb)`
--------------------------------------------------------------------------------

Creates a new `Client` object, returned via the callback.  Returns nothing.

The `opts` parameter is an object that should have the following properties:

* `url`  - url to toolcurb server websocket
* `key`  - API key to toolcurb server
* `name` - short name

The `cb` parameter is a function of the form `cb(err, client)`, where:

* `err`    - on error, the error object
* `client` - on success, a `Client` object


function `createTarget(opts, cb)`
--------------------------------------------------------------------------------

Creates a new `Target` object, returned via the callback.  Returns nothing.

The `opts` parameter is an object that should have the following properties:

* `url`      - url to toolcurb server websocket
* `key`      - API key to toolcurb server
* `protocol` - application specific protocol name
* `name`     - short name

The `cb` parameter is a function of the form `cb(err, target)`, where:

* `err`    - on error, the error object
* `target` - on success, a `Target` object



`Client` objects
================================================================================

A `Client` object is an event emitter with the following methods:

* `getTargets(cb)`
* `attachTarget(targetID, cb)`
* `detachTarget(targetID, cb)`
* `sendRequest(targetID, body, cb)`

A `Client` object will emit the following events:

* `close`
* `error`
* `appEvent`
* `targetConnected`
* `targetDisconnected`


method `getTargets(cb)`
--------------------------------------------------------------------------------

Returns a list of connected targets.

The `cb` parameter is a function of the form `cb(err, targetIDs)`, where:

* `err`       - on error, the error object
* `targetIDs` - on success, an array of target id values


method `attachTarget(targetID, cb)`
--------------------------------------------------------------------------------

Attach the client to a target.

The `targetID` parameter is the id of the target being attached to.

The `cb` parameter is a function of the form `cb(err, targetID)`, where:

* `err`      - on error, the error object
* `targetID` - on success, the id of the target attached to


method `detachTarget(targetID, cb)`
--------------------------------------------------------------------------------

Detach the client from a target.

The `targetID` parameter is the id of the target being detached from.

The `cb` parameter is a function of the form `cb(err, targetID)`, where:

* `err`      - on error, the error object
* `targetID` - on success, the id of the target detached from


method `sendRequest(targetID, body, cb)`
--------------------------------------------------------------------------------

Send a request to a target.

The `targetID` parameter is the id of the target being detached from.

The `body` parameter is a JSON-able JavaScript object which serves as the
body of the request.

The `cb` parameter is a function of the form `cb(err, response)`, where:

* `err`      - on error, the error object
* `response` - on success, the body of the response


event `close`
--------------------------------------------------------------------------------

This event is emitted when the WebSocket is closed.  

The event listener is a function of the form `cb(reason)`, where:

* `reason` - the reason the WebSocket was closed


event `error`
--------------------------------------------------------------------------------

This event is emitted when the WebSocket has an error.  

The event listener is a function of the form `cb(err)`, where:

* `err` - the error object


event `appEvent`
--------------------------------------------------------------------------------

This event is emitted when an attached target emits an appEvent.

The event listener is a function of the form `cb(body)`, where:

* `body` - the JSON-able body of the event sent from the target


event `targetConnected`
--------------------------------------------------------------------------------

This event is emitted when an target connects.

The event listener is a function of the form `cb(targetID)`, where:

* `targetID` - the id of the connected target


event `targetDisconnected`
--------------------------------------------------------------------------------

This event is emitted when an target disconnects.

The event listener is a function of the form `cb(targetID)`, where:

* `targetID` - the id of the disconnected target



`Target` objects
================================================================================

A `Target` object is an event emitter with the following method:

* `sendEvent(body)`

A `Client` object will emit the following events:

* `close`
* `error`
* `appRequest`
* `clientsAttached`
* `clientsDetached`


method `sendEvent(body)`
--------------------------------------------------------------------------------

Send an appEvent to attached clients.

The `body` parameter is a JSON-able JavaScript object which serves as the
body of the event.


event `close`
--------------------------------------------------------------------------------

This event is emitted when the WebSocket is closed.  

The event listener is a function of the form `cb(reason)`, where:

* `reason` - the reason the WebSocket was closed


event `error`
--------------------------------------------------------------------------------

This event is emitted when the WebSocket has an error.  

The event listener is a function of the form `cb(err)`, where:

* `err` - the error object


event `appRequest`
--------------------------------------------------------------------------------

This event is emitted when a client sends a request.

The event listener is a function of the form `cb(request)`, where:

* `request` - a `Request` object


event `clientsAttached`
--------------------------------------------------------------------------------

This event is emitted when the first client attaches to the target.

The event listener is a function of the form `cb()`


event `clientsDetached`
--------------------------------------------------------------------------------

This event is emitted when the last client deattaches from the target.

The event listener is a function of the form `cb()`



`Request` objects
================================================================================

A `Request` object has the following property:

* `body`

A `Request` object has the following methods:

* `sendResponse(body)`
* `sendError(error)`


property `body`
--------------------------------------------------------------------------------

Contains the JSON-able body of the request sent from a client.


method `sendResponse(body)`
--------------------------------------------------------------------------------

Send a successful response to the client.

The `body` parameter is a JSON-able JavaScript object which serves as the
body of the response.


method `sendError(error)`
--------------------------------------------------------------------------------

Send an error response to the client.

The `error` parameter is an Error object or String describing the error.

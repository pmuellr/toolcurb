// Licensed under the Apache License. See footer for details.

var util   = require("util")
var events = require("events")

var pkg = require("../package.json")

var WS = getWS()

//------------------------------------------------------------------------------
exports.version       = pkg.version
exports.connectClient = connectClient
exports.connectTarget = connectTarget

//------------------------------------------------------------------------------
function connectClient(opts, cb) { connect("client", opts, cb) }
function connectTarget(opts, cb) { connect("target", opts, cb) }

//------------------------------------------------------------------------------
function connect(which, opts, cb) {
  ensureCB(cb)

  if (opts == null) cb(Error("opts is null"))

  var url      = opts.url
  var key      = opts.key
  var protocol = opts.protocol

  if (url   == null) return cb(Error("opts.url is null"))
  if (key   == null) return cb(Error("opts.key is null"))

  if (which == "target") {
    if (protocol == null) return cb(Error("opts.protocol is null"))
  }

  var agent

  switch(which) {
    case "target": agent = new Target(); break;
    case "client": agent = new Client(); break;
    default: return cb(Error("expecting client or target for agent"))
  }

  if (url.match(/^https?:/)) {
    url = url.replace(/^http/, "ws")
  }

  var opts = {
    url:      url,
    key:      key,
  }

  if (which == "target") {
    opts.protocol = protocol
  }

  agent._connect(opts, cb)
}

//------------------------------------------------------------------------------
function Agent() {
  events.EventEmitter.call(this)
}

//------------------------------------------------------------------------------
function Client() {
  Agent.call(this)

  this._requestID  = 0
  this._requestCBs = {}
}

//------------------------------------------------------------------------------
function Target() {
  Agent.call(this)
}

//------------------------------------------------------------------------------
util.inherits(Agent, events.EventEmitter)
util.inherits(Client, Agent)
util.inherits(Target, Agent)

//------------------------------------------------------------------------------
Agent.prototype._connect = function _connect(opts, cb) {
}

//------------------------------------------------------------------------------
Client.prototype.sendRequest = function sendRequest(targetID, request, cb) {
  this._requestID++
  if (this._requestID >= 256 * 256 * 256 * 256) this._requestID = 1

  this._requestCBs[this._requestID] = cb
}

//------------------------------------------------------------------------------
Client.prototype.getTargets = function getTargets(cb) {
}

//------------------------------------------------------------------------------
Client.prototype.attachTarget = function attachTarget(targetID) {
}

//------------------------------------------------------------------------------
Client.prototype.detachTarget = function detachTarget(targetID) {
}

//------------------------------------------------------------------------------
Target.prototype.sendEvent = function sendEvent(event) {
}

//------------------------------------------------------------------------------
function Command() {

}

Command.prototype.sendResponse = function sendResponse(response) {

}









//------------------------------------------------------------------------------
Agent.prototype.connect = function connect(cb) {
  var self = this

  self._ws  = new WS(self._url, "toolcurb-protocol")

  self._ws.onopen    = wsOnOpen
  self._ws.onmessage = wsOnMessage
  self._ws.onclose   = wsOnClose
  self._ws.onerror   = wsOnError

  self._sendObject({
    connect: self._type,
    key:     key
  })

  // ws.send(string message)
  // ws.close(int code, string reason)

  //-----------------------------------
  function wsOnOpen(event) {
    var message =

    console.log("ws opened")
    console.log("ws sending:  '" + message + "'")
    self
  }

  //-----------------------------------
  function wsOnMessage(event) {
  }

  //-----------------------------------
  function wsOnClose(event) {
  }

  //-----------------------------------
  function wsOnError(event) {
  }
}

//------------------------------------------------------------------------------
Agent.prototype._sendObject = function _sendObject(obj) {
  obj = JSON.stringify(obj, null, 2)
  this._ws.send(obj)
}

//------------------------------------------------------------------------------
function ensureCB(cb) {
  if (null == cb)              throw Error("callback is null")
  if (typeof cb != "function") throw Error("callback is not a function")
}

//------------------------------------------------------------------------------
function getWS() {
  if (typeof WebSocket != "undefined") return WebSocket

  return require("websocket").w3cwebsocket
}

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

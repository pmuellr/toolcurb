// Licensed under the Apache License. See footer for details.

var events = require("events")

var pkg = require("../../package.json")

var toolcurb = exports
toolcurb.version = pkg.version

var WS = getWS()

//------------------------------------------------------------------------------
// both functions expect an opts object with the following properties:
// - url:    URL to the toolcurb server WebSocket
// - proto:  toolcurb protocol to use
// - key:    API key
//
// returns a Client or Target object
//------------------------------------------------------------------------------
toolcurb.createClient = function createClient(opts) { return new Client(opts) }
toolcurb.createTarget = function createTarget(opts) { return new Target(opts) }

//------------------------------------------------------------------------------
// Client and Target objects share some behavior.
//
// obj.connect(cb)
//   This method creates a new session connected to the toolcurb server.
//   The callback will be passed `(err, session)`.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Client and Target Session objects share some behavior.

//------------------------------------------------------------------------------
// Client Session objects have the following behavior:
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
function Agent(opts) {
  if (opts       == null) throw Error("opts is null")
  if (opts.url   == null) throw Error("opts.url is null")
  if (opts.proto == null) throw Error("opts.proto is null")
  if (opts.key   == null) throw Error("opts.key is null")

  this._url   = opts.url
  this._proto = opts.proto
  this._key   = opts.key

  if (this._url.match(/^https?:/, "ws")) {
    this._url = this._url.replace(/^http/, "ws")
  }

  this._emitter = new events.EventEmitter()
  this._session = null
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
function Client(proto, key) {
  this._type = "client"

  Agent.call(this, url)

  this.onEvent = null
}

//------------------------------------------------------------------------------
Client.prototype.sendRequest = function sendRequest(request, cb) {
}

//------------------------------------------------------------------------------
function Target(proto, key) {
  this._type = "target"

  Agent.call(this, url)

  this.onRequest = null
}

//------------------------------------------------------------------------------
Target.prototype.sendEvent = function sendEvent(event) {
}


//------------------------------------------------------------------------------
function onLoad() {
  var url = location.origin.replace(/^http/, "ws")
  var ws  = new WebSocket(url + "/ws", "toolcurb-protocol")

  ws.onopen    = wsOnOpen
  ws.onmessage = wsOnMessage
  ws.onclose   = wsOnClose
  ws.onerror   = wsOnError

  //-----------------------------------
  function wsOnOpen(event) {
    var message = "hello!"

    console.log("ws opened")
    console.log("ws sending:  '" + message + "'")
    ws.send(message)
  }

  //-----------------------------------
  function wsOnMessage(event) {
    console.log("ws received: '" + event.data + "'")
    ws.close()
  }

  //-----------------------------------
  function wsOnClose(event) {
    console.log("ws closed")
  }

  //-----------------------------------
  function wsOnError(event) {
    console.log("ws error: " + event.error)
  }

}

SessionManager._sessions = {}

//------------------------------------------------------------------------------
SessionManager.getSessions = function getSessions() {
  var json = localStorage.getItem("toolcurb.sessions")
  var sessionsObj = JSON.parse(json)

  SessionManager._sessions = sessionsObj

  var result = []
  for (var key in sessionsObj) {
    var val = sessionsObj[key]
    val.key = key
    result.push(val)
  }

  return result
}

//------------------------------------------------------------------------------
SessionManager.setSession = function setSession(key, val) {
  SessionManager._sessions[key] = val
  SessionManager._saveSessions()
}

//------------------------------------------------------------------------------
SessionManager.delSession = function delSession(key, val) {
  delete SessionManager._sessions[key]
  SessionManager._saveSessions()
}

//------------------------------------------------------------------------------
SessionManager.getNewSessionKey = function getNewSessionKey(cb) {
  var options = { dataType: "json" }

  $.ajax("/api/v1/newSessionKey", options).done(done).fail(fail)

  function done(data, textStatus, jqXHR)  { cb(null, data.key) }
  function fail(jqXHR, textStatus, error) { cb(Error("" + error)) }
}

//------------------------------------------------------------------------------
SessionManager._saveSessions = function _saveSessions() {
  var sessionsObj = JSON.stringify(SessionManager._sessions, null, 2)

  localStorage.setItem("toolcurb.sessions", sessionsObj)
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

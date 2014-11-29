// Licensed under the Apache License. See footer for details.

var toolcurb = exports

if (!toolcurb.version) {
  var pkg = require("../package.json")
  toolcurb.version = pkg.version
}

//------------------------------------------------------------------------------
toolcurb.createClient = function createClient(url) { return new Client(url) }
toolcurb.createTarget = function createTarget(url) { return new Target(url) }

//------------------------------------------------------------------------------
function Agent(proto, key) {
  this._proto = proto

  this.onClose = null
  this.onError = null

  this._connect(key)
}

//------------------------------------------------------------------------------
Agent.prototype._sendObject = function _sendObject(obj) {
  obj = JSON.stringify(obj, null, 2)
  this._ws.send(obj)
}

//------------------------------------------------------------------------------
Agent.prototype._connect = function _connect(key) {
  var self = this

  self._url = location.origin.replace(/^http/, "ws")
  self._ws  = new WebSocket(self._url + "/ws", "toolcurb-protocol")

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
function Client(proto, key) {
  this._type = "client"

  Agent.call(this, url)

  this.onEvent = null
}

//------------------------------------------------------------------------------
Client.prototype.sendRequest = function sendRequest(request, cb) {
}

//------------------------------------------------------------------------------
Client.prototype.onEvent = null

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
})();




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

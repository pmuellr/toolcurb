!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.toolcurb=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../../package.json":3,"events":2,"websocket":undefined}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
module.exports={
    "name":               "toolcurb",
    "version":            "1.0.0",
    "description":        "a build tool in/for JavaScript",
    "author":             "pmuellr",
    "main":               "lib/toolcurb",
    "bin": {
      "toolcurbd":        "lib/toolcurbd.js"
    },
    "scripts": {
      "start":            "node lib/toolcurbd.js",
      "jbuild":           "jbuild",
      "watch":            "jbuild watch"
    },
    "homepage":           "https://github.com/pmuellr/toolcurb",
    "license":            "Apache-2.0",
    "repository": {
      "type":             "git",
      "url" :             "https://github.com/pmuellr/toolcurb.git"
    },
    "dependencies": {
        "async":          "0.9.x",
        "cfenv":          "1.0.x",
        "hapi":           "8.0.x",
        "underscore":     "1.7.x",
        "websocket":      "1.0.x"
    },
    "devDependencies": {
        "bower":          "1.3.x",
        "browserify":     "6.3.x",
        "cat-source-map": "0.1.x",
        "jbuild":         "1.0.x"
    }
}

},{}]},{},[1])(1)
});
// sourceMappingURL annotation removed by cat-source-map

//# sourceMappingURL=toolcurb-browser.js.map.json
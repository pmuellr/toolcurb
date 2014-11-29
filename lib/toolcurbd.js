// Licensed under the Apache License. See footer for details.

var URL    = require("url")
var PATH   = require("path")
var crypto = require("crypto")

var hapi      = require("hapi")
var cfenv     = require("cfenv")
var webSocket = require("websocket")

var utils    = require("./utils")
var toolcurb = require("./toolcurb")

var toolcurbd = exports

//------------------------------------------------------------------------------
toolcurbd.main = function main(args) {
  var appEnv = cfenv.getAppEnv()
  var server = new hapi.Server()

  server.connection({
    host:    URL.parse(appEnv.url).hostname,
    port:    appEnv.port,
    address: appEnv.bind
  })

  server.route({
    method:  "GET",
    path:    "/{param*}",
    handler: { directory: { path: "www" , listing: true} }
  })

  server.route({
    method:  "GET",
    path:    "/api/v1/newSessionKey",
    handler: get_newSessionKey
  })

  utils.log("version " + toolcurb.version)
  utils.log("server starting on " + appEnv.url)
  server.start(function() {
    utils.log("server started  on " + appEnv.url)
  })

  var wsServer = new webSocket.server({
    httpServer:            server.listener,
    autoAcceptConnections: false
  })

  wsServer.on("connect", webSocketConnect)
  wsServer.on("request", webSocketRequest)
  wsServer.on("close",   webSocketClose)
}

//------------------------------------------------------------------------------
var SessionKeyCount = 0
var SessionKeyMax   = 256 * 256 * 256 * 256

function get_newSessionKey(request, reply) {
  crypto.randomBytes(16, function(err, buffer) {
    if (err) return reply({err: "" + err})

    SessionKeyCount++
    if (SessionKeyCount >= SessionKeyMax) SessionKeyCount = 0

    result = base36(Date.now()) + "-" +
      base16(buffer.readUInt32BE( 0)) + "-" +
      base16(buffer.readUInt32BE( 4)) + "-" +
      base16(buffer.readUInt32BE( 8)) + "-" +
      base16(buffer.readUInt32BE(12))

    reply({key:result.toUpperCase()})
  })

  function base36(num) {
    return num.toString(36)
  }

  function base16(num) {
    return padLeft(num.toString(16), 8)
  }

  function padLeft(string, length) {
    while (string.length < length) string = "0" + string
    return string
  }
}

//------------------------------------------------------------------------------
function webSocketConnect(wsConnection) {
  utils.log("webSocketConnect: " + utils.wsc2s(wsConnection))
}

//------------------------------------------------------------------------------
function webSocketClose(wsConnection, closeReason, description) {
  utils.log("webSocketClose1: " + utils.wsc2s(wsConnection))
}

//------------------------------------------------------------------------------
function webSocketRequest(request) {
  console.log("webSocketRequest: " + request.resourceURL.pathname)
//  console.log("webSocketRequest: " + utils.JS(request.resourceURL))

  var path = request.resourceURL.pathname
  if (path != "/ws") {
    utils.log("webSocketRequest: invalid path '" + path + "'; rejected")
    return request.reject()
  }

  if (!originIsAllowed(request.origin)) {
    utils.log("webSocketRequest: origin '" + request.origin + "' is not allowed; rejected")
    return request.reject()
  }

  var wsConnection = request.accept("toolcurb-protocol", request.origin)
  utils.log("webSocketRequest: " + utils.wsc2s(wsConnection))

  wsConnection.on("message", webSocketMessage)
  wsConnection.on("close",   webSocketClose)

  //-----------------------------------
  function webSocketMessage(message) {
    utils.log("webSocketMessage: " + utils.wsc2s(wsConnection))

    if (message.type != "utf8") return

    var message = message.utf8Data

    utils.log("webSocketMessage: received: '" + message + "'")
    message = message.split("").sort().join("")
    utils.log("webSocketMessage: sending:  '" + message + "'")
    wsConnection.sendUTF(message)
  }

  //-----------------------------------
  function webSocketClose(reasonCode, description) {
    utils.log("webSocketClose2: " + utils.wsc2s(wsConnection))
  }

  //-----------------------------------
  function originIsAllowed(origin) {
    return true // TODO: add support for white-listed origins?
  }
}

//------------------------------------------------------------------------------
if (require.main == module) {
  utils.PROGRAM = PATH.basename(__filename).split(".")[0]
  toolcurbd.main(process.argv.slice(2))
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

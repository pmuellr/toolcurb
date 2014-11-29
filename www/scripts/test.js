// Licensed under the Apache License. See footer for details.

$(onLoad)

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

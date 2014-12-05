// Licensed under the Apache License. See footer for details.

var opts = {
  url:      location.origin,
  protocol: "sample",
  key:      "0",
}

toolcurb.connectTarget(opts, cbTargetConnect)

//------------------------------------------------------------------------------
function cbTargetConnect(err, target) {
  if (err) throw err

  target.on("close", function(){})
  target.on("error", function(error){})

  target.on("clientsAttached", function(){})
  target.on("clientsDetached", function(){})

  target.on("request", function(command){
    command.sendResponse(response)
  })

  target.sendEvent("connected")
}

//------------------------------------------------------------------------------

var opts = {
  url: location.origin,
  key: "0"
}

toolcurb.connectClient(opts, cbClientConnect)

//------------------------------------------------------------------------------
function cbClientConnect(err, client) {
  if (err) throw err

  client.on("close", function(){})
  client.on("error", function(error){})

  client.on("targetConnected",    function(target){})
  client.on("targetDisconnected", function(target){})

  client.on("event", function(event){})

  client.sendRequest(targetID, request, function(response){})
  client.getTargets(function(targets){})
  client.attachTarget(targetID)
  client.detachTarget(targetID)
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

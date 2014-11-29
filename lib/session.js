// Licensed under the Apache License. See footer for details.

var utils = require("./utils")

var _ = require("underscore")

var session = exports

//------------------------------------------------------------------------------
session.create = function create(wsc) {
  return new Session(wsc)
}

//------------------------------------------------------------------------------
function Session(wsc) {
  this._wsc     = wsc
  this._clients = {}
  this._targets = {}
}

//------------------------------------------------------------------------------
Session.hasConnections = function hasConnections() {
  var len = _.keys(this._clients).length + _.keys(this._targets).length
  return len != 0
}

//------------------------------------------------------------------------------
Session.addClient = function addClient(client) {
  this._clients[client.id] = client
}

//------------------------------------------------------------------------------
Session.addTarget = function addTarget(target) {
  this._targets[target.id] = client
}

//------------------------------------------------------------------------------
Session.delClient = function delClient(client) {
  delete this._clients[client.id]
}

//------------------------------------------------------------------------------
Session.delTarget = function delTarget(target) {
  delete this._targets[target.id]
}

//------------------------------------------------------------------------------
Session.gelClients = function getClients() {
  return _.extend({}, this._clients)
}

//------------------------------------------------------------------------------
Session.gelTargets = function getTargets() {
  return _.extend({}, this._targets)
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

// Licensed under the Apache License. See footer for details.

var app = angular.module("toolcurb", ["ngResource"])

app.controller("BodyController", BodyController)

//------------------------------------------------------------------------------
function BodyController($scope, $rootScope, $timeout, $sce, $location) {

  $scope.timeout           = $timeout
  $scope.sce               = $sce
  $scope.loc               = $location

  $scope.helpShown         = false
  $scope.message           = null

  $scope.toggleHelp = function() {
    ToggleHelp($scope)
  }

  //-----------------------------------
  $scope.inAng = function(label, fn) {
    // console.log("@ ang block: " + label)
    $scope.timeout(function() {
      // console.log("-> ang block: " + label)
      fn()
      // console.log("<- ang block: " + label)
    },1)
  }
}

//------------------------------------------------------------------------------
function ToggleHelp($scope) {
  $scope.helpShown = !$scope.helpShown
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

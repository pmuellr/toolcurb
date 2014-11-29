# Licensed under the Apache License. See footer for details.

pkg = require("./package.json")

#-------------------------------------------------------------------------------
tasks = defineTasks exports,
  watch: "watch for source file changes, build, restart server"
  build: "run a build"
  serve: "run the server stand-alone"
  bower: "get files from bower"

WatchSpec = "*.js lib lib/**/* www www/**/*"

#-------------------------------------------------------------------------------
mkdir "-p", "tmp"

#-------------------------------------------------------------------------------
tasks.build = ->
  tasks.bower()
  build_toolcurb_js()

#-------------------------------------------------------------------------------
tasks.watch = ->
  watchIter()

  watch
    files: WatchSpec.split " "
    run:   watchIter

  watchFiles "jbuild.coffee" :->
    log "jbuild file changed; exiting"
    process.exit 0

#-------------------------------------------------------------------------------
tasks.serve = ->
  log "restarting server at #{new Date()}"

  server.start "tmp/server.pid", "node", ["lib/toolcurbd"]

#-------------------------------------------------------------------------------
tasks.bower = ->
  copyBowerFiles "www/bower"

#-------------------------------------------------------------------------------
build_toolcurb_js = ->

  beg = """
    if (!window.toolcurb) {

      window.toolcurb = {
        inBrowser: true,
        version:   "#{pkg.version}"
      }

      ;(function(exports){
      //------------------- embed below -------------------

  """

  end = """
      //------------------- embed above -------------------
      })(window.toolcurb);
    }
  """

  contents = "#{beg}\n#{cat "lib/toolcurb.js"}\n#{end}"

  contents.to "www/scripts/toolcurb.js"

  log "generated www/scripts/toolcurb.js"

#-------------------------------------------------------------------------------
copyBowerFiles = (dir) ->

  bowerConfig = require "./bower-config"

  cleanDir dir

  for name, {version, files} of bowerConfig
    unless test "-d", "bower_components/#{name}"
      log "installing from bower: #{name} (#{version})"
      exec "node node_modules/.bin/bower install #{name}##{version}"
      log ""

  for name, {version, files} of bowerConfig
    for src, dst of files
      src = "bower_components/#{name}/#{src}"

      if dst is "."
        dst = "#{dir}/#{name}"
      else
        dst = "#{dir}/#{name}/#{dst}"

      mkdir "-p", dst

      cp "-R", src, dst

#-------------------------------------------------------------------------------
watchIter = ->
  tasks.build()
  tasks.serve()

#-------------------------------------------------------------------------------
cleanDir = (dir) ->
  mkdir "-p", dir
  rm "-rf", "#{dir}/*"

#-------------------------------------------------------------------------------
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------

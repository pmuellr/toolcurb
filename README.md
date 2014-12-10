toolcurb - diagnstic tool messaging protocol
================================================================================

`toolcurb` is a WebSocket protocol intended to be used by diagnostic tools
to communicate between the programs they are diagnosing and the diagnostic
tools themselves.

There are three types of programs communicating when using toolcurb:

* targets
* clients
* servers

A *target* is the program that is being interacted with; eg, the program you
are debugging.

A *client* is a program interacts with a *target*, to control the *target*;
eg, the debugger user interface.

A *server* is an HTTP server that *targets* and *clients* connect to, in order
to interact with each other. It acts as an HTTP server for *targets* and
*clients*.

A *client* can attach to a *target* in order to observe and control it, and
subsequently detach when no longer required.

A *target* can send protocol-specific events, and respond to protocol-specific
requests.  A *target* does not know what clients are attached to it.  A *target*
can be attached to multiple *clients* simultaneously.  Events are sent to each
attached client, but responses to requests are only sent to the client making
the request.

A *client* can listen to protocol-specific events from a *target*, and can send
requests to a *target* which will provide a response.  

The *clients* and *targets* use a unique *API key* to coordinate on, and limit
visibility.  You will need to use the same *API key* for *clients* and *targets*
to find each other, and you should only give your *API key* to others you would
like to access your *clients* and *targets*.

The *clients* and *targets* use a *protocol* name to identify what sort of
messages they will be sending between each other.



using toolcurb
================================================================================

You can program either to the
[WebSocket message protocol](toolcurb-ws-protocol.md)
or to the
[JavaScript API](toolcurb-js-api.md).
The server is also available as an API, described in the *JavaScript API*
document.

For node.js, the JavaScript API is available via the `toolcurb` package on npm:
<https://www.npmjs.com/package/toolcurb>

For the browser, you can either use
[browserify](https://www.npmjs.com/package/browserify)
with the npm package, or you can use the standalone file `toolcurb-browser.js`
which adds a `toolcurb` global, and otherwise is the same as the npm package.

A stand-alone server is available as the npm-installed command `toolcurbd`,
or you can use it programmatically via the *JavaScript API*.  The stand-alone
server takes no arguments, but will use the `PORT` environment variable, if set,
as the port to bind the server to; otherwise an port will be chosen and
displayed when the server starts.



hacking
================================================================================

This project uses [jbuild](https://www.npmjs.com/package/jbuild) as it's
build tool.  To rebuild the project continuously, use the command

    npm run watch

Other `jbuild` commands are available (assuming you are using npm v2) with
the command

    npm run jbuild -- <command here>

Run `npm run jbuild` to see the other commands available in the `jbuild.coffee`
file.



attributions
================================================================================

The file www/images/icon.png originated at the web site below, and is released
to the public domain.

<http://commons.wikimedia.org/wiki/File:Happy_face.svg>



license
================================================================================

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

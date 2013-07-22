var spawn = require('child_process').spawn
var join = require('path').join
var fs = require('fs')


module.exports = function start() {
  var args = process.argv.slice(3)
  var cwd = process.cwd()

  var appName = args[0] || 'app.js'
  var app = require(join(cwd, appName))

  var log = join(cwd, 'log', app.get('env') + '.log')
  var out = fs.openSync(log, 'a')
  var err = fs.openSync(log, 'a')

  var proc = spawn(join(__dirname, '../bin/cluster'), [appName], {
    detached: true,
    stdio: ['ignore', out, err]
  })

  proc.unref()

  // otherwise the process won't quit.
  // but according to child_process doc, this line is not necessary.
  // http://nodejs.org/api/child_process.html
  process.exit()
}
var spawn = require('child_process').spawn
var join = require('path').join
var fs = require('fs')


var pidjar = join(process.cwd(), 'tmp/pids')

function cleanup() {
  var pids = fs.readdirSync(pidjar)

  pids.forEach(function(pid) {
    pid = join(pidjar, pid)

    if (fs.existsSync(pid)) fs.unlinkSync(pid)
  })
}


module.exports = function stop(args, fn) {
  var pid = join(pidjar, 'master.pid')

  if (!fs.existsSync(pid)) return

  pid = fs.readFileSync(pid, 'utf-8').trim()

  var proc = spawn('kill', [pid], { stdio: 'inherit' })

  proc.on('close', function killed(code) {
    if (code === 0) cleanup()
    if (fn) fn(code)

    process.exit(code)
  })
}
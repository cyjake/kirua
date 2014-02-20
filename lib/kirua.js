var fs = require('fs')
var join = require('path').join
var cluster = require('cluster')
var spawn = require('child_process').spawn


// TODO: make pidjar customizable?
var pidjar = 'tmp/pids'

if (cluster.isMaster) {
  var counter = 0
  var numCPUs = require('os').cpus().length

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  fs.writeFileSync(join(pidjar, 'master.pid'), process.pid)

  cluster.on('exit', function(worker, code, signal) {
    var pidPath = join(pidjar, 'worker.' + worker.id + '.pid')

    if (fs.existsSync(pidPath)) fs.unlinkSync(pidPath)

    cluster.fork()
    console.log('Restarted worker process #' + worker.id)
  })

  cluster.on('fork', function(worker) {
    fs.writeFileSync(join(pidjar, 'worker.' + worker.id + '.pid'), worker.process.pid)
  })
}
else {
  try {
    var app = require(process.argv[2])
    var port = app.get('port')

    require('http').createServer(app).listen(port, function() {
      console.log('Listening on ' + port)
    })
  }
  catch (e) {
    console.error('Failed to start server:', e.stack)
  }
}

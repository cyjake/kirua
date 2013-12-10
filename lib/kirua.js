var fs = require('fs')
var join = require('path').join
var cluster = require('cluster')
var spawn = require('child_process').spawn


// TODO: make pidjar customizable?
var pidjar = 'tmp/pids'

if (cluster.isMaster) {
  var counter = 0
  var births = {}
  var numCPUs = require('os').cpus().length

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  fs.writeFileSync(join(pidjar, 'master.pid'), process.pid)

  cluster.on('exit', function(worker, code, signal) {
    var pidPath = join(pidjar, 'worker.' + worker.id + '.pid')

    if (fs.existsSync(pidPath)) {
      fs.unlinkSync(pidPath)
    }
    if (code !== 0 && (+new Date() - births[worker.id]) > 60000) {
      cluster.fork()
    }
  })

  cluster.on('fork', function(worker) {
    births[worker.id] = +new Date()
    fs.writeFileSync(join(pidjar, 'worker.' + worker.id + '.pid'), worker.process.pid)
  })

  cluster.on('online', function(worker) {
    if (++counter === numCPUs) process.send('done')
  })
}
else {
  var app = require(process.argv[2])
  var port = app.get('port')

  require('http').createServer(app).listen(port, function() {
    console.log('Listening on ' + port)
  })
}

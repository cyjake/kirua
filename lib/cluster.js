var program = require('commander')
var cluster = require('cluster')
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp').sync
var join = require('path').join
var numCPUs = require('os').cpus().length


program
  .usage('[options] <app.js>')
  .version(require('../package').version)
  .option('-p, --port [port]', 'Specify the port of the server', parseInt, 7000)
  .parse(process.argv)


var cwd = process.cwd()
var pidjar = join(cwd, 'tmp/pids')

if (!fs.existsSync(pidjar)) mkdirp(pidjar)

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  fs.writeFileSync(join(pidjar, 'master.pid'), process.pid)

  cluster.on('exit', function(worker, code, signal) {
    fs.unlinkSync(join(pidjar, 'worker.' + worker.id + '.pid'))
    if (code && code !== 0) cluster.fork()
  })

  cluster.on('fork', function(worker) {
    fs.writeFileSync(join(pidjar, 'worker.' + worker.id + '.pid'), worker.process.pid)
  })
}
else {
  var app = require(join(cwd, program.args.pop() || 'app.js'))
  var server = app.get('server')
  var port = app.get('port') || program.port

  server = server || require('http').createServer(app)

  server.listen(port, function(){
    console.log('Express server listening on port ' + port)
  })
}

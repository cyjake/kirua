var stop = require('./stop')
var start = require('./start')


module.exports = function restart(args) {
  stop(args, function(code) {
    if (code === 0) start(args)
  })
}
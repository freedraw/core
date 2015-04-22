var Native = require('native')
var emitter = require('fd/emitter')

module.exports = emitter({})

Native.hooks.runCommand = function(name) {
  exports.emit(name)
}

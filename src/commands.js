var emitter = require('emitter')

exports = emitter({})

Hooks.runCommand = function(name) {
  exports.emit(name)
}

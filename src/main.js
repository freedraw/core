var Editor = require('editor')
var css = require('css')

require('events')
require('commands')
require('extensions')

exports = new Editor()
Hooks.getData = exports.getData.bind(exports)
Hooks.loadData = exports.loadData.bind(exports)

css.load('theme/default/main.css').then(function() {
  exports.start()
}).done()

Native.done()

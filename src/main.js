var css = require('css')
css.load('theme/default/main.css')

var Editor = require('editor')
exports = new Editor().start()

Hooks.getData = exports.getData.bind(exports)
Hooks.loadData = exports.loadData.bind(exports)

Native.done()

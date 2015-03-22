var css = require('css')
css.load('theme/default/main.css')

var Editor = require('editor')
exports = new Editor().start()

Native.done()

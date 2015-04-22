var Editor = require('fd/editor')
var css = require('fd/css')
var Native = require('native')

require('fd/events')
require('fd/commands')
require('fd/extensions')

var editor = new Editor
module.exports = editor

Native.hooks.getData = editor.getData.bind(editor)
Native.hooks.loadData = editor.loadData.bind(editor)

css.load('theme/default/main.css').then(function() {
  editor.start()
}).done()

Native.done()

var h = require('html')

function Editor() {
  this.el = h('.editor')
}

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  return this
}

exports = Editor

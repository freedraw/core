var h = require('html')

function Editor() {
  this.el = h('.editor', [
    h('.layers-panel'),
    h('.canvas'),
    h('.inspector-panel')
  ])
}

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  return this
}

exports = Editor

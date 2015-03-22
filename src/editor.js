var h = require('html')
var Panel = require('panel')

function Editor() {
  this.layersPanel = new Panel(this, 215, h('.layers-panel'))
  this.inspectorPanel = new Panel(this, 215, h('.inspector-panel'))

  this.el = h('.editor', [
    this.layersPanel.el,
    h('.canvas'),
    this.inspectorPanel.el
  ])
}

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  return this
}

exports = Editor

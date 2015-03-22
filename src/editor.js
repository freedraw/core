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

Editor.prototype.getData = function(type) {
  throw new Error("Unimplemented")
}

Editor.prototype.loadData = function(type, data) {
  throw new Error("Unimplemented")
}

exports = Editor

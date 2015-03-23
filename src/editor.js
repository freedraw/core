var h = require('html')
var Panel = require('panel')
var MockInspector = require('mock-inspector')

function Editor() {
  this.layers = new Panel(215, h('.layers panel', [
    h('.panel-header'),
    h('.panel-content'),
    h('.panel-footer')
  ]))

  this.inspector = new MockInspector

  this.el = h('.editor', [
    this.layers.el,
    h('.canvas'),
    this.inspector.el
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

var h = require('html')
var Panel = require('panel')
var Canvas = require('canvas')
var Inspector = require('inspector')

function Editor() {
  this.layers = new Panel(215, h('.layers panel', [
    h('.panel-header'),
    h('.panel-content'),
    h('.panel-footer')
  ]))

  this.canvas = new Canvas(this)
  this.inspector = new Inspector(this)

  this.el = h('.editor', [
    this.layers.el,
    this.canvas.el,
    this.inspector.el
  ])
}

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  addEventListener('resize', this.onResize.bind(this))
  this.onResize()
  return this
}

Editor.prototype.onResize = function() {
  this.canvas.updateViewBox()
}

Editor.prototype.getData = function(type) {
  throw new Error('Unimplemented')
}

Editor.prototype.loadData = function(type, data) {
  if (type !== 'public.svg-image') throw new Error('Unimplemented')
  var document = new DOMParser().parseFromString(data, 'image/svg+xml')
  this.canvas.setDocument(document)
}

exports = Editor

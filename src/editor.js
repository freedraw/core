var h = require('html')
var Panel = require('panel')
var Canvas = require('canvas')
var Inspector = require('inspector')
var Vec2 = require('vec2')
var emitter = require('emitter')

function Editor() {
  this.layers = new Panel(215, h('.layers panel', [
    h('.panel-header'),
    h('.panel-content'),
    h('.panel-footer')
  ]))

  this.canvas = new Canvas(this)
  this.inspector = new Inspector(this)

  this._selection = null

  this.el = h('.editor', [
    this.layers.el,
    this.canvas.el,
    this.inspector.el
  ])
}

emitter(Editor.prototype)
emitter.property(Editor.prototype, 'selection')

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  addEventListener('resize', this.onResize.bind(this))
  this.layers.on('resize', this.onResize, this)
  this.onResize()
  this.canvas.center = new Vec2(30, -20)
  this.canvas.scale = 1.5
  this.canvas.onResize()
  return this
}

Editor.prototype.onResize = function() {
  this.canvas.onResize()
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

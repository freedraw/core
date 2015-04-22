var DisplayNode = require('./display-node')
var inherits = require('inherits')

function ShapeNode(props, children) {
  this.fills = []
  this.strokes = []

  DisplayNode.call(this, props, children)
}
inherits(ShapeNode, DisplayNode)

ShapeNode.prototype.drawOn = function(cx) {
  var p = new Path2D
  this.pathOn(p)
  this.fills.forEach(function(fill) {
    cx.fillStyle = fill.style
    cx.fill(p)
  })
  this.strokes.forEach(function(stroke) {
    cx.strokeStyle = stroke.style
    cx.lineWidth = stroke.width
    cx.stroke(p)
  })
}

exports = ShapeNode

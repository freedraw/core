var ShapeNode = require('./shape-node')
var Vec2 = require('vec2')
var Rect = require('rect')
var inherits = require('inherits')

function Rectangle(props, children) {
  this.bounds = new Rect(0, 0, 100, 100)

  ShapeNode.call(this, props, children)
}
inherits(Rectangle, ShapeNode)

Rectangle.prototype.boundingBox = function() {
  return this.bounds
}
Rectangle.prototype.setBoundingBox = function(bb) {
  this.bounds = bb
}

Rectangle.prototype.isSolidAt = function(p) {
  return this.bounds.includes(p)
}

Rectangle.prototype.pathOn = function(cx) {
  cx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
}

exports = Rectangle

var ShapeNode = require('./shape-node')
var Vec2 = require('fd/vec2')
var Rect = require('fd/rect')
var inherits = require('fd/inherits')

function Rectangle(props, children) {
  this.bounds = new Rect(0, 0, 100, 100)

  ShapeNode.call(this, props, children)
}
inherits(Rectangle, ShapeNode)

Rectangle.prototype.ownBoundingBox = function() {
  return this.bounds
}
Rectangle.prototype.updateBoundingBoxFrom = function(bb) {
  this.bounds = bb
}

Rectangle.prototype.isSolidAt = function(p) {
  return this.bounds.includes(p)
}

Rectangle.prototype.pathOn = function(cx) {
  cx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
}

module.exports = Rectangle

var ShapeNode = require('./shape-node')
var Vec2 = require('fd/vec2')
var Rect = require('fd/rect')
var inherits = require('fd/inherits')

function Ellipse(props, children) {
  this.radii = new Vec2(100, 100)
  this.center = new Vec2(0, 0)

  ShapeNode.call(this, props, children)
}
inherits(Ellipse, ShapeNode)

Ellipse.prototype.ownBoundingBox = function() {
  return Rect.centerHalf(this.center, this.radii)
}
Ellipse.prototype.updateBoundingBoxFrom = function(bb) {
  this.radii = bb.halfExtent()
  this.center = bb.center()
}

Ellipse.prototype.isSolidAt = function(p) {
  var delta = p.sub(this.center)
  return (delta.x * delta.x) / (this.radii.x * this.radii.x) + (delta.y * delta.y) / (this.radii.y * this.radii.y) < 1
}

Ellipse.prototype.pathOn = function(cx) {
  cx.ellipse(this.center.x, this.center.y, this.radii.x, this.radii.y, 0, Math.PI * 2, false)
}

module.exports = Ellipse

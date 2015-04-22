var DisplayNode = require('./display-node')
var Vec2 = require('fd/vec2')
var Rect = require('fd/rect')
var inherits = require('fd/inherits')

function Group(props, children) {
  DisplayNode.call(this, props, children)
}
inherits(Group, DisplayNode)

Group.prototype.ownBoundingBox = function() {
  return this.bounds
}
Group.prototype.updateBoundingBoxFrom = function(bb) {
  this.bounds = bb
}

Group.prototype.isSolidAt = function(p) {
  return this.bounds.includes(p)
}

module.exports = Group

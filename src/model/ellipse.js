var DisplayNode = require('./display-node')
var inherits = require('inherits')

function Ellipse(props, children) {
  DisplayNode.call(this, props, children)
}
inherits(Ellipse, DisplayNode)

Ellipse.prototype.center = null
Ellipse.prototype.radius = null

exports = Ellipse

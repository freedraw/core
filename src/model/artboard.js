var DisplayNode = require('./display-node')
var Vec2 = require('vec2')
var Rect = require('rect')
var inherits = require('inherits')

function Artboard(props, children) {
  DisplayNode.call(this, props, children)
}
inherits(Artboard, DisplayNode)

Artboard.prototype.extent = new Vec2(256, 256)

Artboard.prototype.boundingBox = function() {
  return new Rect(0, 0, this.extent.x, this.extent.y)
}

Artboard.prototype.drawOn = function(cx) {
  cx.save()
  cx.fillStyle = 'rgb(255,255,255)'
  cx.shadowColor = 'rgba(0,0,0,.2)'
  cx.shadowOffsetX = 3
  cx.shadowOffsetY = 3
  cx.shadowBlur = 8
  cx.fillRect(0, 0, this.extent.x, this.extent.y)
  cx.restore()
}

exports = Artboard

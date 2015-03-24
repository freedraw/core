var extend = require('extend')
var Vec2 = require('vec2')
var Rect = require('rect')
var Matrix = require('matrix')

extend(SVGPoint.prototype, Vec2.prototype)
extend(SVGRect.prototype, Rect.prototype)
extend(SVGMatrix.prototype, Matrix.prototype)

SVGGraphicsElement.prototype.replaceTransform = function(m) {
  if (!(m instanceof SVGMatrix)) m = m.toSVG(this.ownerSVGElement)
  var tr = this.transform.baseVal
  tr.clear()
  tr.appendItem(tr.createSVGTransformFromMatrix(m))
}

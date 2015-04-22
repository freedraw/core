var extend = require('fd/extend')
var Vec2 = require('fd/vec2')
var Rect = require('fd/rect')
var Matrix = require('fd/matrix')

extend(SVGPoint.prototype, Vec2.prototype)
extend(SVGRect.prototype, Rect.prototype)
extend(SVGMatrix.prototype, Matrix.prototype)

SVGGraphicsElement.prototype.replaceTransform = function(m) {
  if (!(m instanceof SVGMatrix)) m = m.toSVG(this.ownerSVGElement)
  var tr = this.transform.baseVal
  tr.clear()
  tr.appendItem(tr.createSVGTransformFromMatrix(m))
}

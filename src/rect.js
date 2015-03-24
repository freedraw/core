var Vec2 = require('vec2')

function Rect(x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
}

Rect.zero = new Rect(0, 0, 0, 0)
Rect.bb = function(bb) {
  return new Rect(bb.left, bb.top, bb.width, bb.height)
}

Rect.prototype.union = function(r) {
  if (this.width === 0 || this.height === 0) return r
  if (r.width === 0 || r.height === 0) return this
  var left = Math.min(this.x, r.x)
  var right = Math.max(this.x + this.width, r.x + r.width)
  var top = Math.min(this.y, r.y)
  var bottom = Math.max(this.y + this.height, r.y + r.height)
  return new Rect(left, top, right - left, bottom - top)
}
Rect.prototype.intersect = function(r) {
  if (this.width === 0 || this.height === 0) return Rect.zero
  if (r.width === 0 || r.height === 0) return Rect.zero
  var left = Math.max(this.x, r.x)
  var right = Math.min(this.x + this.width, r.x + r.width)
  var top = Math.max(this.y, r.y)
  var bottom = Math.min(this.y + this.height, r.y + r.height)
  return right <= left || bottom <= top ? Rect.zero : new Rect(left, top, right - left, bottom - top)
}
Rect.prototype.include = function(p) {
  if (this.width === 0 || this.height === 0) {
    return new Rect(p.x, p.y, 1e-323, 1e-323)
  }
  var left = Math.max(this.x, p.x)
  var right = Math.min(this.x + this.width, p.x)
  var top = Math.max(this.y, p.y)
  var bottom = Math.min(this.y + this.height, p.y)
  return new Rect(left, top, right - left, bottom - top)
}

Rect.prototype.topLeft = function() {
  return new Vec2(this.x, this.y)
}
Rect.prototype.topRight = function() {
  return new Vec2(this.x + this.width, this.y)
}
Rect.prototype.bottomLeft = function() {
  return new Vec2(this.x, this.y + this.height)
}
Rect.prototype.bottomRight = function() {
  return new Vec2(this.x + this.width, this.y + this.height)
}

Rect.prototype.topCenter = function() {
  return new Vec2(this.x + this.width / 2, this.y)
}
Rect.prototype.bottomCenter = function() {
  return new Vec2(this.x + this.width / 2, this.y + this.height)
}
Rect.prototype.leftCenter = function() {
  return new Vec2(this.x, this.y + this.height / 2)
}
Rect.prototype.rightCenter = function() {
  return new Vec2(this.x + this.width, this.y + this.height / 2)
}

Rect.prototype.center = function() {
  return new Vec2(this.x + this.width / 2, this.y + this.height / 2)
}

Rect.prototype.lerp = function(f, r) {
  var g = 1 - f
  return new Rect(this.x * g + r.x * f, this.y * g + r.y * f, this.width * g + r.width * f, this.height * g + r.height * f)
}

Rect.prototype.toSVG = function(svg) {
  var r = svg.createSVGRect()
  r.x = this.x
  r.y = this.y
  r.width = this.width
  r.height = this.height
  return r
}


exports = Rect

function Vec2(x, y) {
  this.x = x
  this.y = y
}

Vec2.prototype.add = function(p) {
  return new Vec2(this.x + p.x, this.y + p.y)
}
Vec2.prototype.sub = function(p) {
  return new Vec2(this.x - p.x, this.y - p.y)
}
Vec2.prototype.mul = function(p) {
  return new Vec2(this.x * p.x, this.y * p.y)
}
Vec2.prototype.min = function(p) {
  return new Vec2(Math.min(this.x, p.x), Math.min(this.y, p.y))
}
Vec2.prototype.max = function(p) {
  return new Vec2(Math.max(this.x, p.x), Math.max(this.y, p.y))
}
Vec2.prototype.scale = function(f) {
  return new Vec2(this.x * f, this.y * f)
}

Vec2.prototype.transform = function(m) {
  return new Vec2(m.a * this.x + m.c * this.y + m.e, m.b * this.x + m.d * this.y + m.f)
}

Vec2.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y)
}
Vec2.prototype.lengthSquared = function() {
  return this.x * this.x + this.y * this.y
}
Vec2.prototype.unit = function() {
  var length = this.length()
  if (length === 0) return Vec2.x
  return new Vec2(this.x / length, this.y / length)
}
Vec2.prototype.angle = function() {
  return Math.atan2(this.y, this.x)
}

Vec2.prototype.toSVG = function(svg) {
  var p = svg.createSVGPoint()
  p.x = this.x
  p.y = this.y
  return p
}

Vec2.x = new Vec2(1, 0)
Vec2.y = new Vec2(0, 1)
Vec2.one = new Vec2(1, 1)


exports = Vec2

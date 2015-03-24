
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


SVGRect.prototype.topLeft = function() {
  return new Vec2(this.x, this.y)
}
SVGRect.prototype.topRight = function() {
  return new Vec2(this.x + this.width, this.y)
}
SVGRect.prototype.bottomLeft = function() {
  return new Vec2(this.x, this.y + this.height)
}
SVGRect.prototype.bottomRight = function() {
  return new Vec2(this.x + this.width, this.y + this.height)
}

Vec2.x = new Vec2(1, 0)
Vec2.y = new Vec2(0, 1)
Vec2.one = new Vec2(1, 1)


exports = Vec2

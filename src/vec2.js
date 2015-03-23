
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

exports = Vec2

function Matrix(a, b, c, d, e, f) {
  // [ a c e ]
  // [ b d f ]

  this.a = a
  this.b = b
  this.c = c
  this.d = d
  this.e = e
  this.f = f
}

Matrix.identity = new Matrix(1, 0, 0, 1, 0, 0)

Matrix.translate = function(x, y) {
  return new Matrix(1, 0, 0, 1, x, y)
}
Matrix.translateBy = function(v) {
  return new Matrix(1, 0, 0, 1, v.x, v.y)
}
Matrix.scale = function(h, k) {
  return new Matrix(h, 0, 0, k == null ? h : k, 0, 0)
}
Matrix.scaleBy = function(v) {
  return new Matrix(v.x, 0, 0, v.y, 0, 0)
}
Matrix.rotate = function(t) {
  var cos = Math.cos(t)
  var sin = Math.sin(t)
  return new Matrix(cos, sin, -sin, cos, 0, 0)
}
Matrix.rotateTo = function(v) {
  var u = v.unit()
  return new Matrix(u.x, u.y, -u.y, u.x, 0, 0)
}
Matrix.flipX = new Matrix(-1, 0, 0, 1, 0, 0)
Matrix.flipY = new Matrix(1, 0, 0, -1, 0, 0)
Matrix.skewX = function(t) {
  return new Matrix(1, 0, Math.tan(t), 1, 0, 0)
}
Matrix.skewY = function(t) {
  return new Matrix(1, Math.tan(t), 0, 1, 0, 0)
}

Matrix.prototype.determinant = function() {
  return this.a * this.d - this.b * this.c
}
Matrix.prototype.concat = function(m) {
  return new Matrix(
    this.a * m.a + this.c * m.b,
    this.b * m.a + this.d * m.b,
    this.a * m.c + this.c * m.d,
    this.b * m.c + this.d * m.d,
    this.a * m.e + this.c * m.f + this.e,
    this.b * m.e + this.d * m.f + this.f)
}
Matrix.prototype.inverse = function() {
  var det = this.determinant()
  if (det === 0) throw new Error('Singular matrix.')
  return new Matrix(
    this.d / det, -this.b / det,
    -this.c / det, this.a / det,
    (this.c * this.f - this.d * this.e) / det,
    (this.b * this.e - this.a * this.f) / det)
}

Matrix.prototype.translate = function(x, y) {
  return new Matrix(
    this.a, this.b,
    this.c, this.d,
    this.e + this.a * x + this.c * y,
    this.f + this.b * x + this.d * y)
}
Matrix.prototype.translateBy = function(v) {
  return new Matrix(
    this.a, this.b,
    this.c, this.d,
    this.e + this.a * v.x + this.c * v.y,
    this.f + this.b * v.x + this.d * v.y)
}
Matrix.prototype.scale = function(h, k) {
  if (k == null) k = h
  return new Matrix(
    this.a * h, this.b * h,
    this.c * k, this.d * k,
    this.e, this.f)
}
Matrix.prototype.scaleBy = function(v) {
  return new Matrix(
    this.a * v.x, this.b * v.x,
    this.c * v.y, this.d * v.y,
    this.e, this.f)
}
Matrix.prototype.rotate = function(t) {
  var cos = Math.cos(t)
  var sin = Math.sin(t)
  return new Matrix(
    this.a * cos + this.c * sin,
    this.b * cos + this.d * sin,
    this.c * cos - this.a * sin,
    this.d * cos - this.b * sin,
    this.e, this.f)
}
Matrix.prototype.rotateTo = function(v) {
  var u = v.unit()
  return new Matrix(
    this.a * u.x + this.c * u.y,
    this.b * u.x + this.d * u.y,
    this.c * u.x - this.a * u.y,
    this.d * u.x - this.b * u.y,
    this.e, this.f)
}
Matrix.prototype.flipX = function() {
  return new Matrix(-this.a, -this.b, this.c, this.d, this.e, this.f)
}
Matrix.prototype.flipY = function() {
  return new Matrix(this.a, this.b, -this.c, -this.d, this.e, this.f)
}
Matrix.prototype.skewX = function(t) {
  var tan = Math.tan(t)
  return new Matrix(
    this.a, this.b,
    this.c + this.a * tan,
    this.d + this.b * tan,
    this.e, this.f)
}
Matrix.prototype.skewY = function(t) {
  var tan = Math.tan(t)
  return new Matrix(
    this.a + this.c * tan,
    this.b + this.d * tan,
    this.c, this.d,
    this.e, this.f)
}

Matrix.prototype.toSVG = function(svg) {
  var m = svg.createSVGMatrix()
  m.a = this.a
  m.b = this.b
  m.c = this.c
  m.d = this.d
  m.e = this.e
  m.f = this.f
  return m
}

Matrix.prototype.toCSS = function() {
  return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
}

Matrix.prototype.transformContext = function(context) {
  context.transform(this.a, this.b, this.c, this.d, this.e, this.f)
}

exports = Matrix

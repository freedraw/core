module.exports = function extend(o, p) {
  for (var k in p) {
    o[k] = p[k]
  }
  return o
}

exports.quiet = function(o, p) {
  for (var k in p) if (!(k in o)) {
    o[k] = p[k]
  }
}

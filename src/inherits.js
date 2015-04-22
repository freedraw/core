module.exports = function inherits(X, Y) {
  X.prototype = Object.create(Y.prototype)
  X.prototype.constructor = X
}

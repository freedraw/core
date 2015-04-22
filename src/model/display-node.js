var Node = require('./node')
var Matrix = require('matrix')
var Rect = require('rect')
var extend = require('extend')
var inherits = require('inherits')

function DisplayNode(props, children) {
  this.transform = Matrix.identity

  Node.call(this)

  if (Array.isArray(props)) {
    children = props
    props = null
  }
  if (props) extend(this, props)
  if (children) this.appendAll(children)
}
inherits(DisplayNode, Node)

DisplayNode.prototype.localToGlobal = function() {
  var transform = Matrix.identity
  var node = this
  do {
    transform = node.transform.concat(transform)
  } while (node = node.parent)
  return transform
}

DisplayNode.prototype.ownBoundingBox = function() {
  return Rect.zero
}
DisplayNode.prototype.boundingBox = function() {
  var bb = this.ownBoundingBox()
  for (var i = this.children.length; i--;) {
    bb = bb.union(this.children[i].boundingBox())
  }
  return bb
}

DisplayNode.prototype.pathOn = function(cx) {
  this.ownBoundingBox().pathOn(cx)
}
DisplayNode.prototype.isSolidAt = function() {
  return false
}
DisplayNode.prototype.drawOn = function(cx) {}
DisplayNode.prototype.drawTreeOn = function(cx) {
  this.drawOn(cx)
  for (var i = 0, l = this.children.length; i < l; i++) {
    this.children[i].drawTreeOn(cx)
  }
}

DisplayNode.prototype.nodeAt = function(p) {
  if (this.transform.determinant() === 0) return null
  var q = p.transform(this.transform.inverse())

  if (this.isSolidAt(q)) return this

  for (var i = this.children.length; i--;) {
    var n = this.children[i].nodeAt(q)
    if (n) return n
  }
  return null
}

exports = DisplayNode

var Node = require('./node')
var Matrix = require('fd/matrix')
var Rect = require('fd/rect')
var extend = require('fd/extend')
var inherits = require('fd/inherits')

function DisplayNode(props, children) {
  this.transform = Matrix.identity
  this.opacity = 1
  this.blendMode = 'normal'

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
  if (this._cachedBoundingBox) {
    return this._cachedBoundingBox
  }
  var bb = this.ownBoundingBox()
  for (var i = this.children.length; i--;) {
    bb = bb.union(this.children[i].boundingBox())
  }
  return this._cachedBoundingBox = bb
}
DisplayNode.prototype.boundingBoxChanged = function() {
  if (!this._cachedBoundingBox) return
  this._cachedBoundingBox = null
  if (this.parent) this.parent.boundingBoxChanged()
}
DisplayNode.prototype.setBoundingBox = function(bb) {
  this.updateBoundingBoxFrom(bb)
  this.boundingBoxChanged()
}
DisplayNode.prototype.updateBoundingBoxFrom = function(bb) {
  // TODO
}

DisplayNode.prototype.pathOn = function(cx) {
  this.ownBoundingBox().pathOn(cx)
}
DisplayNode.prototype.isSolidAt = function() {
  return false
}
DisplayNode.prototype.drawOn = function(cx) {}
DisplayNode.prototype.drawTreeOn = function(cx) {
  cx.save()
  this.transform.transformContext(cx)
  this.drawOn(cx)
  for (var i = 0, l = this.children.length; i < l; i++) {
    this.children[i].drawTreeOn(cx)
  }
  cx.restore()
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

module.exports = DisplayNode

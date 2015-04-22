function Node() {
  this.parent = null
  this.children = []
}

Node.prototype.append = function(child) {
  this.children.push(child.detach())
  child.parent = this
  return this
}
Node.prototype.appendAll = function(children) {
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    this.children.push(child.detach())
    child.parent = this
  }
  return this
}
Node.prototype.appendTo = function(parent) {
  parent.children.push(this.detach())
  this.parent = parent
  return this
}
Node.prototype.prepend = function(child) {
  this.children.unshift(child.detach())
  child.parent = this
  return this
}
Node.prototype.prependTo = function(parent) {
  parent.children.unshift(this.detach())
  this.parent = parent
  return this
}
Node.prototype.addBefore = function(child, reference) {
  if (!reference) return this.append(child)
  if (reference.parent !== this) {
    throw new Error('Reference child does not belong to this node.')
  }

  var i = this.children.indexOf(reference)
  this.children.splice(i, 0, child.detach())

  child.parent = this
  return this
}
Node.prototype.addAfter = function(child, reference) {
  if (reference) return this.prepend(child)
}
Node.prototype.replace = function(old, child) {
  if (old.parent !== this) {
    throw new Error('Child to replace does not belong to this node.')
  }

  old.parent = null
  var i = this.children.indexOf(child)
  this.children[i] = child.detach()

  child.parent = this
  return this
}

Node.prototype.detach = function() {
  if (!this.parent) return this
  var children = this.parent.children

  var i = children.indexOf(this)
  if (i === children.length - 1) {
    children.pop()
  } else {
    children.splice(i, 1)
  }

  this.parent = null
  return this
}

Object.defineProperties(Node.prototype, {
  first: {get: function() {
    return this.children[0]
  }},
  last: {get: function() {
    return this.children[this.children.length - 1]
  }},
  previous: {get: function() {
    var children = this.parent.children
    var i = children.indexOf(this)
    return children[i - 1]
  }},
  next: {get: function() {
    var children = this.parent.children
    var i = children.indexOf(this)
    return children[i + 1]
  }},
  index: {get: function() {
    if (!this.parent) return 0
    return this.parent.children.indexOf(this)
  }}
})

module.exports = Node

exports = function svg(name, attrs, children) {
  if (Array.isArray(attrs)) {
    children = attrs
    attrs = null
  }
  var el = document.createElementNS('http://www.w3.org/2000/svg', name)
  if (attrs) for (var k in attrs) {
    var v = attrs[k]
    if (k === 'style') {
      for (var p in v) {
        el.style[p] = v[p]
      }
    } else {
      el.setAttribute(k, attrs[k])
    }
  }
  if (children) for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    el.appendChild(typeof child === 'object' ? child : document.createTextNode(child))
  }
  return el
}

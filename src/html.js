module.exports = function html(spec, attrs, children) {
  if (Array.isArray(attrs)) {
    children = attrs
    attrs = null
  }
  var i = spec.indexOf('.')
  if (i !== -1) {
    var name = spec.slice(0, i) || 'div'
    var className = spec.slice(i + 1)
  } else {
    name = spec
  }
  var el = document.createElement(name)
  if (className) el.className = className
  if (attrs) for (var k in attrs) {
    var v = attrs[k]
    if (k === 'style' || k === 'dataset') {
      var inner = el[k]
      for (var p in v) {
        inner[p] = v[p]
      }
    } else {
      el[k] = v
    }
  }
  if (children) for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    el.appendChild(typeof child === 'object' ? child : document.createTextNode(child))
  }
  return el
}

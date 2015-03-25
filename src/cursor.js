var h = require('html')

var stack = []
var cursor = null

var el = h('.cursor-overlay')
document.body.appendChild(el)

exports.push = function(name) {
  if (cursor) {
    stack.push(cursor)
  } else {
    el.style.display = 'block'
  }
  el.style.cursor = cursor = name
}

exports.pop = function() {
  cursor = stack.pop()
  if (cursor) {
    el.style.cursor = cursor
  } else {
    el.style.display = 'none'
  }
}

var angleTowards = ['e-resize', 'ne-resize', 'n-resize', 'nw-resize', 'w-resize', 'sw-resize', 's-resize', 'se-resize']
exports.resizeTowards = function(angle) {
  angle = angle / (Math.PI * 2) % 1
  if (angle < 0) angle += 1
  return angleTowards[Math.round(angle * angleTowards.length) % angleTowards.length]
}

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

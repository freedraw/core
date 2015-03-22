var h = require('html')

function Panel(editor, width, el) {
  this.editor = editor
  this.width = width
  this.minWidth = 165

  this.el = el
  this.el.style.width = width + 'px'
  this.el.appendChild(this.resizer = h('.panel-resizer'))

  this.resizer.addEventListener('mousedown', this.onResizeStart.bind(this))
  this.onResizeMove = this.onResizeMove.bind(this)
  this.onResizeEnd = this.onResizeEnd.bind(this)
  this.resizeOffset = 0
}

Panel.prototype.onResizeStart = function(e) {
  this.resizeOffset = this.width - e.clientX
  document.addEventListener('mousemove', this.onResizeMove)
  document.addEventListener('mouseup', this.onResizeEnd)
}
Panel.prototype.onResizeMove = function(e) {
  this.width = Math.max(this.minWidth, this.resizeOffset + e.clientX)
  this.el.style.width = this.width + 'px'
}
Panel.prototype.onResizeEnd = function(e) {
  document.removeEventListener('mousemove', this.onResizeMove)
  document.removeEventListener('mouseup', this.onResizeEnd)
}

exports = Panel

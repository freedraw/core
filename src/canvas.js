var h = require('html')
var svg = require('svg')

function Canvas() {
  this.el = h('.canvas', [
    this.svg = svg('svg', [
      svg('circle', {cx: 50, cy: 50, r: 30, style: {
        fill: 'red',
        stroke: 'black',
        strokeWidth: '2px'
      }})
    ])
  ])

  this.centerX = 0
  this.centerY = 0
  this.scale = 1

  this.el.addEventListener('magnify', this.onMagnify.bind(this))
}

Canvas.prototype.onMagnify = function(e) {
  e.stopPropagation()
  this.zoomBy(e.magnification, e.clientX, e.clientY)
}

Canvas.prototype.zoomBy = function(delta, x, y) {
  var viewport = this.el.getBoundingClientRect()
  this.scale /= 1 + delta
  var dx = this.scale * (viewport.left + viewport.width / 2 - x)
  var dy = this.scale * (viewport.top + viewport.height / 2 - y)
  this.centerX -= delta * dx
  this.centerY -= delta * dy
  this.updateViewBox()
}

Canvas.prototype.updateViewBox = function() {
  var box = this.svg.viewBox.baseVal
  var viewport = this.el.getBoundingClientRect()
  var width = this.scale * viewport.width
  var height = this.scale * viewport.height

  box.x = this.centerX - width / 2
  box.y = this.centerY - height / 2
  box.width = width
  box.height = height
}

exports = Canvas

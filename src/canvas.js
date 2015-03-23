var h = require('html')
var svg = require('svg')
var convertWheelUnits = require('convert-wheel-units')

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
  this.el.addEventListener('wheel', this.onWheel.bind(this))
}

Canvas.prototype.onWheel = function(e) {
  var viewport = this.el.getBoundingClientRect()
  var delta = convertWheelUnits(e, viewport.width, viewport.height, 0)
  if (e.metaKey || e.ctrlKey) {
    this.zoomBy(delta.y / 120, e.clientX, e.clientY)
  } else {
    this.scrollBy(delta.x, delta.y)
  }
}

Canvas.prototype.onMagnify = function(e) {
  e.stopPropagation()
  this.zoomBy(e.magnification, e.clientX, e.clientY)
}

Canvas.prototype.scrollBy = function(deltaX, deltaY) {
  this.centerX += deltaX / this.scale
  this.centerY += deltaY / this.scale
  this.updateViewBox()
}

Canvas.prototype.zoomBy = function(delta, x, y) {
  var viewport = this.el.getBoundingClientRect()
  this.scale *= 1 + delta
  var dx = (viewport.left + viewport.width / 2 - x) / this.scale
  var dy = (viewport.top + viewport.height / 2 - y) / this.scale
  this.centerX -= delta * dx
  this.centerY -= delta * dy
  this.updateViewBox()
}

Canvas.prototype.updateViewBox = function() {
  var box = this.svg.viewBox.baseVal
  var viewport = this.el.getBoundingClientRect()
  var width = viewport.width / this.scale
  var height = viewport.height / this.scale

  box.x = this.centerX - width / 2
  box.y = this.centerY - height / 2
  box.width = width
  box.height = height
}

exports = Canvas

var h = require('html')
var svg = require('svg')
var commands = require('commands')
var convertWheelUnits = require('convert-wheel-units')

var ZOOM_MAX = 64
var ZOOM_MIN = .01
var ZOOM_FACTOR = 1.5
var ZOOM_CENTER_SPACE = .7

function Canvas() {
  this.el = h('.canvas', [
    this.svg = svg('svg', [
      svg('circle', {cx: 0, cy: 0, r: 30, style: {
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
  this.el.addEventListener('gestureend', this.constrainZoom.bind(this))
  this.el.addEventListener('wheel', this.onWheel.bind(this))

  commands.on('zoom0', this.zoomTo.bind(this, 1))
  commands.on('zoomCenter', this.zoomCenter, this)
  commands.on('zoomIn', this.zoomBy.bind(this, ZOOM_FACTOR - 1))
  commands.on('zoomOut', this.zoomBy.bind(this, 1 / ZOOM_FACTOR - 1))
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
  if (x != null) {
    var dx = (viewport.left + viewport.width / 2 - x) / this.scale
    var dy = (viewport.top + viewport.height / 2 - y) / this.scale
    this.centerX -= delta * dx
    this.centerY -= delta * dy
  }
  this.updateViewBox()
}

Canvas.prototype.zoomTo = function(scale, x, y) {
  this.zoomBy(scale / this.scale - 1)
}

Canvas.prototype.zoomCenter = function() {
  var viewport = this.el.getBoundingClientRect()
  var bb = this.svg.getBBox()
  this.centerX = bb.x + bb.width / 2
  this.centerY = bb.y + bb.height / 2
  this.scale = Math.min(viewport.width * ZOOM_CENTER_SPACE / bb.width, viewport.height * ZOOM_CENTER_SPACE / bb.height)
  this.updateViewBox()
}

Canvas.prototype.constrainZoom = function() {
  if (this.scale < ZOOM_MIN) this.scale = ZOOM_MIN
  else if (this.scale > ZOOM_MAX) this.scale = ZOOM_MAX
  else return

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

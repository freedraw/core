var h = require('html')
var M = require('model')
var Vec2 = require('vec2')
var Rect = require('rect')
var Matrix = require('matrix')
var commands = require('commands')
var cursor = require('cursor')
var convertWheelUnits = require('convert-wheel-units')
var replaceBBox = require('replace-bbox')

var ZOOM_MAX = 64
var ZOOM_MIN = .01
var ZOOM_FACTOR = 1.5
var ZOOM_CENTER_SPACE = .7
var MIN_HANDLE = 10 * 10
var MIN_MID_HANDLE = 20 * 20

function Canvas(editor) {
  this.editor = editor

  this.selectionHandles = []
  for (var i = 0; i < 8; i++) {
    var handle = h('.selection-handle', {dataset: {index: i}})
    this.selectionHandles.push(handle)
  }

  this.model = new M.Document([
    new M.Ellipse({
      fills: [{style: '#eb7'}],
      strokes: [{style: '#000', width: 3}],
      radii: new Vec2(120, 90),
      transform: Matrix.skewX(Math.PI / 12)
    })
  ])

  this.el = h('.canvas', [
    this.modelCanvas = h('canvas'),
    h('.container', [
      this.selectionContainer = h('.selection-container', [
        this.selectionCanvas = h('canvas')
      ].concat(this.selectionHandles)),
      this.highlightCanvas = h('canvas.highlight-canvas')
    ])
  ])

  this.modelContext = this.modelCanvas.getContext('2d')
  this.highlightContext = this.highlightCanvas.getContext('2d')
  this.selectionContext = this.selectionCanvas.getContext('2d')

  this.viewport = Rect.zero
  this.screenToModel = Matrix.identity
  this.modelToScreen = Matrix.identity
  this.modelToCanvas = Matrix.identity

  this.center = Vec2.zero
  this.scale = 1

  this.mouse = Vec2.zero
  this.highlightedObject = null

  this.drag = null

  this.el.addEventListener('mousedown', this.onMouseDown.bind(this))
  document.addEventListener('mousemove', this.onMouseMove.bind(this))
  document.addEventListener('mouseup', this.onMouseUp.bind(this))
  this.el.addEventListener('magnify', this.onMagnify.bind(this))
  this.el.addEventListener('gestureend', this.constrainZoom.bind(this))
  this.el.addEventListener('wheel', this.onWheel.bind(this))

  commands.on('zoom0', this.zoomTo.bind(this, 1, null))
  commands.on('zoomCenter', this.zoomCenter, this)
  commands.on('zoomIn', this.zoomBy.bind(this, ZOOM_FACTOR - 1, null))
  commands.on('zoomOut', this.zoomBy.bind(this, 1 / ZOOM_FACTOR - 1, null))

  editor.on('selectionChange', this.updateSelectionBox, this)
  editor.on('selectionBoundsChange', this.updateSelectionBox, this)
}

Canvas.prototype.onMouseMove = function(e) {
  this.mouse = new Vec2(e.clientX, e.clientY)
  var object = this.editor.selection
  var drag = this.drag
  if (drag) {
    var mat = object.localToGlobal().inverse().concat(this.screenToModel)
    switch (drag.kind) {
      case 'translate':
        var u = drag.origin.transform(mat)
        var v = this.mouse.transform(mat)
        object.setBoundingBox(drag.rect.translate(v.sub(u)))
        this.redraw()
        this.editor.emit('selectionBoundsChange')
        return
      case 'resize':
        var preserve = e.shiftKey
        var center = e.altKey

        var v = this.mouse.transform(mat)
        var rect = drag.rect.expandHandle(drag.handle, v, preserve, center)
        object.setBoundingBox(rect)
        this.redraw()
        this.editor.emit('selectionBoundsChange')
        return
    }
    console.warn('Unimplemented drag:', drag.kind)
    return
  }
  this.hoverObject(this.model.nodeAt(this.mouse.transform(this.screenToModel)))
}

Canvas.prototype.onMouseDown = function(e) {
  this.highlightObject(null)
  this.mouse = new Vec2(e.clientX, e.clientY)

  var t = e.target
  if (t.matches('.selection-handle')) {
    cursor.push(t.style.cursor)
    this.drag = {
      kind: 'resize',
      rect: this.editor.selection.boundingBox(),
      handle: +t.dataset.index
    }
    return
  }
  var object = this.model.nodeAt(this.mouse.transform(this.screenToModel))
  if (this.editor.selection = object) {
    cursor.push('-webkit-grabbing')
    this.drag = {
      kind: 'translate',
      rect: this.editor.selection.boundingBox(),
      origin: this.mouse
    }
  }
}

Canvas.prototype.onMouseUp = function() {
  cursor.pop()
  this.drag = null
}

Canvas.prototype.onWheel = function(e) {
  e.preventDefault()
  var delta = convertWheelUnits(e, this.viewport.width, this.viewport.height, 0)
  if (e.metaKey || e.ctrlKey) {
    this.zoomBy(-delta.y / 120, new Vec2(e.clientX, e.clientY))
  } else {
    this.scrollBy(new Vec2(delta.x, delta.y))
  }
}

Canvas.prototype.onMagnify = function(e) {
  e.stopPropagation()
  this.zoomBy(e.magnification, new Vec2(e.clientX, e.clientY))
}

Canvas.prototype.setDocument = function(doc) {
  return // TODO implement model.load
  this.model = model.load(doc, true)
  this.model = root
  this.center = this.model.boundingBox().center()
}

Canvas.prototype.scrollBy = function(delta) {
  this.center = this.center.add(delta.scaleInv(this.scale))
  this.updateViewBox() // TODO be efficient about this
}

Canvas.prototype.zoomBy = function(delta, center) {
  this.scale *= 1 + delta
  if (center != null) {
    this.center = this.center.sub(this.viewport.center().sub(center).scale(delta / this.scale))
  }
  this.updateViewBox() // TODO use cached canvas to speed up zooming
}

Canvas.prototype.zoomTo = function(scale, center) {
  this.zoomBy(scale / this.scale - 1, center)
}

Canvas.prototype.zoomCenter = function() {
  var bb = this.model.boundingBox()
  this.center = bb.center()
  this.scale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, this.viewport.width * ZOOM_CENTER_SPACE / bb.width, this.viewport.height * ZOOM_CENTER_SPACE / bb.height))
  this.updateViewBox() // TODO animate, using cached canvas
}

Canvas.prototype.constrainZoom = function() {
  if (this.scale < ZOOM_MIN) this.zoomTo(ZOOM_MIN, this.mouse)
  else if (this.scale > ZOOM_MAX) this.zoomTo(ZOOM_MAX, this.mouse)
}

Canvas.prototype.updateViewBox = function() {
  this.updateScreenMatrix()
  this.redraw()

  var t = this.model.nodeAt(this.mouse.transform(this.screenToModel))
  this.hoverObject(t)

  if (this.editor.selection) {
    this.updateSelectionBox()
  }
}

Canvas.prototype.onResize = function() {
  this.viewport = Rect.bb(this.el.getBoundingClientRect())

  var pr = window.devicePixelRatio || 1

  ;[this.modelCanvas, this.highlightCanvas, this.selectionCanvas].forEach(function(cv) {
    cv.width = this.viewport.width * pr
    cv.height = this.viewport.height * pr
    cv.style.width = this.viewport.width + 'px'
    cv.style.height = this.viewport.height + 'px'
    cv.getContext('2d').scale(pr, pr)
  }, this)

  this.selectionContext.translate(0.25, 0.25)

  this.updateViewBox()
}

Canvas.prototype.updateScreenMatrix = function() {
  this.screenToModel = Matrix
    .translateBy(this.center)
    .scale(1 / this.scale)
    .translateBy(this.viewport.center().neg())
  this.modelToCanvas = Matrix
    .translateBy(this.viewport.halfExtent())
    .scale(this.scale)
    .translateBy(this.center.neg())
  this.modelToScreen = Matrix.translateBy(this.viewport.topLeft()).concat(this.modelToCanvas)
}

Canvas.prototype.redraw = function() {
  var pr = window.devicePixelRatio || 1

  this.modelContext.clearRect(0, 0, this.viewport.width, this.viewport.height)
  this.modelContext.save()

  this.modelContext.translate(this.viewport.width / 2, this.viewport.height / 2)
  this.modelContext.scale(this.scale, this.scale)
  this.modelContext.translate(-this.center.x, -this.center.y)

  this.model.drawTreeOn(this.modelContext)
  this.modelContext.restore()
}

Canvas.prototype.hoverObject = function(object) {
  this.highlightObject(object === this.editor.selection ? null : object)
}

Canvas.prototype.updateSelectionBox = function() {
  var object = this.editor.selection
  this.selectionContainer.style.display = 'none'
  if (!object) return

  var mat = this.modelToCanvas.concat(object.localToGlobal())

  var points = object.boundingBox().controlPoints().map(function(p) {
    return p.transform(mat)
  })

  var width = points[0].distanceSquared(points[2])
  var height = points[0].distanceSquared(points[6])
  if (width < MIN_HANDLE && height < MIN_HANDLE) return

  this.selectionContainer.style.display = 'block'

  var angle = points[2].sub(points[0]).angle()
  points.forEach(function(v, i) {
    var handle = this.selectionHandles[i]
    var hide = i % 2 && (i % 4 === 1 ? width : height) < MIN_MID_HANDLE
    handle.style.display = hide ? 'none' : 'block'
    if (!hide) {
      handle.style.transform = Matrix.translateBy(v).rotate(angle).toCSS()
      handle.style.cursor = cursor.resizeAlong(Math.PI * (3 - i) / 4 - angle)
    }
  }, this)

  var cx = this.selectionContext
  cx.clearRect(0, 0, this.viewport.width, this.viewport.height)
  cx.beginPath()
  cx.moveTo(points[0].x | 0, points[0].y | 0)
  ;[2, 4, 6].forEach(function(i) {
    cx.lineTo(points[i].x | 0, points[i].y | 0)
  })
  cx.closePath()
  cx.strokeStyle = 'rgb(185, 185, 185)'
  cx.lineWidth = 0.5
  cx.stroke()
}

Canvas.prototype.highlightObject = function(object) {
  this.highlightedObject = object

  var cx = this.highlightContext
  cx.clearRect(0, 0, this.viewport.width, this.viewport.height)

  if (!object) return

  cx.save()
  cx.beginPath()
  this.modelToCanvas.concat(object.localToGlobal()).transformContext(cx)
  object.pathOn(cx)
  cx.restore()

  cx.lineWidth = 2
  cx.strokeStyle = 'rgb(68, 192, 255)'
  cx.stroke()
}

exports = Canvas

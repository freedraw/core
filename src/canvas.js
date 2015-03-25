var h = require('html')
var svg = require('svg-util')
var Vec2 = require('vec2')
var Rect = require('rect')
var Matrix = require('matrix')
var commands = require('commands')
var cursor = require('cursor')
var convertWheelUnits = require('convert-wheel-units')

var ZOOM_MAX = 64
var ZOOM_MIN = .01
var ZOOM_FACTOR = 1.5
var ZOOM_CENTER_SPACE = .7
var MIN_HANDLE = 10 * 10
var MIN_MID_HANDLE = 20 * 20

function Canvas() {
  this.selectionHandles = []
  for (var i = 0; i < 8; i++) {
    var handle = svg('rect', {class: 'selection-handle', 'data-index': i, width: 6, height: 6})
    this.selectionHandles.push(handle)
  }

  this.el = h('.canvas', [
    this.svg = svg('svg', [
      svg('circle', {cx: 0, cy: 0, r: 30, style: {
        fill: 'red',
        stroke: 'black',
        strokeWidth: '2px'
      }}),
      svg('g', {transform: 'rotate(30) translate(30,-100) scale(.5,2)'}, [
        svg('ellipse', {cx: 50, cy: 40, rx: 60, ry: 80, style: {
          fill: 'yellow',
          stroke: 'black',
          strokeWidth: '1px'
        }}),
        svg('rect', {x: -230, y: 90, width: 160, height: 40, style: {
          fill: 'hotpink',
          stroke: 'black',
          strokeWidth: '2px'
        }})
      ])
    ]),
    this.ui = svg('svg', {style: {pointerEvents: 'none'}}, [
      this.selectionBox = svg('path', {style: {
        fill: 'none',
        stroke: 'rgb(185, 185, 185)',
        strokeWidth: '0.5px'
      }})
    ].concat(
      this.selectionHandleGroup = svg('g', {style: {display: 'none'}}, this.selectionHandles),
      this.highlightPath = svg('path', {style: {
        fill: 'none',
        stroke: 'rgb(68, 192, 255)',
        strokeWidth: '2px'
      }})
    ))
  ])

  this.centerX = 0
  this.centerY = 0
  this.scale = 1

  this.mouseX = NaN
  this.mouseY = NaN
  this.selectedObject = null
  this.highlightedObject = null

  this.dragRect = null
  this.dragOrigin = null
  this.dragIndex = null

  this.el.addEventListener('mousedown', this.onMouseDown.bind(this))
  document.addEventListener('mousemove', this.onMouseMove.bind(this))
  document.addEventListener('mouseup', this.onMouseUp.bind(this))
  this.el.addEventListener('magnify', this.onMagnify.bind(this))
  this.el.addEventListener('gestureend', this.constrainZoom.bind(this))
  this.el.addEventListener('wheel', this.onWheel.bind(this))

  commands.on('zoom0', this.zoomTo.bind(this, 1))
  commands.on('zoomCenter', this.zoomCenter, this)
  commands.on('zoomIn', this.zoomBy.bind(this, ZOOM_FACTOR - 1))
  commands.on('zoomOut', this.zoomBy.bind(this, 1 / ZOOM_FACTOR - 1))
}

Canvas.prototype.onMouseMove = function(e) {
  this.mouseX = e.clientX
  this.mouseY = e.clientY
  var object = this.selectedObject
  if (this.dragOrigin) {
    var ctm = object.getScreenCTM().inverse()
    var u = this.dragOrigin.transform(ctm)
    var v = new Vec2(this.mouseX, this.mouseY).transform(ctm)
    this.replaceBBox(object, this.dragRect.translate(v.sub(u)))
    this.updateSelectionBox()
    return
  }
  if (this.dragRect) {
    var preserve = object.localName === 'circle' || e.shiftKey
    var center = e.altKey

    var ctm = object.getScreenCTM().inverse()
    var v = new Vec2(this.mouseX, this.mouseY).transform(ctm)
    var rect = this.dragRect.expandHandle(this.dragHandle, v, preserve, center)
    this.replaceBBox(object, rect)
    this.updateSelectionBox()
    return
  }
  this.hoverObject(e.target)
}

Canvas.prototype.onMouseDown = function(e) {
  this.highlightObject(null)
  this.mouseX = e.clientX
  this.mouseY = e.clientY

  var t = e.target
  if (t.matches('.selection-handle')) {
    cursor.push(t.style.cursor)
    this.dragRect = this.selectedObject.getBBox()
    this.dragHandle = +t.dataset.index
    return
  }
  this.selectObject(t === this.svg ? null : t)
  if (this.selectedObject) {
    cursor.push('-webkit-grabbing')
    this.dragRect = this.selectedObject.getBBox()
    this.dragOrigin = new Vec2(this.mouseX, this.mouseY)
  }
}

Canvas.prototype.onMouseUp = function() {
  cursor.pop()
  this.dragRect = this.dragHandle = this.dragOrigin = null
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
  if (x != null && x === x) {
    var dx = (viewport.left + viewport.width / 2 - x) / this.scale
    var dy = (viewport.top + viewport.height / 2 - y) / this.scale
    this.centerX -= delta * dx
    this.centerY -= delta * dy
  }
  this.updateViewBox()
}

Canvas.prototype.zoomTo = function(scale, x, y) {
  this.zoomBy(scale / this.scale - 1, x, y)
}

Canvas.prototype.zoomCenter = function() {
  var viewport = this.el.getBoundingClientRect()
  var bb = this.svg.getBBox()
  this.centerX = bb.x + bb.width / 2
  this.centerY = bb.y + bb.height / 2
  this.scale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, viewport.width * ZOOM_CENTER_SPACE / bb.width, viewport.height * ZOOM_CENTER_SPACE / bb.height))
  this.updateViewBox()
}

Canvas.prototype.constrainZoom = function() {
  if (this.scale < ZOOM_MIN) this.zoomTo(ZOOM_MIN, this.mouseX, this.mouseY)
  else if (this.scale > ZOOM_MAX) this.zoomTo(ZOOM_MAX, this.mouseX, this.mouseY)
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

  if (this.mouseX === this.mouseX) {
    var t = document.elementFromPoint(this.mouseX, this.mouseY)
    this.hoverObject(t)
  }
  if (this.selectedObject) {
    this.updateSelectionBox()
  }
}

Canvas.prototype.hoverObject = function(object) {
  this.highlightObject(object === this.svg || object === this.selectedObject || object.ownerSVGElement !== this.svg ? null : object)
}

Canvas.prototype.selectObject = function(object) {
  this.selectedObject = object
  this.updateSelectionBox()
}

Canvas.prototype.updateSelectionBox = function() {
  var object = this.selectedObject
  var box = this.selectionBox
  var list = box.pathSegList
  list.clear()
  if (!object) {
    this.selectionHandleGroup.style.display = 'none'
    return
  }

  var ctm = object.getCTM()
  var bb = object.getBBox()

  var tl = bb.topLeft().transform(ctm)
  var tc = bb.topCenter().transform(ctm)
  var tr = bb.topRight().transform(ctm)
  var rc = bb.rightCenter().transform(ctm)
  var br = bb.bottomRight().transform(ctm)
  var bc = bb.bottomCenter().transform(ctm)
  var bl = bb.bottomLeft().transform(ctm)
  var lc = bb.leftCenter().transform(ctm)

  list.appendItem(box.createSVGPathSegMovetoAbs(tl.x, tl.y))
  list.appendItem(box.createSVGPathSegLinetoAbs(tr.x, tr.y))
  list.appendItem(box.createSVGPathSegLinetoAbs(br.x, br.y))
  list.appendItem(box.createSVGPathSegLinetoAbs(bl.x, bl.y))
  list.appendItem(box.createSVGPathSegClosePath())

  var width = tl.distanceSquared(tr)
  var height = tl.distanceSquared(bl)
  if (width < MIN_HANDLE && height < MIN_HANDLE) {
    this.selectionHandleGroup.style.display = 'none'
    return
  }
  this.selectionHandleGroup.style.display = 'inline'

  var angle = tr.sub(tl).angle()
  ;[tl, tc, tr, rc, br, bc, bl, lc].forEach(function(v, i) {
    var handle = this.selectionHandles[i]
    var hide = i % 2 && (i % 4 === 1 ? width : height) < MIN_MID_HANDLE
    handle.style.display = hide ? 'none' : 'inline'
    if (!hide) {
      handle.replaceTransform(Matrix.translateBy(v).rotate(angle).translate(-3, -3))
      handle.style.cursor = cursor.resizeAlong(Math.PI * (3 - i) / 4 - angle)
    }
  }, this)
}

Canvas.prototype.replaceBBox = function(object, rect) {
  switch (object.localName) {
    case 'ellipse':
    case 'circle':
      var c = rect.center()
      object.cx.baseVal.value = c.x
      object.cy.baseVal.value = c.y
      if (object.localName === 'circle') {
        object.r.baseVal.value = rect.width / 2
      } else {
        object.rx.baseVal.value = rect.width / 2
        object.ry.baseVal.value = rect.height / 2
      }
      return
    case 'rect':
      object.x.baseVal.value = rect.x
      object.y.baseVal.value = rect.y
      object.width.baseVal.value = rect.width
      object.height.baseVal.value = rect.height
      return
  }
}

Canvas.prototype.highlightObject = function(object) {
  this.highlightedObject = object

  var path = this.highlightPath
  var list = path.pathSegList
  list.clear()

  if (!object) {
    path.style.display = 'none'
    return
  }
  path.style.display = 'inline'
  var ctm = object.getCTM()

  switch (object.localName) {
    case 'circle':
    case 'ellipse':
      if (object.localName === 'ellipse') {
        var rx = object.rx.baseVal.value
        var ry = object.ry.baseVal.value
      } else {
        rx = ry = object.r.baseVal.value
      }
      var cx = object.cx.baseVal.value
      var cy = object.cy.baseVal.value

      var major = new Vec2(cx + rx, cy).transform(ctm)
      var major2 = new Vec2(cx - rx, cy).transform(ctm)
      var minor = new Vec2(cx, cy + ry).transform(ctm)
      var minor2 = new Vec2(cx, cy - ry).transform(ctm)
      var angle = minor.sub(new Vec2(cx, cy).transform(ctm)).angle() * 180 / Math.PI - 90

      var rx = major.sub(major2).length() / 2
      var ry = minor.sub(minor2).length() / 2

      list.appendItem(path.createSVGPathSegMovetoAbs(major.x, major.y))
      list.appendItem(path.createSVGPathSegArcAbs(major2.x, major2.y, rx, ry, angle, false, true))
      list.appendItem(path.createSVGPathSegArcAbs(major.x, major.y, rx, ry, angle, false, true))
      return
    case 'rect':
      var rect = new Rect(object.x.baseVal.value, object.y.baseVal.value, object.width.baseVal.value, object.height.baseVal.value)
      var tl = rect.topLeft().transform(ctm)
      var tr = rect.topRight().transform(ctm)
      var br = rect.bottomRight().transform(ctm)
      var bl = rect.bottomLeft().transform(ctm)

      list.appendItem(path.createSVGPathSegMovetoAbs(tl.x, tl.y))
      list.appendItem(path.createSVGPathSegLinetoAbs(tr.x, tr.y))
      list.appendItem(path.createSVGPathSegLinetoAbs(br.x, br.y))
      list.appendItem(path.createSVGPathSegLinetoAbs(bl.x, bl.y))
      list.appendItem(path.createSVGPathSegClosePath())
      return
  }
}

exports = Canvas

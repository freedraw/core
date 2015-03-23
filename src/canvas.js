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

var h = require('html')
var svg = require('svg')

function Canvas() {
  this.el = h('.canvas', [
    svg('svg', [
      svg('circle', {cx: 50, cy: 50, r: 30, style: {
        fill: 'red',
        stroke: 'black',
        strokeWidth: '2px'
      }})
    ])
  ])
}

exports = Canvas

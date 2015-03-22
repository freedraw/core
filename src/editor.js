var h = require('html')
var Panel = require('panel')

function Editor() {
  this.layersPanel = new Panel(this, 215, h('.layers panel', [
    h('.panel-header')
  ]))

  this.el = h('.editor', [
    this.layersPanel.el,
    h('.canvas'),
    h('.inspector panel', [
      h('.panel-header'),
      h('.panel-content', [
        h('section.matrix', [
          h('.row', [
            h('label', ['Position']),
            h('.field', [
              h('input', {type: 'number'}),
              h('label', ['X'])
            ]),
            h('.mid'),
            h('.field', [
              h('input', {type: 'number'}),
              h('label', ['Y'])
            ])
          ]),
          h('.row', [
            h('label', ['Size']),
            h('.field', [
              h('input', {type: 'number'}),
              h('label', ['Width'])
            ]),
            h('.mid'),
            h('.field', [
              h('input', {type: 'number'}),
              h('label', ['Height'])
            ])
          ]),
          h('.row', [
            h('label', ['Transform']),
            h('.field', [
              h('input', {type: 'number'}),
              h('label', ['Rotate'])
            ]),
            h('.mid'),
            h('.field', [
              h('.input', [
                h('button'),
                h('button')
              ]),
              h('label', ['Flip'])
            ])
          ])
        ])
      ])
    ])
  ])
}

Editor.prototype.start = function() {
  document.body.appendChild(this.el)
  return this
}

Editor.prototype.getData = function(type) {
  throw new Error("Unimplemented")
}

Editor.prototype.loadData = function(type, data) {
  throw new Error("Unimplemented")
}

exports = Editor

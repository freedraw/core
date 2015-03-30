var h = require('html')
var replaceBBox = require('replace-bbox')
var Rect = require('rect')

function Inspector(editor) {
  this.editor = editor
  this.selectedObject = null

  this.el = h('.inspector panel', [
    h('.panel-header'),
    h('.panel-content', [
      h('section.matrix', [
        h('.row', [
          h('label', ['Position']),
          h('.field', [
            this.inputX = h('input', {type: 'number', disabled: true}),
            h('label', ['X'])
          ]),
          h('.mid'),
          h('.field', [
            this.inputY = h('input', {type: 'number', disabled: true}),
            h('label', ['Y'])
          ])
        ]),
        h('.row', [
          h('label', ['Size']),
          h('.field', [
            this.inputWidth = h('input', {type: 'number', disabled: true}),
            h('label', ['Width'])
          ]),
          h('.mid'),
          h('.field', [
            this.inputHeight = h('input', {type: 'number', disabled: true}),
            h('label', ['Height'])
          ])
        ]),
        h('.row', [
          h('label', ['Transform']),
          h('.field', [
            this.inputRotate = h('input', {type: 'number', disabled: true}),
            h('label', ['Rotate'])
          ]),
          h('.mid'),
          h('.field', [
            h('.input', [
              h('.segmented', [
                this.buttonFlipH = h('button.icon16', {disabled: true}),
                this.buttonFlipV = h('button.icon16', {disabled: true})
              ])
            ]),
            h('label', ['Flip'])
          ])
        ])
      ]),
      h('section.matrix', [
        h('.row', [
          h('label', ['Opacity']),
          h('.slider', [
            this.inputOpacitySlider = h('input', {type: 'range', value: 0, min: 0, max: 100, disabled: true})
          ]),
          h('.field', [
            this.inputOpacity = h('input', {type: 'number', disabled: true})
          ])
        ]),
        h('.row', [
          h('label', ['Blending']),
          h('.field', [
            this.inputBlending = h('select', {disabled: true}, [
              h('option', ['Normal']),
              h('hr'),
              h('option', ['Darken']),
              h('option', ['Multiply']),
              h('option', ['Color Burn']),
              h('hr'),
              h('option', ['Lighten']),
              h('option', ['Screen']),
              h('option', ['Color Dodge']),
              h('hr'),
              h('option', ['Overlay']),
              h('option', ['Soft Light']),
              h('option', ['Hard Light']),
              h('hr'),
              h('option', ['Difference']),
              h('option', ['Exclusion']),
              h('hr'),
              h('option', ['Hue']),
              h('option', ['Saturation']),
              h('option', ['Color']),
              h('option', ['Luminosity'])
            ])
          ])
        ])
      ]),
      h('section', [h('h1', ['Fills'])]),
      h('section', [h('h1', ['Borders'])]),
      h('section', [h('h1', ['Shadows'])]),
      h('section', [h('h1', ['Inner Shadows'])]),
      h('section', [h('h1', ['Gaussian Blur'])]),
    ]),
    h('.panel-footer')
  ])

  this.controls = [this.inputX, this.inputY, this.inputWidth, this.inputHeight, this.inputRotate, this.buttonFlipH, this.buttonFlipV, this.inputOpacitySlider, this.inputOpacity, this.inputBlending]

  this.updateBBox = this.updateBBox.bind(this)
  ;[this.inputX, this.inputY, this.inputWidth, this.inputHeight].forEach(function(input) {
    input.addEventListener('input', this.updateBBox)
  }, this)
}

Inspector.prototype.selectObject = function(object) {
  this.selectedObject = object
  this.setUpFields()
  this.updateFields()
}

Inspector.prototype.setUpFields = function() {
  var object = this.selectedObject
  if (!object) {
    this.controls.forEach(function(control) {
      control.disabled = true
      control.value =
        control === this.inputBlending ? 'Normal' :
        control === this.inputOpacitySlider ? 0 : ''
    }, this)
    return
  }
  this.controls.forEach(function(control) {control.disabled = false})
}

Inspector.prototype.updateFields = function() {
  var object = this.selectedObject
  if (!object) {
    return
  }

  var bb = object.getBBox().floor()
  this.inputX.valueAsNumber = bb.x
  this.inputY.valueAsNumber = bb.y
  this.inputWidth.valueAsNumber = bb.width
  this.inputHeight.valueAsNumber = bb.height

  this.inputOpacity.valueAsNumber =
  this.inputOpacitySlider.valueAsNumber = getComputedStyle(object).opacity * 100
}

Inspector.prototype.updateBBox = function() {
  var object = this.selectedObject
  if (!object || !this.inputX.value || !this.inputY.value || !this.inputWidth.value || !this.inputHeight.value) return
  replaceBBox(object, Rect.normalized(this.inputX.valueAsNumber, this.inputY.valueAsNumber, this.inputWidth.valueAsNumber, this.inputHeight.valueAsNumber))
  this.editor.canvas.updateSelectionBox()
}

exports = Inspector

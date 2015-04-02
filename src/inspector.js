var h = require('html')
var replaceBBox = require('replace-bbox')
var Rect = require('rect')

function Inspector(editor) {
  this.editor = editor

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
            this.inputOpacity = h('input', {type: 'number', min: 0, max: 100, disabled: true})
          ])
        ]),
        h('.row', [
          h('label', ['Blending']),
          h('.field', [
            this.inputBlending = h('select', {disabled: true}, [
              h('option', {value: 'normal'}, ['Normal']),
              h('hr'),
              h('option', {value: 'darken'}, ['Darken']),
              h('option', {value: 'multiply'}, ['Multiply']),
              h('option', {value: 'color-burn'}, ['Color Burn']),
              h('hr'),
              h('option', {value: 'lighten'}, ['Lighten']),
              h('option', {value: 'screen'}, ['Screen']),
              h('option', {value: 'color-dodge'}, ['Color Dodge']),
              h('hr'),
              h('option', {value: 'overlay'}, ['Overlay']),
              h('option', {value: 'soft-light'}, ['Soft Light']),
              h('option', {value: 'hard-light'}, ['Hard Light']),
              h('hr'),
              h('option', {value: 'difference'}, ['Difference']),
              h('option', {value: 'exclusion'}, ['Exclusion']),
              h('hr'),
              h('option', {value: 'hue'}, ['Hue']),
              h('option', {value: 'saturation'}, ['Saturation']),
              h('option', {value: 'color'}, ['Color']),
              h('option', {value: 'luminosity'}, ['Luminosity'])
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
  this.inputOpacity.addEventListener('input', this.updateOpacity.bind(this))
  this.inputOpacitySlider.addEventListener('input', this.updateOpacityFromSlider.bind(this))
  this.inputBlending.addEventListener('input', this.updateBlending.bind(this))

  editor.on('selectionChange', this.onSelectionChange, this)
  editor.on('selectionBoundsChange', this.onSelectionBoundsChange, this)
}

Inspector.prototype.onSelectionChange = function() {
  this.setUpFields()
  this.updateFields()
}

Inspector.prototype.onSelectionBoundsChange = function(e) {
  if (e && e.source === 'inspector') return
  if (this.boundsChangeTimeout) return
  this.boundsChangeTimeout = setTimeout(function() {
    this.updateBoundsFields()
    this.boundsChangeTimeout = null
  }.bind(this), 100)
}

Inspector.prototype.setUpFields = function() {
  var object = this.editor.selection
  if (!object) {
    this.controls.forEach(function(control) {
      control.disabled = true
      control.value =
        control === this.inputBlending ? 'normal' :
        control === this.inputOpacitySlider ? 0 : ''
    }, this)
    return
  }
  this.controls.forEach(function(control) {control.disabled = false})
}

Inspector.prototype.updateFields = function() {
  var object = this.editor.selection
  if (!object) return

  var style = getComputedStyle(object)

  this.updateBoundsFields()

  this.inputOpacity.valueAsNumber =
  this.inputOpacitySlider.valueAsNumber = style.opacity * 100

  this.inputBlending.value = style.mixBlendMode
}

Inspector.prototype.updateBoundsFields = function() {
  var object = this.editor.selection
  if (!object) return

  var bb = object.getBBox().floor()
  this.inputX.valueAsNumber = bb.x
  this.inputY.valueAsNumber = bb.y
  this.inputWidth.valueAsNumber = bb.width
  this.inputHeight.valueAsNumber = bb.height
}

Inspector.prototype.updateBBox = function() {
  var object = this.editor.selection
  if (!object || !this.inputX.value || !this.inputY.value || !this.inputWidth.value || !this.inputHeight.value) return
  replaceBBox(object, Rect.normalized(this.inputX.valueAsNumber, this.inputY.valueAsNumber, this.inputWidth.valueAsNumber, this.inputHeight.valueAsNumber))
  this.editor.emit('selectionBoundsChange', {source: 'inspector'})
}

Inspector.prototype.updateOpacity = function() {
  var object = this.editor.selection
  if (!object) return

  var value = Math.max(0, Math.min(100, this.inputOpacity.valueAsNumber))
  object.style.opacity = value / 100
  this.inputOpacitySlider.valueAsNumber = value
}

Inspector.prototype.updateOpacityFromSlider = function() {
  var object = this.editor.selection
  if (!object) return

  var value = Math.max(0, Math.min(100, this.inputOpacitySlider.valueAsNumber))
  object.style.opacity = value / 100
  this.inputOpacity.valueAsNumber = value
}

Inspector.prototype.updateBlending = function() {
  var object = this.editor.selection
  if (!object) return

  object.style.mixBlendMode = this.inputBlending.value
}

exports = Inspector

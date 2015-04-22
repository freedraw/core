var h = require('fd/html')

function MockInspector() {
  this.el = h('.inspector panel', [
    h('.panel-header'),
    h('.panel-content', [
      h('section.matrix', [
        h('.row', [
          h('label', ['Position']),
          h('.field', [
            h('input', {type: 'number', readOnly: true}),
            h('label', ['X'])
          ]),
          h('.mid'),
          h('.field', [
            h('input', {type: 'number', readOnly: true}),
            h('label', ['Y'])
          ])
        ]),
        h('.row', [
          h('label', ['Size']),
          h('.field', [
            h('input', {type: 'number', readOnly: true}),
            h('label', ['Width'])
          ]),
          h('.mid'),
          h('.field', [
            h('input', {type: 'number', readOnly: true}),
            h('label', ['Height'])
          ])
        ]),
        h('.row', [
          h('label', ['Transform']),
          h('.field', [
            h('input', {type: 'number', readOnly: true}),
            h('label', ['Rotate'])
          ]),
          h('.mid'),
          h('.field', [
            h('.input', [
              h('.segmented', [
                h('button.icon16', {disabled: true}),
                h('button.icon16', {disabled: true})
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
            h('input', {type: 'range', disabled: true})
          ]),
          h('.field', [
            h('input', {type: 'number', readOnly: true})
          ])
        ]),
        h('.row', [
          h('label', ['Blending']),
          h('.field', [
            h('select', {disabled: true}, [
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
}

module.exports = MockInspector

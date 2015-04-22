module.exports = function replaceBBox(object, rect) {
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

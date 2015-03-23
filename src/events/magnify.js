Hooks.dispatchMagnify = function(x, y, magnification) {
  var target = document.elementFromPoint(x, y) || document
  var event = new MouseEvent('magnify', {
    bubbles: true,
    clientX: x,
    clientY: y
  })
  event.magnification = magnification
  target.dispatchEvent(event)
}

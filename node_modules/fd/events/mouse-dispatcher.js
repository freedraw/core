var slice = [].slice

module.exports = function mouseDispatcher(name, fn) {
  return function(clientX, clientY, shiftKey, ctrlKey, altKey, metaKey) {
    var target = document.elementFromPoint(clientX, clientY) || document
    var event = new MouseEvent(name, {
      bubbles: true,
      clientX: clientX,
      clientY: clientY,
      shiftKey: shiftKey,
      ctrlKey: ctrlKey,
      altKey: altKey,
      metaKey: metaKey
    })
    if (fn) fn.apply(event, slice.call(arguments, 6))
    target.dispatchEvent(event)
  }
}

var slice = [].slice

exports = function mouseDispatcher(name, fn) {
  return function(x, y) {
    var target = document.elementFromPoint(x, y) || document
    var event = new MouseEvent(name, {
      bubbles: true,
      clientX: x,
      clientY: y
    })
    fn.apply(event, slice.call(arguments, 2))
    target.dispatchEvent(event)
  }
}

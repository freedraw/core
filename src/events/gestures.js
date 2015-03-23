var mouseDispatcher = require('./mouse-dispatcher')

Hooks.dispatchGestureStart = mouseDispatcher('gesturestart')
Hooks.dispatchGestureEnd = mouseDispatcher('gestureend')
Hooks.dispatchMagnify = mouseDispatcher('magnify', function(delta) {
  this.magnification = delta
})

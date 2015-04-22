var Native = require('native')
var mouseDispatcher = require('./mouse-dispatcher')

Native.hooks.dispatchGestureStart = mouseDispatcher('gesturestart')
Native.hooks.dispatchGestureEnd = mouseDispatcher('gestureend')
Native.hooks.dispatchMagnify = mouseDispatcher('magnify', function(delta) {
  this.magnification = delta
})

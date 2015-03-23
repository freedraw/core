var mouseDispatcher = require('./mouse-dispatcher')

Hooks.dispatchMagnify = mouseDispatcher('magnify', function(delta) {
  this.magnification = delta
})

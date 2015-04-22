function delayedThrow(e) {
  setTimeout(function() {throw e})
}

Promise.prototype.done = function() {
  this.catch(delayedThrow)
}

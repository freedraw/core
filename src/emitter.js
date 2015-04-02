var slice = [].slice

exports = function(object) {

  object.on = function(name, fn, context, once) {
    var map = this.listeners || (this.listeners = Object.create(null))
    var list = map[name] || (map[name] = [])
    list.push({fn: fn, context: context, once: !!once})
    return this
  }

  object.once = function(name, fn, context) {
    this.on(name, fn, context, true)
    return this
  }

  object.unlisten = function(name, fn, context) {
    var map = this.listeners
    if (!map) return this
    var list = map[name]
    if (!list) return this
    for (var i = list.length; i--;) {
      var l = list[i]
      if (l.fn === fn && l.context === context) {
        list.splice(i, 1)
      }
    }
    return this
  }

  object.emit = function(name) {
    var map = this.listeners
    if (!map) return this
    var list = map[name]
    if (!list) return this
    var args = slice.call(arguments, 1)
    for (var i = list.length; i--;) {
      var l = list[i]
      l.fn.apply(l.context, args)
    }
    return this
  }

  return object
}

exports.property = function(object, name) {
  var data = '_' + name
  var event = name + 'Change'
  Object.defineProperty(object, name, {
    get: function() {return this[data]},
    set: function(value) {
      this[data] = value
      this.emit(event)
    }
  })
}

(function(global) {
  'use strict'

  if (typeof Native !== 'undefined') return

  var cache = Object.create(null)
  var isDir = Object.create(null)

  function Require(path) {
    this.path = path
  }
  Require.prototype.require = function(file) {
    file = /\.\//.test(file) ? this.path + file.slice(1) : file
    if (isDir[file]) {
      file += '/_index.js'
    } else {
      var res = read(file + '/_index.js')
      if (res.status === 200) {
        isDir[file] = true
        file += '/_index.js'
      } else {
        if (!/\.[^.]+$/.test(file)) file += '.js'
        res = read(file)
        if (res.status !== 200) throw new Error('Cannot require "'+file+'".')
      }
    }
    if (cache[file]) return cache[file]

    if (/\.js/.test(file)) {
      var f = new Function('require', 'exports', '"use strict";' + res.responseText + ';return exports')
      var req = new Require(file.replace(/\/[^\/]+$/, ''))
      return cache[file] = f.call(global, req.require.bind(req), {})
    }
    if (/\.json/.test(file)) {
      return cache[file] = JSON.parse(res.responseText)
    }
    return cache[file] = res.responseText
  }

  var root = new Require('src')
  function read(path) {
    var xhr = new XMLHttpRequest
    xhr.open('GET', root.path + '/' + path, false)
    xhr.send()
    return xhr
  }

  global.Hooks = {}

  global.Native = {}
  Native.require = function(file) {
    return root.require(file)
  }

  Native.done = function() {}

}(this))

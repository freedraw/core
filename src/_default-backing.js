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

  Native.done = function() {
    Hooks.loadData('public.svg-image', '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg xmlns="http://www.w3.org/2000/svg"> <g transform="translate(200,200)"> <circle cx="0" cy="0" r="30" style="fill: #ff0000; stroke: #000000; stroke-width: 2px;"/> <g transform="rotate(30) translate(30,-100) scale(.5,2)"> <ellipse cx="19.0718" cy="37.8422" rx="60" ry="72.7655" style="fill: #ffff00; stroke: #000000; stroke-width: 1px;"/> <rect x="-230" y="90" width="160" height="40" style="fill: #ff69b4; stroke: #000000; stroke-width: 2px;"/> </g> </g> </svg>')
  }

}(this))

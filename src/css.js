
exports.load = function(file, fn, context) {
  return new Promise(function(resolve, reject) {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = file
    link.onload = function() {
      resolve()
    }
    document.head.appendChild(link)
  })
}

exports.append = function(css) {
  var style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}


exports.load = function(file) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = file
  document.head.appendChild(link)
}

exports.append = function(css) {
  var style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

var platform =
  /OS X/.test(navigator.userAgent) ? 'osx' :
  /Windows/.test(navigator.userAgent) ? 'win' : 'others'

module.exports = function(o) {
  return o[platform] || o.others
}

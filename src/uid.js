var id = 0

module.exports = function uid() {
  return 'a' + ++id
}

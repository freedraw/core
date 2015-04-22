var DisplayNode = require('./display-node')
var inherits = require('inherits')

function Document(props, children) {
  DisplayNode.call(this, props, children)
}
inherits(Document, DisplayNode)

exports = Document

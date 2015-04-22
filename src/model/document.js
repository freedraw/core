var DisplayNode = require('./display-node')
var inherits = require('fd/inherits')

function Document(props, children) {
  DisplayNode.call(this, props, children)
}
inherits(Document, DisplayNode)

module.exports = Document

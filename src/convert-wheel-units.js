var line = 40

exports = function convertWheelUnits(e, pageWidth, pageHeight, pageDepth) {
  var x = e.deltaX
  var y = e.deltaY
  var z = e.deltaZ
  switch (e.deltaMode) {
    case 0: return {x: x, y: y, z: z}
    case 1: return {x: x * line, y: y * line, z: z * line}
    case 2: return {x: x * pageWidth, y: y * pageHeight, z: z * pageDepth}
  }
}
